/**
 * Simple In-Memory Cache
 * 
 * Provides caching for LLM responses to avoid redundant API calls.
 * In production, this should be replaced with Redis or similar.
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class Cache<T> {
  private store: Map<string, CacheEntry<T>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTLSeconds: number = 3600) {
    this.defaultTTL = defaultTTLSeconds * 1000;
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    
    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: T, ttlSeconds?: number): void {
    const ttl = (ttlSeconds ?? this.defaultTTL / 1000) * 1000;
    const expiresAt = Date.now() + ttl;

    this.store.set(key, { value, expiresAt });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }

  /**
   * Generate cache key from request parameters
   */
  static generateKey(...parts: (string | number | boolean | undefined)[]): string {
    return parts
      .filter((p) => p !== undefined)
      .map((p) => String(p))
      .join(':');
  }
}
