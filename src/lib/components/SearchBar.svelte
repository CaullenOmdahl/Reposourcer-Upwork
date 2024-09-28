<!-- src/lib/components/SearchBar.svelte -->
<script>
  import { onMount } from 'svelte';
  import { apiKeyStore } from '../stores/apiKeyStore';
  import { createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';

  let repoURL = '';
  const dispatch = createEventDispatcher();
  let error = '';
  let owner = '';
  let repo = '';
  let successMessage = '';

  const handleSearch = async () => {
    const parsed = validateRepoURL(repoURL);
    if (parsed) {
      error = '';
      owner = parsed.owner;
      repo = parsed.repo;
      // Trigger fetchStargazers or other actions
      dispatch('search', { owner, repo });
    } else {
      error = 'Please enter a valid GitHub repository URL.';
    }
  };
</script>

<div class="mb-4">
  <label for="repoURL" class="block text-sm font-medium text-gray-700">Repository URL</label>
  <div class="mt-1">
    <input
      id="repoURL"
      name="repoURL"
      type="text"
      placeholder="https://github.com/owner/repo"
      bind:value={repoURL}
      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  </div>
  {#if error}
    <p class="mt-2 text-sm text-red-600">{error}</p>
  {/if}
  {#if successMessage}
    <p class="mt-2 text-sm text-green-600">{successMessage}</p>
  {/if}
  <button
    on:click={handleSearch}
    class="mt-3 w-full sm:w-auto bg-indigo-600 px-4 py-2 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    Search
  </button>
</div>
