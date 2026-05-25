/**
 * Redis client — Upstash REST SDK (cloud) or in-memory fallback (local dev).
 *
 * @upstash/redis is a REST-only client and cannot connect to a raw TCP Redis
 * server. In local dev (Docker), we fall back to a simple in-memory store
 * that implements the subset of the Upstash interface used by rate-limit.ts.
 */

import { Redis } from "@upstash/redis";

// ─── In-memory fallback ───────────────────────────────────────────────────────
// Implements only the sorted-set + pipeline subset used by rate-limit.ts.

type SortedSetEntry = { score: number; member: string };

class InMemoryRedis {
  private store = new Map<string, SortedSetEntry[]>();
  private ttls = new Map<string, NodeJS.Timeout>();

  private getSet(key: string): SortedSetEntry[] {
    if (!this.store.has(key)) this.store.set(key, []);
    return this.store.get(key)!;
  }

  async zremrangebyscore(key: string, _min: number, max: number): Promise<number> {
    const set = this.getSet(key);
    const before = set.length;
    const filtered = set.filter((e) => e.score > max);
    this.store.set(key, filtered);
    return before - filtered.length;
  }

  async zadd(key: string, entry: { score: number; member: string }): Promise<number> {
    const set = this.getSet(key);
    set.push(entry);
    return 1;
  }

  async zcard(key: string): Promise<number> {
    return this.getSet(key).length;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const existing = this.ttls.get(key);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      this.store.delete(key);
      this.ttls.delete(key);
    }, seconds * 1000);
    // Allow the process to exit even with pending timers
    if (timer.unref) timer.unref();
    this.ttls.set(key, timer);
    return 1;
  }

  async zrem(key: string, member: string): Promise<number> {
    const set = this.getSet(key);
    const idx = set.findIndex((e) => e.member === member);
    if (idx === -1) return 0;
    set.splice(idx, 1);
    return 1;
  }

  /**
   * Minimal pipeline: buffers calls and runs them sequentially.
   * Returns an array of results in the same order as the calls.
   */
  pipeline(): InMemoryPipeline {
    return new InMemoryPipeline(this);
  }
}

class InMemoryPipeline {
  private ops: Array<() => Promise<unknown>> = [];

  constructor(private db: InMemoryRedis) {}

  zremrangebyscore(key: string, min: number, max: number): this {
    this.ops.push(() => this.db.zremrangebyscore(key, min, max));
    return this;
  }

  zadd(key: string, entry: { score: number; member: string }): this {
    this.ops.push(() => this.db.zadd(key, entry));
    return this;
  }

  zcard(key: string): this {
    this.ops.push(() => this.db.zcard(key));
    return this;
  }

  expire(key: string, seconds: number): this {
    this.ops.push(() => this.db.expire(key, seconds));
    return this;
  }

  async exec(): Promise<unknown[]> {
    const results: unknown[] = [];
    for (const op of this.ops) {
      results.push(await op());
    }
    return results;
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────

let redis: Redis | InMemoryRedis;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  // Upstash cloud — REST API works from any Next.js environment
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} else {
  // Local dev / Docker without Upstash — use in-memory store
  console.warn(
    "[redis] UPSTASH_REDIS_REST_URL not set. Using in-memory rate-limit store (not suitable for multi-instance production)."
  );
  redis = new InMemoryRedis();
}

export { redis };
export type { InMemoryRedis };
