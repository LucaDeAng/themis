/**
 * Prompt Registry
 * 
 * Centralized management of prompt templates with versioning.
 * All LLM prompts should be registered here for consistency and evaluation.
 */

import type { PromptTemplate } from '@themis/types';

export class PromptRegistry {
  private templates: Map<string, Map<string, PromptTemplate>> = new Map();

  /**
   * Register a new prompt template
   */
  register(template: PromptTemplate): void {
    if (!this.templates.has(template.id)) {
      this.templates.set(template.id, new Map());
    }

    const versions = this.templates.get(template.id)!;
    versions.set(template.version, template);
  }

  /**
   * Get a prompt template by ID and optional version
   */
  get(id: string, version?: string): PromptTemplate | undefined {
    const versions = this.templates.get(id);
    if (!versions) return undefined;

    if (version) {
      return versions.get(version);
    }

    // Return latest version if no version specified
    const sortedVersions = Array.from(versions.keys()).sort().reverse();
    return versions.get(sortedVersions[0]!);
  }

  /**
   * List all registered templates
   */
  list(): PromptTemplate[] {
    const templates: PromptTemplate[] = [];
    
    for (const versions of this.templates.values()) {
      for (const template of versions.values()) {
        templates.push(template);
      }
    }

    return templates;
  }

  /**
   * Render a template with variables
   */
  render(id: string, variables: Record<string, string>, version?: string): string {
    const template = this.get(id, version);
    if (!template) {
      throw new Error(`Template '${id}' not found`);
    }

    let rendered = template.template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
    }

    // Check for unresolved variables
    const unresolvedMatch = rendered.match(/\{\{(\w+)\}\}/);
    if (unresolvedMatch) {
      throw new Error(`Unresolved variable: ${unresolvedMatch[1]}`);
    }

    return rendered;
  }

  /**
   * Get system prompt for a template
   */
  getSystemPrompt(id: string, version?: string): string | undefined {
    const template = this.get(id, version);
    return template?.systemPrompt;
  }
}

// ============================================================================
// Default Prompt Templates
// ============================================================================

export const DEFAULT_PROMPTS: PromptTemplate[] = [
  {
    id: 'intent_capture',
    name: 'Intent Capture',
    description: 'Convert free-form text into structured objectives',
    version: '1.0.0',
    template: `Based on this user input, extract structured objectives:

User Input: {{userInput}}

Extract:
1. Primary Goal: What the user wants to achieve
2. Launch Target: What they want to deliver/launch
3. Key Objectives: 3-5 specific objectives

Format your response as JSON:
{
  "goal": "...",
  "launch": "...",
  "objectives": ["...", "...", "..."]
}`,
    variables: ['userInput'],
    systemPrompt:
      'You are an expert product strategist helping teams clarify their objectives.',
  },

  {
    id: 'initiative_generation',
    name: 'Initiative Generation',
    description: 'Generate initiative ideas based on goals and criteria',
    version: '1.0.0',
    template: `Generate {{count}} initiative ideas that align with these goals and criteria:

Project Goal: {{goal}}
Launch Target: {{launch}}

Evaluation Criteria:
{{criteria}}

For each initiative, provide:
- Title (concise, actionable)
- Description (2-3 sentences)
- Rationale (why it matters)
- Estimated Impact (1-5)
- Relevant Tags

Format as JSON array:
[
  {
    "title": "...",
    "description": "...",
    "rationale": "...",
    "estimatedImpact": 4,
    "tags": ["tag1", "tag2"],
    "confidence": 0.85
  }
]`,
    variables: ['count', 'goal', 'launch', 'criteria'],
    systemPrompt:
      'You are an innovative product strategist with expertise in generating high-impact initiatives. Focus on practicality, feasibility, and strategic alignment.',
  },

  {
    id: 'brief_generation',
    name: 'Concept Brief Generation',
    description: 'Generate comprehensive concept brief for an initiative',
    version: '1.0.0',
    template: `Generate a concept brief for this initiative:

Title: {{title}}
Description: {{description}}
Overall Score: {{score}}/1.0

Criterion Scores:
{{criterionScores}}

Generate these sections:

1. Executive Summary (2-3 sentences)
2. Rationale (why this initiative matters, strategic fit)
3. Risks & Mitigation (key risks and how to address them)
4. Success Metrics (3-5 measurable KPIs)
5. Image Prompt (vivid description for visual generation)

Format as JSON:
{
  "executiveSummary": "...",
  "rationale": "...",
  "risks": "...",
  "metrics": "...",
  "imagePrompt": "..."
}`,
    variables: ['title', 'description', 'score', 'criterionScores'],
    systemPrompt:
      'You are a strategic business analyst creating concise, actionable concept briefs. Be specific, measurable, and realistic.',
  },

  {
    id: 'enrichment',
    name: 'Initiative Enrichment',
    description: 'Enrich initiative with additional context and insights',
    version: '1.0.0',
    template: `Enrich this initiative with additional context:

Title: {{title}}
Description: {{description}}

Project Context:
Goals: {{goals}}
Criteria: {{criteria}}

Provide:
1. Enhanced Description (expand with relevant details)
2. Suggested Tags (5-7 relevant tags)
3. Potential Risks (3-5 key risks)
4. Related Concepts (similar or complementary ideas)

Format as JSON:
{
  "enhancedDescription": "...",
  "suggestedTags": ["tag1", "tag2"],
  "potentialRisks": ["risk1", "risk2"],
  "relatedConcepts": ["concept1", "concept2"]
}`,
    variables: ['title', 'description', 'goals', 'criteria'],
    systemPrompt:
      'You are an expert analyst helping teams develop more complete initiative descriptions.',
  },

  {
    id: 'similarity_check',
    name: 'Similarity Check',
    description: 'Check if two initiatives are duplicates or highly similar',
    version: '1.0.0',
    template: `Compare these two initiatives and determine if they are duplicates or highly similar:

Initiative A:
Title: {{titleA}}
Description: {{descriptionA}}

Initiative B:
Title: {{titleB}}
Description: {{descriptionB}}

Respond with JSON:
{
  "similarity": 0.85,  // 0.0 to 1.0
  "isDuplicate": true,
  "reason": "..."
}`,
    variables: ['titleA', 'descriptionA', 'titleB', 'descriptionB'],
    systemPrompt:
      'You are an expert at identifying duplicate or highly similar initiatives. Be precise in your similarity assessment.',
  },
];

/**
 * Create and populate default registry
 */
export function createDefaultRegistry(): PromptRegistry {
  const registry = new PromptRegistry();
  
  for (const template of DEFAULT_PROMPTS) {
    registry.register(template);
  }

  return registry;
}
