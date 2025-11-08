/**
 * Base LLM Provider Interface
 * 
 * All LLM providers (OpenAI, Anthropic, Ollama, etc.) must implement this interface.
 * This ensures provider-agnostic usage throughout the application.
 */

import type {
  LLMConfig,
  LLMRequest,
  LLMResponse,
  LLMError,
  EmbeddingRequest,
  Embedding,
} from '@themis/types';

export abstract class BaseLLMProvider {
  protected config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  /**
   * Generate a completion from the LLM
   */
  abstract complete(request: LLMRequest): Promise<LLMResponse>;

  /**
   * Generate embeddings for text
   */
  abstract embed(request: EmbeddingRequest): Promise<Embedding>;

  /**
   * Check if the provider is available and configured correctly
   */
  abstract healthCheck(): Promise<boolean>;

  /**
   * Get the provider name
   */
  abstract getProviderName(): string;

  /**
   * Estimate token count for a string (rough approximation)
   */
  protected estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Handle provider-specific errors and convert to LLMError
   */
  protected handleError(error: unknown): LLMError {
    const err = error as Error;
    return {
      provider: this.config.provider,
      code: 'PROVIDER_ERROR',
      message: err.message || 'Unknown error',
      retryable: this.isRetryableError(err),
    };
  }

  /**
   * Determine if an error is retryable
   */
  protected isRetryableError(error: Error): boolean {
    const retryablePatterns = [
      /rate limit/i,
      /timeout/i,
      /network/i,
      /503/,
      /502/,
      /429/,
    ];
    return retryablePatterns.some((pattern) => pattern.test(error.message));
  }

  /**
   * Validate request parameters
   */
  protected validateRequest(request: LLMRequest): void {
    if (!request.messages || request.messages.length === 0) {
      throw new Error('Request must contain at least one message');
    }

    if (request.temperature !== undefined && (request.temperature < 0 || request.temperature > 2)) {
      throw new Error('Temperature must be between 0 and 2');
    }

    if (request.maxTokens !== undefined && request.maxTokens <= 0) {
      throw new Error('Max tokens must be positive');
    }
  }

  /**
   * Apply default config values to request
   */
  protected applyDefaults(request: LLMRequest): Required<Omit<LLMRequest, 'stop' | 'stream'>> {
    return {
      messages: request.messages,
      temperature: request.temperature ?? this.config.temperature ?? 0.7,
      maxTokens: request.maxTokens ?? this.config.maxTokens ?? 1500,
      topP: request.topP ?? 1.0,
      frequencyPenalty: request.frequencyPenalty ?? 0,
      presencePenalty: request.presencePenalty ?? 0,
    };
  }
}
