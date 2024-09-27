import axios from 'axios';

// Set the environment variables for Upstash
const UPSTASH_REDIS_URL: string = process.env.UPSTASH_REDIS_REST_URL as string;
const UPSTASH_REDIS_TOKEN: string = process.env.UPSTASH_REDIS_REST_TOKEN as string;

/**
 * Utility function to interact with Upstash for GET operations.
 * 
 * @param key The key to retrieve from the Upstash Redis instance.
 * @returns The value associated with the key if it exists, otherwise null.
 */
export async function redisGet(key: string): Promise<string | null> {
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

/**
 * Utility function to interact with Upstash for SET operations.
 * 
 * @param key The key to set in the Upstash Redis instance.
 * @param value The value to store, must be serializable to JSON.
 * @param ttl The time-to-live for the cache entry in seconds (default is 3600).
 * @returns The response data from the Upstash API.
 */
export async function redisSet(key: string, value: unknown, ttl: number = 3600): Promise<any> {
  try {
    const response = await axios.post(
      `${UPSTASH_REDIS_URL}/set/${key}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}`,
        },
        params: {
          value: JSON.stringify(value), // Ensure value is a valid JSON string
          ex: ttl, // Expiry time in seconds (default is 1 hour)
        },
      }
    );
    return response.data;
  } catch (error: unknown) { // Specify the type of error
    if (axios.isAxiosError(error)) { // Check if it's an Axios error
      console.error('Redis SET error:', error.response?.data || error); // Log detailed error
    } else {
      console.error('Unexpected error:', error); // Handle unexpected errors
    }
  }
}