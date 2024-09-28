// src/lib/utils/redis.js
import { Redis } from '@upstash/redis';

console.log("Redis URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("Redis Token:", process.env.UPSTASH_REDIS_REST_TOKEN);

// Create Redis client using environment variables
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Optional: If using REST API
export const redisRest = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
});
