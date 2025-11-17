/**
 * Anthropic Provider Implementation
 * 
 * Implements the BaseLLMProvider interface for Anthropic's Claude models.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { LLMRequest, LLMResponse, EmbeddingRequest, Embedding, LLMConfig } from '@themis/types';
import { BaseLLMProvider } from './base-provider';

export class AnthropicProvider extends BaseLLMProvider {
  private client: Anthropic;

  constructor(config: LLMConfig) {
    super(config);

    if (!config.apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.client = new Anthropic({
      apiKey: config.apiKey,
      timeout: config.timeout ?? 30000,
    });
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    this.validateRequest(request);
    const params = this.applyDefaults(request);

    // Extract system message if present
    const systemMessage = params.messages.find((m) => m.role === 'system');
    const userMessages = params.messages.filter((m) => m.role !== 'system');

    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        system: systemMessage?.content,
        messages: userMessages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        top_p: params.topP,
        stop_sequences: request.stop,
      });

      const content = response.content[0];
      if (!content || content.type !== 'text') {
        throw new Error('No text content returned');
      }

      return {
        content: content.text,
        finishReason: this.mapStopReason(response.stop_reason),
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        model: response.model,
        provider: 'anthropic',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async embed(_request: EmbeddingRequest): Promise<Embedding> {
    // Anthropic doesn't provide native embeddings
    // Could integrate with Voyage AI or use OpenAI as fallback
    throw new Error('Anthropic does not provide native embedding models');
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: this.config.model,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      });
      return true;
    } catch {
      return false;
    }
  }

  getProviderName(): string {
    return 'anthropic';
  }

  private mapStopReason(
    reason: string | null | undefined,
  ): 'stop' | 'length' | 'content_filter' | 'error' {
    switch (reason) {
      case 'end_turn':
      case 'stop_sequence':
        return 'stop';
      case 'max_tokens':
        return 'length';
      default:
        return 'error';
    }
  }
}
