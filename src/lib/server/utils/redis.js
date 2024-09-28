// src/lib/utils/redis.js
import { Redis } from '@upstash/redis';

// Create Redis client using environment variables
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
