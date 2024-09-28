// src/lib/utils/api.js
import { redis } from './redis';
import axios from 'axios';

// Use Axios to fetch stargazers from GitHub and cache in Redis
export async function fetchStargazers(owner, repo, page = 1, per_page = 30) {
  const cacheKey = `stargazers:${owner}:${repo}:page:${page}:per_page:${per_page}`;

  try {
    // Attempt to retrieve data from Redis cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return JSON.parse(cachedData); // Parse cached data before returning
    }

    console.log(`Cache miss for key: ${cacheKey}. Fetching from GitHub API.`);

    // Fetch data from GitHub API using Axios
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stargazers`, {
      params: {
        page,
        per_page,
      },
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const data = response.data;

    // Cache the fetched data in Redis with an expiration time (e.g., 1 hour)
    await redis.set(cacheKey, JSON.stringify(data), { ex: 3600 }); // Expires in 3600 seconds

    return data;
  } catch (error) {
    console.error(`Error in fetchStargazers: ${error.message}`);
    throw error; // Propagate the error to be handled upstream
  }
}

// Fetch rate limit information from GitHub API using Axios
export async function fetchRateLimit() {
  try {
    const response = await axios.get("https://api.github.com/rate_limit", {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    return response.data.rate; // Adjust based on the structure of the response
  } catch (error) {
    console.error(`Error in fetchRateLimit: ${error.message}`);
    throw error; // Propagate the error to be handled upstream
  }
}
