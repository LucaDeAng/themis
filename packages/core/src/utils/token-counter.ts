/**
 * Token Counter Utility
 * 
 * Provides token counting for different LLM providers.
 */

export class TokenCounter {
  /**
   * Estimate token count for text (rough approximation)
   * More accurate counting would use tiktoken for OpenAI or specific tokenizers
   */
  static estimate(text: string): number {
    // Rough estimation: ~4 characters per token for English
    // This is a conservative estimate that works reasonably well
    return Math.ceil(text.length / 4);
  }

  /**
   * Estimate tokens for messages array
   */
  static estimateMessages(messages: Array<{ role: string; content: string }>): number {
    let total = 0;
    
    for (const message of messages) {
      // Add overhead for message formatting
      total += 4; // <|start|>role<|message|>content<|end|>
      total += this.estimate(message.content);
    }

    return total + 2; // Add overhead for prompt structure
  }

  /**
   * Calculate max completion tokens given prompt and model limit
   */
  static calculateMaxCompletion(
    promptTokens: number,
    modelLimit: number,
    safetyBuffer: number = 100,
  ): number {
    return Math.max(0, modelLimit - promptTokens - safetyBuffer);
  }

  /**
   * Get model token limits
   */
  static getModelLimit(model: string): number {
    const limits: Record<string, number> = {
      'gpt-4-turbo-preview': 128000,
      'gpt-4': 8192,
      'gpt-3.5-turbo': 16385,
      'claude-3-opus-20240229': 200000,
      'claude-3-sonnet-20240229': 200000,
      'claude-3-haiku-20240307': 200000,
    };

    return limits[model] ?? 4096; // Default conservative limit
  }
}
