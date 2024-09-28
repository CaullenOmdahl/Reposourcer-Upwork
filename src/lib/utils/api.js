// src/lib/utils/api.js
import { redis } from './redis';

// Use the native fetch API
export async function fetchStargazers(owner, repo, page = 1, per_page = 30) {
  const cacheKey = `stargazers:${owner}:${repo}:page:${page}:per_page:${per_page}`;

  try {
    // Attempt to retrieve data from Redis cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cachedData;
    }

    console.log(`Cache miss for key: ${cacheKey}. Fetching from GitHub API.`);

    // Fetch data from GitHub API using the native fetch
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/stargazers?page=${page}&per_page=${per_page}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        // Authorization: `token YOUR_GITHUB_TOKEN`, // Uncomment if authentication is required
      },
    });

    if (!response.ok) {
      const errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Cache the fetched data in Redis with an expiration time (e.g., 1 hour)
    await redis.set(cacheKey, data, { ex: 3600 }); // Expires in 3600 seconds

    return data;
  } catch (error) {
    console.error(`Error in fetchStargazers: ${error.message}`);
    throw error; // Propagate the error to be handled upstream
  }
}

export async function fetchRateLimit() {
  try {
    const response = await fetch("https://api.github.com/rate_limit", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Authorization: `token YOUR_GITHUB_TOKEN`, // Uncomment if authentication is required
      },
    });

    if (!response.ok) {
      const errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.rate; // Adjust based on the structure of the response
  } catch (error) {
    console.error(`Error in fetchRateLimit: ${error.message}`);
    throw error; // Propagate the error to be handled upstream
  }
}
