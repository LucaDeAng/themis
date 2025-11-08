/**
 * Enrichment Service
 * 
 * Enrich initiatives with additional context, tags, risks, and related concepts.
 */

import type { EnrichmentRequest, EnrichedInitiative, LLMMessage } from '@themis/types';
import { LLMService } from '../llm/llm-service';
import { PromptRegistry } from '../llm/prompt-registry';
import { z } from 'zod';

const EnrichedInitiativeSchema = z.object({
  enhancedDescription: z.string(),
  suggestedTags: z.array(z.string()),
  potentialRisks: z.array(z.string()),
  relatedConcepts: z.array(z.string()),
});

export class EnrichmentService {
  private llmService: LLMService;
  private promptRegistry: PromptRegistry;

  constructor(llmService: LLMService, promptRegistry: PromptRegistry) {
    this.llmService = llmService;
    this.promptRegistry = promptRegistry;
  }

  /**
   * Enrich an initiative with additional context
   */
  async enrich(request: EnrichmentRequest): Promise<EnrichedInitiative> {
    const prompt = this.promptRegistry.render('enrichment', {
      title: request.initiative.title,
      description: request.initiative.description,
      goals: request.context.projectGoals.join('\n'),
      criteria: request.context.criteria.join('\n'),
    });

    const systemPrompt = this.promptRegistry.getSystemPrompt('enrichment');

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt ?? '' },
      { role: 'user', content: prompt },
    ];

    const response = await this.llmService.complete({
      messages,
      temperature: 0.7,
      maxTokens: 800,
    });

    return this.parseResponse(response.content);
  }

  /**
   * Batch enrich multiple initiatives
   */
  async enrichBatch(requests: EnrichmentRequest[]): Promise<EnrichedInitiative[]> {
    return Promise.all(requests.map((req) => this.enrich(req)));
  }

  /**
   * Generate tags only
   */
  async generateTags(title: string, description: string, count: number = 7): Promise<string[]> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content:
          'You are an expert at categorizing and tagging initiatives. Generate relevant, specific tags.',
      },
      {
        role: 'user',
        content: `Generate ${count} relevant tags for this initiative:
Title: ${title}
Description: ${description}

Return only a JSON array of tags: ["tag1", "tag2", ...]`,
      },
    ];

    const response = await this.llmService.complete({
      messages,
      temperature: 0.6,
      maxTokens: 150,
    });

    try {
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found');
      
      const tags = JSON.parse(jsonMatch[0]) as string[];
      return tags.slice(0, count);
    } catch (error) {
      console.error('Failed to parse tags:', error);
      return [];
    }
  }

  /**
   * Parse and validate LLM response
   */
  private parseResponse(content: string): EnrichedInitiative {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1]! : content;

      const parsed = JSON.parse(jsonStr);
      const validated = EnrichedInitiativeSchema.parse(parsed);

      return validated;
    } catch (error) {
      throw new Error(`Failed to parse enrichment response: ${(error as Error).message}`);
    }
  }
}
