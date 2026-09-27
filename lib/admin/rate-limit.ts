interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryInSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;

  if (buckets.size > 5000) {
    for (const [existing, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(existing);
    }
  }

  return { allowed: true, remaining: limit - bucket.count };
}

export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}
