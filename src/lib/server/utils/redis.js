// src/lib/server/utils/redis.js
import { Redis } from '@upstash/redis';

// This utility should only be used on the server side
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
