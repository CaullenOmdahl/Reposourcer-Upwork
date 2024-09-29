// src/lib/utils/fetchRateLimit.js
import { rateLimitStore, setRateLimit } from '../stores/rateLimitStore';
import axios from 'axios';
import { get } from 'svelte/store';
import { apiKeyStore } from '../stores/apiKeyStore';

/**
 * Fetches the current rate limit status and updates the store.
 */
export async function fetchRateLimit() {
  const apiKey = get(apiKeyStore);

  if (!apiKey) {
    throw new Error('GitHub API Key is not set. Please provide your API Key.');
  }

  try {
    const response = await axios.get('/api/rate_limit', {
      headers: {
        Authorization: `token ${apiKey}`,
      },
    });

    const data = response.data;
    setRateLimit(data.resources);
  } catch (error) {
    console.error('Error fetching rate limit:', error);
    throw error;
  }
}
