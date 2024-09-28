// src/lib/utils/fetchStargazers.js
import { stargazersStore, setStargazers, setLoading, setError } from '../stores/stargazersStore';
import { fetchStargazers } from './api'; // Your existing API function
import { get } from 'svelte/store';

export async function loadStargazers(owner, repo, page = 1, per_page = 100) {
  setLoading(true);
  try {
    const stargazers = await fetchStargazers(owner, repo, page, per_page);
    // Determine if there's a next page by checking if the number of stargazers fetched equals per_page
    const hasNextPage = stargazers.length === per_page;
    setStargazers(stargazers, page, hasNextPage);
  } catch (error) {
    setError(error.message || 'Failed to fetch stargazers.');
  }
}
