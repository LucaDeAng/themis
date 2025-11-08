/**
 * Initiative Generator
 * 
 * LLM-powered generation of new initiative ideas based on project goals and criteria.
 * Includes diversity sampling and quality filtering.
 */

import type {
  InitiativeGenerationRequest,
  GeneratedInitiative,
  LLMMessage,
} from '@themis/types';
import { LLMService } from '../llm/llm-service';
import { PromptRegistry } from '../llm/prompt-registry';
import { z } from 'zod';

const GeneratedInitiativeSchema = z.object({
  title: z.string(),
  description: z.string(),
  rationale: z.string(),
  estimatedImpact: z.number().min(1).max(5),
  tags: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

const GenerationResponseSchema = z.array(GeneratedInitiativeSchema);

export class InitiativeGenerator {
  private llmService: LLMService;
  private promptRegistry: PromptRegistry;

  constructor(llmService: LLMService, promptRegistry: PromptRegistry) {
    this.llmService = llmService;
    this.promptRegistry = promptRegistry;
  }

  /**
   * Generate initiative ideas
   */
  async generate(request: InitiativeGenerationRequest): Promise<GeneratedInitiative[]> {
    const count = request.count ?? 10;
    const diversity = request.diversity ?? 0.8;

    const criteriaText = request.criteria
      .map((c) => `- ${c.name}: ${c.description}`)
      .join('\n');

    const prompt = this.promptRegistry.render('initiative_generation', {
      count: String(count),
      goal: request.intent,
      launch: request.intent,
      criteria: criteriaText,
    });

    const systemPrompt = this.promptRegistry.getSystemPrompt('initiative_generation');

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt ?? '' },
      { role: 'user', content: prompt },
    ];

    const response = await this.llmService.complete({
      messages,
      temperature: diversity, // Higher temperature = more diverse
      maxTokens: 2000,
    });

    return this.parseResponse(response.content);
  }

  /**
   * Generate initiatives in batches for large counts
   */
  async generateBatch(
    request: InitiativeGenerationRequest,
    batchSize: number = 10,
  ): Promise<GeneratedInitiative[]> {
    const totalCount = request.count ?? 10;
    const batches = Math.ceil(totalCount / batchSize);
    const allInitiatives: GeneratedInitiative[] = [];

    for (let i = 0; i < batches; i++) {
      const batchRequest: InitiativeGenerationRequest = {
        ...request,
        count: Math.min(batchSize, totalCount - i * batchSize),
      };

      const initiatives = await this.generate(batchRequest);
      allInitiatives.push(...initiatives);
    }

    return allInitiatives;
  }

  /**
   * Parse and validate LLM response
   */
  private parseResponse(content: string): GeneratedInitiative[] {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1]! : content;

      const parsed = JSON.parse(jsonStr);
      const validated = GenerationResponseSchema.parse(parsed);

      return validated;
    } catch (error) {
      throw new Error(
        `Failed to parse initiative generation response: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Filter generated initiatives by quality thresholds
   */
  filterByQuality(
    initiatives: GeneratedInitiative[],
    minImpact: number = 3,
    minConfidence: number = 0.6,
  ): GeneratedInitiative[] {
    return initiatives.filter(
      (i) => i.estimatedImpact >= minImpact && i.confidence >= minConfidence,
    );
  }

  /**
   * Rank generated initiatives by impact and confidence
   */
  rankInitiatives(initiatives: GeneratedInitiative[]): GeneratedInitiative[] {
    return [...initiatives].sort((a, b) => {
      const scoreA = a.estimatedImpact * a.confidence;
      const scoreB = b.estimatedImpact * b.confidence;
      return scoreB - scoreA;
    });
  }
}
