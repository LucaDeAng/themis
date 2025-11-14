import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { 
  GenerateInitiativesDto, 
  GenerateBriefDto, 
  EnrichInitiativeDto,
  FeasibilityCheckDto,
  GenerateFullBriefDto
} from './dto/generation.dto';

@Injectable()
export class GenerationService {
  private openaiApiKey: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.openaiApiKey = this.config.get<string>('OPENAI_API_KEY') || '';
  }

  async generateInitiatives(data: GenerateInitiativesDto) {
    // TODO: Implement LLM-powered generation with @themis/core
    throw new BadRequestException('Initiative generation not yet implemented - requires PromptRegistry setup');
  }

  async generateBrief(data: GenerateBriefDto) {
    // TODO: Implement LLM-powered brief generation with @themis/core
    throw new BadRequestException('Brief generation not yet implemented - requires PromptRegistry setup');
  }

  async checkFeasibility(data: FeasibilityCheckDto) {
    if (!this.openaiApiKey) {
      throw new BadRequestException('OpenAI API key not configured');
    }

    try {
      const prompt = `Analyze the feasibility of this initiative:
      
Initiative: ${data.name}
Description: ${data.description}
${data.scores && data.scores.length > 0 ? `Current Scores: ${JSON.stringify(data.scores, null, 2)}` : ''}

Provide a detailed feasibility analysis in JSON format with these fields:
- overallScore: number (0-100)
- technicalFeasibility: number (0-100)
- resourceAvailability: number (0-100)
- timeToMarket: number (0-100)
- riskLevel: "LOW" | "MEDIUM" | "HIGH"
- blockers: string[] (list of potential blockers)
- recommendations: string[] (list of recommendations)
- estimatedDuration: string (e.g., "3-6 months")
- estimatedCost: string (e.g., "€50K-€100K")`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: 'You are a business analyst expert in feasibility studies. Always respond with valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        throw new BadRequestException('OpenAI API request failed');
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;
      
      if (!content) {
        throw new BadRequestException('No response from AI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Feasibility check error:', error);
      throw new BadRequestException('Failed to analyze feasibility: ' + error.message);
    }
  }

  async generateFullBrief(data: GenerateFullBriefDto) {
    if (!this.openaiApiKey) {
      throw new BadRequestException('OpenAI API key not configured');
    }

    try {
      const prompt = `Generate a comprehensive concept brief for this initiative:
      
Initiative: ${data.name}
Description: ${data.description}
Weighted Score: ${data.weightedScore.toFixed(2)}
${data.criterionBreakdown && data.criterionBreakdown.length > 0 ? `Criterion Scores: ${JSON.stringify(data.criterionBreakdown, null, 2)}` : ''}

Create a detailed brief in JSON format with these 6 sections:
- executiveSummary: string (2-3 paragraphs executive overview)
- rationale: string (why this initiative matters strategically)
- risks: string (challenges and mitigation strategies)
- metrics: string (how to measure success with KPIs)
- implementation: string (step-by-step execution plan)
- timeline: string (phases and milestones with timeframes)

Make it professional, actionable, and business-focused.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: 'You are a strategic business consultant writing concept briefs. Always respond with valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        throw new BadRequestException('OpenAI API request failed');
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;
      
      if (!content) {
        throw new BadRequestException('No response from AI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Brief generation error:', error);
      throw new BadRequestException('Failed to generate brief: ' + error.message);
    }
  }

  async enrichInitiative(data: EnrichInitiativeDto) {
    // TODO: Implement LLM-powered enrichment with @themis/core
    throw new BadRequestException('Initiative enrichment not yet implemented - requires PromptRegistry setup');
  }
}

