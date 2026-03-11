/**
 * Simple in-memory cache with TTL (Time To Live)
 * Reduces redundant API calls and improves performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get cached data if it exists and hasn't expired
   * @param key Cache key
   * @returns Cached data or undefined
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if cache entry has expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  /**
   * Set cache data with TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Check if key exists and is valid
   * @param key Cache key
   * @returns True if cache hit, false otherwise
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Invalidate specific cache entry
   * @param key Cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   * @param pattern String pattern to match keys
   */
  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired cache entries
   */
  clean(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    entries.forEach(([key, entry]) => {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        this.cache.delete(key);
      }
    });
  }
}

// Singleton instance
export const cache = new Cache();

// Auto-clean every 10 minutes
setInterval(() => {
  cache.clean();
}, 10 * 60 * 1000);

/**
 * Cache TTL presets
 */
export const CacheTTL = {
  SHORT: 1 * 60 * 1000,      // 1 minute
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Generate cache key from function name and parameters
 */
export const generateCacheKey = (prefix: string, params?: Record<string, any>): string => {
  if (!params) {
    return prefix;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${JSON.stringify(params[key])}`)
    .join('&');

  return `${prefix}:${sortedParams}`;
};
