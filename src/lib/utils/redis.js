// src/lib/utils/redis.js
import { Redis } from '@upstash/redis';

// Create Redis client using environment variables
export const redis = Redis.fromEnv();

// Optional: If using REST API
export const redisRest = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
});

console.log("Redis URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("Redis Token:", process.env.UPSTASH_REDIS_REST_TOKEN);
