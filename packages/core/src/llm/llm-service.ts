/**
 * Main LLM Service
 * 
 * Provider-agnostic service that routes requests to the appropriate provider.
 * Includes retry logic, error handling, and usage tracking.
 */

import type {
  LLMConfig,
  LLMRequest,
  LLMResponse,
  EmbeddingRequest,
  Embedding,
  UsageMetrics,
} from '@themis/types';
import { BaseLLMProvider } from './base-provider';
import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { OllamaProvider } from './ollama-provider';
import { withRetry } from '../utils/retry';

export class LLMService {
  private provider: BaseLLMProvider;
  private usageCallback?: (metrics: UsageMetrics) => void | Promise<void>;

  constructor(config: LLMConfig, usageCallback?: (metrics: UsageMetrics) => void | Promise<void>) {
    this.provider = this.createProvider(config);
    this.usageCallback = usageCallback;
  }

  /**
   * Generate a completion with automatic retry
   */
  async complete(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    let response: LLMResponse;
    let error: Error | undefined;

    try {
      response = await withRetry(() => this.provider.complete(request), {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2,
      });

      await this.trackUsage(response, Date.now() - startTime, true);
      return response;
    } catch (err) {
      error = err as Error;
      await this.trackUsage(
        {
          content: '',
          finishReason: 'error',
          usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          model: '',
          provider: this.provider.getProviderName() as 'openai' | 'anthropic' | 'ollama',
        },
        Date.now() - startTime,
        false,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Generate embeddings
   */
  async embed(request: EmbeddingRequest): Promise<Embedding> {
    return withRetry(() => this.provider.embed(request), {
      maxAttempts: 3,
      delayMs: 1000,
      backoffMultiplier: 2,
    });
  }

  /**
   * Check provider health
   */
  async healthCheck(): Promise<boolean> {
    return this.provider.healthCheck();
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return this.provider.getProviderName();
  }

  /**
   * Create provider instance based on config
   */
  private createProvider(config: LLMConfig): BaseLLMProvider {
    switch (config.provider) {
      case 'openai':
        return new OpenAIProvider(config);
      case 'anthropic':
        return new AnthropicProvider(config);
      case 'ollama':
        return new OllamaProvider(config);
      default:
        throw new Error(`Unsupported LLM provider: ${config.provider as string}`);
    }
  }

  /**
   * Track usage metrics
   */
  private async trackUsage(
    response: LLMResponse,
    durationMs: number,
    success: boolean,
    error?: string,
  ): Promise<void> {
    if (!this.usageCallback) return;

    const metrics: UsageMetrics = {
      timestamp: new Date(),
      provider: response.provider,
      model: response.model,
      promptTokens: response.usage.promptTokens,
      completionTokens: response.usage.completionTokens,
      totalTokens: response.usage.totalTokens,
      durationMs,
      success,
      error,
    };

    await this.usageCallback(metrics);
  }
}
