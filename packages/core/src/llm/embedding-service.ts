/**
 * Embedding Service
 * 
 * Handles text embedding generation and vector similarity search.
 * Used for initiative deduplication and semantic search.
 */

import type { EmbeddingRequest, Embedding, SimilarityResult } from '@themis/types';
import { LLMService } from './llm-service';

export class EmbeddingService {
  private llmService: LLMService;

  constructor(llmService: LLMService) {
    this.llmService = llmService;
  }

  /**
   * Generate embedding for text
   */
  async generateEmbedding(text: string, model?: string): Promise<Embedding> {
    const request: EmbeddingRequest = { text, model };
    return this.llmService.embed(request);
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateEmbeddings(texts: string[], model?: string): Promise<Embedding[]> {
    return Promise.all(texts.map((text) => this.generateEmbedding(text, model)));
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensions');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i]! * b[i]!;
      normA += a[i]! * a[i]!;
      normB += b[i]! * b[i]!;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Find similar items in a collection using cosine similarity
   */
  findSimilar(
    queryVector: number[],
    candidates: Array<{ id: string; vector: number[]; metadata?: Record<string, unknown> }>,
    threshold: number = 0.8,
    limit: number = 10,
  ): SimilarityResult[] {
    const results: SimilarityResult[] = [];

    for (const candidate of candidates) {
      const similarity = this.cosineSimilarity(queryVector, candidate.vector);
      
      if (similarity >= threshold) {
        results.push({
          id: candidate.id,
          similarity,
          metadata: candidate.metadata,
        });
      }
    }

    // Sort by similarity descending and limit results
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }

  /**
   * Detect duplicate initiatives based on embedding similarity
   */
  async detectDuplicates(
    initiatives: Array<{
      id: string;
      title: string;
      description: string;
      vector?: number[];
    }>,
    threshold: number = 0.85,
  ): Promise<Array<{ id1: string; id2: string; similarity: number }>> {
    // Generate embeddings for initiatives without vectors
    const toEmbed = initiatives.filter((i) => !i.vector);
    if (toEmbed.length > 0) {
      const embeddings = await this.generateEmbeddings(
        toEmbed.map((i) => `${i.title}\n${i.description}`),
      );
      toEmbed.forEach((initiative, idx) => {
        initiative.vector = embeddings[idx]!.vector;
      });
    }

    const duplicates: Array<{ id1: string; id2: string; similarity: number }> = [];

    // Compare all pairs
    for (let i = 0; i < initiatives.length; i++) {
      for (let j = i + 1; j < initiatives.length; j++) {
        const similarity = this.cosineSimilarity(
          initiatives[i]!.vector!,
          initiatives[j]!.vector!,
        );

        if (similarity >= threshold) {
          duplicates.push({
            id1: initiatives[i]!.id,
            id2: initiatives[j]!.id,
            similarity,
          });
        }
      }
    }

    return duplicates.sort((a, b) => b.similarity - a.similarity);
  }
}
