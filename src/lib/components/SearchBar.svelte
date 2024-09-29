<!-- src/lib/components/SearchBar.svelte -->
<script>
  import { loadStargazers } from '../utils/fetchStargazers';
  import { stargazersStore } from '../stores/stargazersStore';
  import ErrorAlert from './ErrorAlert.svelte';
  import { get } from 'svelte/store';

  let repoURL = '';
  let inputError = '';

  /**
   * Validates and extracts owner and repo from the provided GitHub repository URL.
   * @param {string} url - The GitHub repository URL.
   * @returns {Object|null} - An object with owner and repo or null if invalid.
   */
  const parseRepoURL = (url) => {
    try {
      const parsedURL = new URL(url);
      const [owner, repo] = parsedURL.pathname.slice(1).split('/');
      if (owner && repo) {
        return { owner, repo };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSearch = async () => {
    inputError = '';
    const parsed = parseRepoURL(repoURL);

    if (!parsed) {
      inputError = 'Please enter a valid GitHub repository URL.';
      return;
    }

    const { owner, repo } = parsed;

    // Update store with owner and repo
    stargazersStore.update((state) => ({
      ...state,
      owner,
      repo,
    }));

    // Load all stargazers
    await loadStargazers(owner, repo);
  };
</script>

<div class="flex items-center space-x-2 mb-4">
  <input
    type="text"
    bind:value={repoURL}
    placeholder="Enter GitHub Repository URL"
    class="flex-grow px-4 py-2 border rounded"
    aria-label="Repository URL"
  />
  <button
    on:click={handleSearch}
    class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
    aria-label="Search"
  >
    Search
  </button>
</div>

{#if inputError}
  <ErrorAlert message={inputError} />
{/if}
