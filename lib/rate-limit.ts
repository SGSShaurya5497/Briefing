import { redis } from "@/lib/redis";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Sliding-window rate limiter backed by Redis (Upstash) or in-memory fallback.
 * @param identifier  Unique key, e.g. "user:<id>" or "ip:<ip>"
 * @param maxRequests Max allowed requests within the window
 * @param windowHours Window duration in hours
 */
export async function rateLimit(
  identifier: string,
  maxRequests: number = parseInt(process.env.RATE_LIMIT_MAX ?? "10", 10),
  windowHours: number = parseInt(process.env.RATE_LIMIT_WINDOW_HOURS ?? "1", 10)
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`;
  const windowSeconds = windowHours * 3600;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const member = `${now}:${Math.random()}`;

  // Cast to work with both Upstash Redis and the in-memory fallback —
  // both expose the same sorted-set API surface used here.
  // eslint-disable-next-line
  const r = redis as any;
  const pipeline = r.pipeline();

  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, { score: now, member });
  pipeline.zcard(key);
  pipeline.expire(key, windowSeconds);

  const results: unknown[] = await pipeline.exec();
  const count = (results[2] as number) ?? 0;

  const resetAt = new Date(now + windowSeconds * 1000);
  const remaining = Math.max(0, maxRequests - count);

  if (count > maxRequests) {
    await r.zrem(key, member);
    return { success: false, remaining: 0, resetAt };
  }

  return { success: true, remaining, resetAt };
}
