// src/lib/utils/fetchStargazers.js
import { updateCurrentPage, setStargazers, setLoading, setError } from '../stores/stargazersStore';

export async function loadStargazers(owner, repo, page = 1, per_page = 25) {
  if (!owner || !repo) {
    console.error('Owner and repository name must be provided.');
    setError('Owner and repository name must be provided.');
    setLoading(false);
    return;
  }
  setLoading(true);

  try {
    const response = await fetch(`/api/stargazers/${owner}/${repo}?page=${page}&per_page=${per_page}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch stargazers.');
    }

    const data = await response.json();

    setStargazers(data.stargazers, {
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage,
    });

    updateCurrentPage(data.currentPage);
  } catch (error) {
    console.error('Error fetching stargazers:', error);
    setError(error.message || 'Failed to fetch stargazers.');
  } finally {
    setLoading(false);
  }
}
