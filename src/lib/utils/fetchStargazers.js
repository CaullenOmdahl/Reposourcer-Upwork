// src/lib/utils/fetchStargazers.js
import { setAllStargazers, setLoading, setError, setFilteredStargazers, updateCurrentPage } from '../stores/stargazersStore';
import axios from 'axios';
import { get } from 'svelte/store';
import { apiKeyStore } from '../stores/apiKeyStore';

/**
 * Fetches all stargazers for a given repository and updates the store.
 * @param {string} owner - The repository owner's username.
 * @param {string} repo - The repository name.
 */
export async function loadStargazers(owner, repo) {
  if (!owner || !repo) {
    setError('Owner and repository name must be provided.');
    setLoading(false);
    return;
  }

  setLoading(true);
  setError(null);

  let allStargazers = [];
  let page = 1;
  const per_page = 100; // GitHub API maximum per_page value

  const apiKey = get(apiKeyStore);

  if (!apiKey) {
    setError('GitHub API Key is not set. Please provide your API Key.');
    setLoading(false);
    return;
  }

  try {
    while (true) {
      const response = await axios.get(`/api/stargazers/${owner}/${repo}`, {
        params: {
          page,
          per_page,
        },
        headers: {
          Authorization: `token ${apiKey}`,
        },
      });

      const data = response.data;
      allStargazers = allStargazers.concat(data.stargazers);

      if (data.hasNextPage) {
        page += 1;
      } else {
        break;
      }
    }

    // Update the store with all stargazers
    setAllStargazers(allStargazers);
    setFilteredStargazers(allStargazers); // Initially, no filters applied
    updateCurrentPage(1);
  } catch (error) {
    console.error('Error fetching all stargazers:', error);
    setError(error.response?.data?.error || 'Failed to fetch stargazers.');
  } finally {
    setLoading(false);
  }
}
