// src/lib/utils/redis.js
import { Redis } from '@upstash/redis';

// Initialize Redis client using environment variables
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN, // If required
});

// Optional: If using REST API
export const redisRest = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
});
