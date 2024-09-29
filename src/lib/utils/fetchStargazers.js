// src/lib/utils/fetchStargazers.js

import { setAllStargazers, setLoading, setError, setFilteredStargazers } from '../stores/stargazersStore';
import axios from 'axios';
import { get } from 'svelte/store';
import { apiKeyStore } from '../stores/apiKeyStore';

export async function loadStargazers(owner, repo, cursor = null) {
  if (!owner || !repo) {
    setError('Owner and repository name must be provided.');
    setLoading(false);
    return;
  }

  setLoading(true);
  setError(null);

  const per_page = 100; // Number of stargazers per page
  const apiKey = get(apiKeyStore);

  if (!apiKey) {
    setError('GitHub API Key is not set. Please provide your API Key.');
    setLoading(false);
    return;
  }

  try {
    const response = await axios.get(`/api/stargazers/${owner}/${repo}`, {
      params: {
        per_page,
        cursor,
      },
      headers: {
        Authorization: `token ${apiKey}`,
      },
    });

    const data = response.data;

    // Update the store with fetched stargazers
    setAllStargazers(data.stargazers);
    setFilteredStargazers(data.stargazers, true); // Append new stargazers

    // Return pageInfo for further pagination
    return data.pageInfo;

  } catch (error) {
    console.error('Error fetching stargazers:', error);
    setError(error.response?.data?.error || 'Failed to fetch stargazers.');
  } finally {
    setLoading(false);
  }
}
