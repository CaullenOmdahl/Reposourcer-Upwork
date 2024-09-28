// src/lib/utils/fetchStargazers.js
import { stargazersStore, setStargazers, setLoading, setError } from '../stores/stargazersStore';
import axios from 'axios';

// Use Axios to load stargazers
export async function loadStargazers(owner, repo, page = 1, per_page = 100) {
  setLoading(true);
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

    const stargazers = response.data;
    const hasNextPage = stargazers.length === per_page;
    setStargazers(stargazers, page, hasNextPage);
  } catch (error) {
    setError(error.message || 'Failed to fetch stargazers.');
  }
}
