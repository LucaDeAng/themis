// ============================================================================
// LLM Provider Types
// ============================================================================

export type LLMProvider = 'openai' | 'anthropic' | 'ollama' | 'local';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: LLMProvider;
}

export interface LLMError {
  provider: LLMProvider;
  code: string;
  message: string;
  retryable: boolean;
}

// ============================================================================
// Prompt Types
// ============================================================================

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  template: string;
  variables: string[];
  systemPrompt?: string;
  examples?: PromptExample[];
  metadata?: Record<string, unknown>;
}

export interface PromptExample {
  input: Record<string, string>;
  expectedOutput: string;
}

export interface PromptRegistry {
  templates: Map<string, PromptTemplate>;
  get(id: string, version?: string): PromptTemplate | undefined;
  register(template: PromptTemplate): void;
  list(): PromptTemplate[];
}

// ============================================================================
// Rate Limiting & Budget
// ============================================================================

export interface RateLimitConfig {
  requestsPerMinute: number;
  tokensPerMinute: number;
  dailyTokenBudget: number;
  workspaceTokenBudget: number;
}

export interface UsageMetrics {
  timestamp: Date;
  provider: LLMProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  durationMs: number;
  success: boolean;
  error?: string;
}

export interface BudgetGuard {
  checkBudget(workspaceId: string, estimatedTokens: number): Promise<boolean>;
  recordUsage(workspaceId: string, usage: UsageMetrics): Promise<void>;
  getUsage(workspaceId: string, period: 'daily' | 'monthly'): Promise<number>;
}

// ============================================================================
// Embedding & Vector Types
// ============================================================================

export interface Embedding {
  vector: number[];
  model: string;
  dimensions: number;
}

export interface EmbeddingRequest {
  text: string;
  model?: string;
}

export interface SimilarityResult {
  id: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Evaluation & Testing
// ============================================================================

export interface EvaluationCase {
  id: string;
  promptTemplateId: string;
  input: Record<string, string>;
  expectedOutput: string;
  criteria: EvaluationCriteria[];
}

export interface EvaluationCriteria {
  name: string;
  type: 'exact_match' | 'semantic_similarity' | 'contains' | 'regex' | 'custom';
  threshold?: number;
  evaluator?: (expected: string, actual: string) => Promise<number>;
}

export interface EvaluationResult {
  caseId: string;
  passed: boolean;
  score: number;
  actualOutput: string;
  criteriaResults: {
    name: string;
    passed: boolean;
    score: number;
    details?: string;
  }[];
  durationMs: number;
}

// ============================================================================
// Generation Tasks
// ============================================================================

export interface InitiativeGenerationRequest {
  projectId: string;
  intent: string;
  criteria: Array<{ name: string; description: string }>;
  count?: number;
  diversity?: number; // 0-1
}

export interface GeneratedInitiative {
  title: string;
  description: string;
  rationale: string;
  estimatedImpact: number; // 1-5
  tags: string[];
  confidence: number; // 0-1
}

export interface BriefGenerationRequest {
  initiativeId: string;
  title: string;
  description: string;
  scores: Record<string, number>;
  criteria: Array<{ name: string; weight: number }>;
  sections: ('executive_summary' | 'rationale' | 'risks' | 'metrics' | 'image_prompt')[];
}

export interface GeneratedBrief {
  executiveSummary: string;
  rationale: string;
  risks: string;
  metrics: string;
  imagePrompt: string;
}

export interface EnrichmentRequest {
  initiative: {
    title: string;
    description: string;
  };
  context: {
    projectGoals: string[];
    criteria: string[];
  };
}

export interface EnrichedInitiative {
  enhancedDescription: string;
  suggestedTags: string[];
  potentialRisks: string[];
  relatedConcepts: string[];
}

// ============================================================================
// Export all types
// ============================================================================

export * from './scoring';
export * from './project';
