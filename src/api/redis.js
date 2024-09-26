import axios from 'axios';

// Set the environment variables for Upstash
const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Utility function to interact with Upstash
export async function redisGet(key) {
  try {
    const response = await axios.get(`${UPSTASH_REDIS_URL}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}`,
      },
    });
    if (response.data.result === null) {
      return null; // Key does not exist in cache
    }
    return JSON.parse(response.data.result);
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

export async function redisSet(key, value, ttl = 3600) {
  try {
    const response = await axios.post(
      `${UPSTASH_REDIS_URL}/set/${key}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}`,
        },
        params: {
          value: JSON.stringify(value),
          ex: ttl, // Expiry time in seconds (default is 1 hour)
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Redis SET error:', error);
  }
}
