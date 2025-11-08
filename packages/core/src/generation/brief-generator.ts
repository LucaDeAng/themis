/**
 * Brief Generator
 * 
 * Generate comprehensive concept briefs for initiatives including
 * executive summary, rationale, risks, metrics, and image prompts.
 */

import type { BriefGenerationRequest, GeneratedBrief, LLMMessage } from '@themis/types';
import { LLMService } from '../llm/llm-service';
import { PromptRegistry } from '../llm/prompt-registry';
import { z } from 'zod';

const GeneratedBriefSchema = z.object({
  executiveSummary: z.string(),
  rationale: z.string(),
  risks: z.string(),
  metrics: z.string(),
  imagePrompt: z.string(),
});

export class BriefGenerator {
  private llmService: LLMService;
  private promptRegistry: PromptRegistry;

  constructor(llmService: LLMService, promptRegistry: PromptRegistry) {
    this.llmService = llmService;
    this.promptRegistry = promptRegistry;
  }

  /**
   * Generate complete concept brief
   */
  async generate(request: BriefGenerationRequest): Promise<GeneratedBrief> {
    const criterionScores = request.criteria
      .map((c) => {
        const score = request.scores[c.name] ?? 0;
        return `- ${c.name} (weight: ${c.weight.toFixed(2)}): ${score.toFixed(2)}/5.0`;
      })
      .join('\n');

    const overallScore = this.calculateOverallScore(request.scores, request.criteria);

    const prompt = this.promptRegistry.render('brief_generation', {
      title: request.title,
      description: request.description,
      score: overallScore.toFixed(3),
      criterionScores,
    });

    const systemPrompt = this.promptRegistry.getSystemPrompt('brief_generation');

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt ?? '' },
      { role: 'user', content: prompt },
    ];

    const response = await this.llmService.complete({
      messages,
      temperature: 0.7,
      maxTokens: 1500,
    });

    return this.parseResponse(response.content);
  }

  /**
   * Regenerate a specific section of a brief
   */
  async regenerateSection(
    request: BriefGenerationRequest,
    section: 'executiveSummary' | 'rationale' | 'risks' | 'metrics' | 'imagePrompt',
    currentBrief?: Partial<GeneratedBrief>,
  ): Promise<string> {
    const sectionPrompts = {
      executiveSummary: 'Write a 2-3 sentence executive summary',
      rationale:
        'Explain the rationale and strategic fit in 3-4 paragraphs',
      risks: 'Identify 3-5 key risks with mitigation strategies',
      metrics: 'Define 3-5 measurable success metrics (KPIs)',
      imagePrompt:
        'Create a vivid visual description for image generation (focus on mood, style, and key elements)',
    };

    const context = currentBrief
      ? Object.entries(currentBrief)
          .filter(([key]) => key !== section)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n\n')
      : '';

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content:
          'You are a strategic business analyst creating concise, actionable concept briefs.',
      },
      {
        role: 'user',
        content: `For this initiative:
Title: ${request.title}
Description: ${request.description}

${context}

${sectionPrompts[section]}

Return only the requested section content, no additional formatting.`,
      },
    ];

    const response = await this.llmService.complete({
      messages,
      temperature: 0.7,
      maxTokens: 500,
    });

    return response.content.trim();
  }

  /**
   * Calculate overall weighted score
   */
  private calculateOverallScore(
    scores: Record<string, number>,
    criteria: Array<{ name: string; weight: number }>,
  ): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const criterion of criteria) {
      const score = scores[criterion.name] ?? 0;
      totalScore += score * criterion.weight;
      totalWeight += criterion.weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Parse and validate LLM response
   */
  private parseResponse(content: string): GeneratedBrief {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1]! : content;

      const parsed = JSON.parse(jsonStr);
      const validated = GeneratedBriefSchema.parse(parsed);

      return validated;
    } catch (error) {
      throw new Error(`Failed to parse brief generation response: ${(error as Error).message}`);
    }
  }

  /**
   * Generate image prompt only
   */
  async generateImagePrompt(
    title: string,
    description: string,
    style: string = 'modern, professional',
  ): Promise<string> {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content:
          'You are an expert at creating vivid image generation prompts. Focus on visual elements, mood, style, and composition.',
      },
      {
        role: 'user',
        content: `Create an image generation prompt for this initiative:
Title: ${title}
Description: ${description}
Style: ${style}

The prompt should be detailed, specific, and optimized for image generation AI (DALL-E, Midjourney, Stable Diffusion).`,
      },
    ];

    const response = await this.llmService.complete({
      messages,
      temperature: 0.8,
      maxTokens: 200,
    });

    return response.content.trim();
  }
}
