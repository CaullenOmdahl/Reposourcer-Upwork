<script>
  import { createEventDispatcher } from 'svelte';
  import { validateRepoURL } from '../utils/validators';
  import { stargazersStore } from '../stores/stargazersStore';
  import { loadStargazers } from '../utils/fetchStargazers';

  let repoURL = '';
  const dispatch = createEventDispatcher();
  let error = '';

  const handleSearch = async () => {
  const result = validateRepoURL(repoURL);
  if (!result) {
    error = 'Please enter a valid GitHub repository URL.';
    return;
  }

  const { owner, repo } = result;

  stargazersStore.update((state) => ({
    ...state,
    owner,
    repo,
    currentPage: 1,
  }));

  await loadStargazers(owner, repo, 1);
};
</script>

<div class="mb-4">
  <label for="repoURL" class="block text-sm font-medium text-gray-700">Repository URL</label>
  <input
    id="repoURL"
    type="text"
    placeholder="https://github.com/owner/repo"
    bind:value={repoURL}
    class="block w-full rounded-md border-gray-300 shadow-sm"
    aria-label="GitHub repository URL"
  />
  {#if error}
    <p class="mt-2 text-sm text-red-600">{error}</p>
  {/if}
  <button on:click={handleSearch} class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded">
    Search
  </button>
</div>
