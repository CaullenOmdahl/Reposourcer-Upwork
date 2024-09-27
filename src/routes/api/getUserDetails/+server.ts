import axios from 'axios';
import { redisGet, redisSet } from '../../../lib/redis';  // Import redis utility functions
import type { NextApiRequest, NextApiResponse } from "next"; // Use type-only import for request and response

export default async (req: NextApiRequest, res: NextApiResponse) => { // Specify types for req and res
  const { username } = req.query;
  const cacheKey = `user-${username}`;

  // Check Redis cache first
  const cachedUser = await redisGet(cacheKey);
  if (cachedUser) {
    return res.status(200).json(cachedUser);
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
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ error: 'Error fetching user details' });
  }
};
