// src/lib/utils/api.js
import axios from 'axios';
import { get } from 'svelte/store';
import { apiKeyStore } from '../stores/apiKeyStore';
import { Octokit } from '@octokit/rest';
import { rateLimitStore } from '../stores/rateLimitStore';

export async function fetchStargazers(owner, repo, page = 1, per_page = 30) {
  try {
    const apiKey = get(apiKeyStore);
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stargazers`, {
      params: {
        page,
        per_page,
      },
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error in fetchStargazers: ${error.message}`);
    throw error;
  }
}

export async function fetchRateLimit() {
  const apiKey = get(apiKeyStore);

  if (!apiKey) {
    throw new Error('API key is not set. Please provide a valid GitHub API key.');
  }

  const octokit = new Octokit({
    auth: apiKey,
  });

  try {
    const response = await octokit.request('GET /rate_limit', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    rateLimitStore.set(response.data.resources);
  } catch (error) {
    console.error('Error fetching rate limit:', error);
    throw error;
  }
}
