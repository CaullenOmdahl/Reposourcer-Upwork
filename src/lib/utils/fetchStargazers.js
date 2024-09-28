// src/lib/utils/fetchStargazers.js
import { stargazersStore, setStargazers, setLoading, setError } from '../stores/stargazersStore';

// Use the native fetch API
export async function loadStargazers(owner, repo, page = 1, per_page = 100) {
  setLoading(true);
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/stargazers?page=${page}&per_page=${per_page}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        // Authorization: `token YOUR_GITHUB_TOKEN`, // Uncomment if authentication is required
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const stargazers = await response.json();
    const hasNextPage = stargazers.length === per_page;
    setStargazers(stargazers, page, hasNextPage);
  } catch (error) {
    setError(error.message || 'Failed to fetch stargazers.');
  }
}
