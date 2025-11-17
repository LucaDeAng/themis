/**
 * Ollama Provider Implementation
 * 
 * Implements the BaseLLMProvider interface for Ollama (local models).
 * Supports Llama 3, Mistral, and other locally-hosted models.
 */

import type { LLMRequest, LLMResponse, EmbeddingRequest, Embedding, LLMConfig } from '@themis/types';
import { BaseLLMProvider } from './base-provider';

interface OllamaCompletionResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

interface OllamaEmbeddingResponse {
  embedding: number[];
}

export class OllamaProvider extends BaseLLMProvider {
  private baseUrl: string;

  constructor(config: LLMConfig) {
    super(config);
    this.baseUrl = config.baseUrl ?? 'http://localhost:11434';
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    this.validateRequest(request);
    const params = this.applyDefaults(request);

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: params.messages,
          stream: false,
          options: {
            temperature: params.temperature,
            num_predict: params.maxTokens,
            top_p: params.topP,
            stop: request.stop,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = (await response.json()) as OllamaCompletionResponse;

      return {
        content: data.message.content,
        finishReason: data.done ? 'stop' : 'error',
        usage: {
          promptTokens: data.prompt_eval_count ?? 0,
          completionTokens: data.eval_count ?? 0,
          totalTokens: (data.prompt_eval_count ?? 0) + (data.eval_count ?? 0),
        },
        model: data.model,
        provider: 'ollama',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async embed(request: EmbeddingRequest): Promise<Embedding> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model ?? this.config.model,
          prompt: request.text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = (await response.json()) as OllamaEmbeddingResponse;

      return {
        vector: data.embedding,
        model: request.model ?? this.config.model,
        dimensions: data.embedding.length,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  getProviderName(): string {
    return 'ollama';
  }
}
