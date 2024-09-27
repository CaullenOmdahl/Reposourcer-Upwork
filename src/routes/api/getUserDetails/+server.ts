import axios from 'axios';
import { redisGet, redisSet } from '../../../lib/redis';  // Import redis utility functions
import type { RequestHandler } from "@sveltejs/kit"; // Use type-only import for request handler

export const GET: RequestHandler = async (req) => { // Changed 'default' to 'GET'
  const url = new URL(req.url); // Create a URL object from the request URL
  const username = url.searchParams.get("username"); // Get the 'username' query parameter
  const cacheKey = `user-${username}`;

  // Check Redis cache first
  const cachedUser = await redisGet(cacheKey);
  if (cachedUser) {
    return new Response(JSON.stringify(cachedUser), { status: 200 });
  }

  // If cache miss, make GitHub API call
  try {
    const apiKey = process.env.GITHUB_API_KEY;
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `token ${apiKey}`,
        },
      }
    );

    // Save the user data to Redis (with a TTL of 1 hour)
    await redisSet(cacheKey, response.data, 3600);

    // Send response to the client
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return new Response(JSON.stringify({ error: 'Error fetching user details' }), { status: 500 });
  }
};
