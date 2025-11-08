/**
 * Rate Limiter
 * 
 * Token bucket implementation for rate limiting LLM API calls.
 */

export interface RateLimiterConfig {
  requestsPerMinute: number;
  tokensPerMinute: number;
}

export class RateLimiter {
  private requestTokens: number;
  private tokenBucket: number;
  private lastRequestRefill: number;
  private lastTokenRefill: number;
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
    this.requestTokens = config.requestsPerMinute;
    this.tokenBucket = config.tokensPerMinute;
    this.lastRequestRefill = Date.now();
    this.lastTokenRefill = Date.now();
  }

  /**
   * Check if a request can be made
   */
  async checkRequest(estimatedTokens: number): Promise<boolean> {
    this.refill();

    if (this.requestTokens >= 1 && this.tokenBucket >= estimatedTokens) {
      this.requestTokens -= 1;
      this.tokenBucket -= estimatedTokens;
      return true;
    }

    return false;
  }

  /**
   * Wait until rate limit allows the request
   */
  async waitForCapacity(estimatedTokens: number): Promise<void> {
    while (!(await this.checkRequest(estimatedTokens))) {
      await this.sleep(100); // Check every 100ms
    }
  }

  /**
   * Refill token buckets based on elapsed time
   */
  private refill(): void {
    const now = Date.now();

    // Refill request tokens
    const requestElapsed = (now - this.lastRequestRefill) / 60000; // minutes
    this.requestTokens = Math.min(
      this.config.requestsPerMinute,
      this.requestTokens + requestElapsed * this.config.requestsPerMinute,
    );
    this.lastRequestRefill = now;

    // Refill token bucket
    const tokenElapsed = (now - this.lastTokenRefill) / 60000; // minutes
    this.tokenBucket = Math.min(
      this.config.tokensPerMinute,
      this.tokenBucket + tokenElapsed * this.config.tokensPerMinute,
    );
    this.lastTokenRefill = now;
  }

  /**
   * Get current capacity
   */
  getCapacity(): { requests: number; tokens: number } {
    this.refill();
    return {
      requests: Math.floor(this.requestTokens),
      tokens: Math.floor(this.tokenBucket),
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
