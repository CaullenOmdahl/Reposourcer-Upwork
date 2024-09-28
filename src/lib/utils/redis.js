// src/lib/utils/redis.js
import { Redis } from '@upstash/redis';

// Initialize Redis client using environment variables
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL, // Use the appropriate URL
  token: process.env.UPSTASH_REDIS_REST_TOKEN, // If required
});

// Optional: If using REST API
export const redisRest = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
});

console.log("Redis URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("Redis Token:", process.env.UPSTASH_REDIS_REST_TOKEN);
