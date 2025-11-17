/**
 * OpenAI Provider Implementation
 * 
 * Implements the BaseLLMProvider interface for OpenAI's GPT models.
 * Supports GPT-4, GPT-3.5-turbo, and embedding models.
 */

import OpenAI from 'openai';
import type { LLMRequest, LLMResponse, EmbeddingRequest, Embedding, LLMConfig } from '@themis/types';
import { BaseLLMProvider } from './base-provider';

export class OpenAIProvider extends BaseLLMProvider {
  private client: OpenAI;

  constructor(config: LLMConfig) {
    super(config);

    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
      timeout: config.timeout ?? 30000,
    });
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    this.validateRequest(request);
    const params = this.applyDefaults(request);

    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: params.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        top_p: params.topP,
        frequency_penalty: params.frequencyPenalty,
        presence_penalty: params.presencePenalty,
        stop: request.stop,
        stream: false,
      });

      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No completion choice returned');
      }

      return {
        content: choice.message.content ?? '',
        finishReason: this.mapFinishReason(choice.finish_reason),
        usage: {
          promptTokens: response.usage?.prompt_tokens ?? 0,
          completionTokens: response.usage?.completion_tokens ?? 0,
          totalTokens: response.usage?.total_tokens ?? 0,
        },
        model: response.model,
        provider: 'openai',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async embed(request: EmbeddingRequest): Promise<Embedding> {
    try {
      const response = await this.client.embeddings.create({
        model: request.model ?? 'text-embedding-3-small',
        input: request.text,
      });

      const embedding = response.data[0];
      if (!embedding) {
        throw new Error('No embedding returned');
      }

      return {
        vector: embedding.embedding,
        model: response.model,
        dimensions: embedding.embedding.length,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.models.retrieve('gpt-3.5-turbo');
      return true;
    } catch {
      return false;
    }
  }

  getProviderName(): string {
    return 'openai';
  }

  private mapFinishReason(
    reason: string | null | undefined,
  ): 'stop' | 'length' | 'content_filter' | 'error' {
    switch (reason) {
      case 'stop':
        return 'stop';
      case 'length':
        return 'length';
      case 'content_filter':
        return 'content_filter';
      default:
        return 'error';
    }
  }
}
