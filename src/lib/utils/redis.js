// src/lib/utils/redis.js
import { Redis } from '@upstash/redis';

console.log("Redis REST URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("Redis REST Token:", process.env.UPSTASH_REDIS_REST_TOKEN);

// Create Redis client using environment variables
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
