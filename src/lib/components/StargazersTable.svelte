<!-- src/lib/components/StargazersTable.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { stargazersStore } from '../stores/stargazersStore';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import ErrorAlert from './ErrorAlert.svelte';
  import RateLimitInfo from './RateLimitInfo.svelte';
  import DownloadButton from './DownloadButton.svelte';
  import FilterPanel from './FilterPanel.svelte';
  import PaginationControls from './PaginationControls.svelte';
  import { fetchStargazers } from '../utils/api'; // Your API call function

  let stargazers = [];
  let loading = false;
  let error = '';
  let owner = 'owner'; // Replace with dynamic data as needed
  let repo = 'repo'; // Replace with dynamic data as needed

  // Subscribe to the store
  const unsubscribe = stargazersStore.subscribe((state) => {
    stargazers = state.data;
    loading = state.loading;
    error = state.error;
    console.log('Store updated:', state);
  });

  onMount(async () => {
    loading = true;
    error = '';
    console.log(`Fetching stargazers for ${owner}/${repo}...`);
    try {
      const data = await fetchStargazers(owner, repo);
      console.log('Fetched stargazers:', data);
      stargazersStore.set({ data, loading: false, error: '' });
    } catch (err) {
      console.error('Error fetching stargazers:', err);
      error = 'Failed to load stargazers. Please try again later.';
      stargazersStore.set({ data: [], loading: false, error });
    } finally {
      loading = false;
      console.log('Loading complete.');
    }
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="px-4 sm:px-6 lg:px-8">
  <!-- Header Section -->
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold leading-6 text-gray-900">Stargazers</h1>
      <p class="mt-2 text-sm text-gray-700">
        A list of all the stargazers for this repository, including their name, location, company, and more.
      </p>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <DownloadButton />
    </div>
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="mt-4">
      <ErrorAlert message={error} />
    </div>
  {/if}

  <!-- Loading Spinner -->
  {#if loading}
    <LoadingSpinner />
  {:else if !error}
    <!-- Stargazers Table -->
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          {#if stargazers.length === 0}
            <p class="text-center text-gray-500">No stargazers found.</p>
          {:else}
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Avatar</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Username</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Stars</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Activity</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Twitter</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Website</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {#each stargazers as user}
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0">
                      <img src={user.avatar_url} alt={`${user.login}'s avatar`} class="h-10 w-10 rounded-full" />
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <a href={user.html_url} target="_blank" class="text-indigo-600 hover:text-indigo-900">
                        {user.login}
                      </a>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.details.name || 'N/A'}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.details.location || 'N/A'}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.details.company || 'N/A'}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.details.public_gists || 0}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <img src={`https://ghchart.rshah.org/${user.login}`} alt="GitHub Activity" class="w-20 h-20" />
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {#if user.details.twitter_username}
                        <a href={`https://twitter.com/${user.details.twitter_username}`} target="_blank" class="text-blue-500 hover:text-blue-700">
                          @{user.details.twitter_username}
                        </a>
                      {:else}
                        N/A
                      {/if}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {#if user.details.blog}
                        <a href={user.details.blog} target="_blank" class="text-blue-500 hover:text-blue-700">
                          Website
                        </a>
                      {:else}
                        N/A
                      {/if}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.details.email || 'N/A'}
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, {user.login}</span></a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        </div>
      </div>
    </div>

    <!-- Additional Components -->
    <FilterPanel />
    <PaginationControls />
    <RateLimitInfo />
  {/if}
</div>
