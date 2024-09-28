// src/lib/utils/api.js
import axios from 'axios';

// Use Axios to fetch stargazers from GitHub
export async function fetchStargazers(owner, repo, page = 1, per_page = 30) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stargazers`, {
      params: {
        page,
        per_page,
      },
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return response.data;
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
