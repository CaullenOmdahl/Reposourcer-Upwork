import axios from 'axios';
import { redisGet, redisSet } from './redis';  // Import redis utility functions

export default async (req, res) => {
  const { owner, repo, page = 1 } = req.query;
  const cacheKey = `${owner}-${repo}-${page}`;

  // Check Redis cache first
  const cachedStargazers = await redisGet(cacheKey);
  if (cachedStargazers) {
    return res.status(200).json(cachedStargazers);
  }

  // If cache miss, make GitHub API call
  try {
    const apiKey = process.env.GITHUB_API_KEY;
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/stargazers`,
      {
        headers: {
          Authorization: `token ${apiKey}`,
        },
        params: {
          per_page: 100,
          page,
        },
      }
    );

    // Save the stargazers data to Redis (with a TTL of 1 hour)
    await redisSet(cacheKey, response.data, 3600);

    // Send response to the client
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching stargazers:', error);
    return res.status(500).json({ error: 'Error fetching stargazers' });
  }
};
