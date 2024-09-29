<!-- src/lib/components/StargazersTable.svelte -->
<script>
  import { onDestroy } from 'svelte';
  import { stargazersStore } from '../stores/stargazersStore';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import ErrorAlert from './ErrorAlert.svelte';
  import DownloadButton from './DownloadButton.svelte';
  import PaginationControls from './PaginationControls.svelte';
  import Modal from './Modal.svelte';
  import FilterPanel from './FilterPanel.svelte';
  import { loadStargazers } from '../utils/fetchStargazers';

  let stargazers = [];
  let loading = false;
  let error = '';
  let owner = null;
  let repo = null;
  let showModal = false;
  let selectedImage = '';
  let currentPage = 1;
  let perPage = 25; // Default value, will be updated from the store
  let pageInfo = null; // New variable for pagination info
  let filteredStargazers = []; // Declare filteredStargazers
  let locationOptions = []; // Initialize locationOptions

  let filters = {};

  // Subscribe to filtersStore
  import { filtersStore } from '../stores/filtersStore';
  const unsubscribeFilters = filtersStore.subscribe((value) => {
    filters = value;
    applyFilters();
  });

  // Subscribe to stargazersStore
  const unsubscribeStargazers = stargazersStore.subscribe((state) => {
    stargazers = state.allData || [];
    loading = state.loading;
    error = state.error;
    owner = state.owner;
    repo = state.repo;
    currentPage = state.currentPage;
    perPage = state.perPage; // Update perPage from the store
    updateLocationOptions();
  });

  /**
   * Applies filters to the complete list of stargazers.
   */
  function applyFilters() {
    if (!stargazers.length) {
      filteredStargazers = [];
      return;
    }

    filteredStargazers = stargazers.filter((user) => {
      let matches = true;

      if (filters.location) {
        matches =
          matches &&
          user.location?.toLowerCase().includes(filters.location.toLowerCase());
      }

      if (filters.hasEmail) {
        matches = matches && !!user.email;
      }

      if (filters.hasLocation) {
        matches = matches && !!user.location;
      }

      if (filters.hasCompany) {
        matches = matches && !!user.company;
      }

      if (filters.hasTwitter) {
        matches = matches && !!user.twitter_username;
      }

      if (filters.hasWebsite) {
        matches = matches && !!user.blog;
      }

      return matches;
    });

    // Update the store with filtered data for pagination and download
    stargazersStore.update((state) => ({
      ...state,
      filteredData: filteredStargazers,
      currentPage: 1, // Reset to first page after filtering
    }));
  }

  /**
   * Updates location options for autocomplete based on all stargazers.
   */
  function updateLocationOptions() {
    const locationsSet = new Set();
    stargazers.forEach((user) => {
      if (user.location) {
        locationsSet.add(user.location);
      }
    });
    locationOptions = Array.from(locationsSet);
  }

  /**
   * Handles image click to display modal with GitHub activity chart.
   * @param {string} imageUrl - The URL of the activity chart image.
   */
  const handleImageClick = (imageUrl) => {
    selectedImage = imageUrl;
    showModal = true;
  };

  /**
   * Closes the modal.
   */
  const closeModal = () => {
    showModal = false;
    selectedImage = '';
  };

  /**
   * Handles fetching the next page of stargazers.
   */
  const handleNextPage = async () => {
    if (pageInfo?.hasNextPage) {
      pageInfo = await loadStargazers(owner, repo, pageInfo.endCursor);
    }
  };

  // Calculate indices for pagination
  $: startIdx = (currentPage - 1) * perPage;
  $: endIdx = startIdx + perPage;

  // Clean up subscriptions when the component is destroyed
  onDestroy(() => {
    unsubscribeStargazers();
    unsubscribeFilters();
  });
</script>

{#if owner && repo}
  {#if loading}
    <LoadingSpinner />
  {:else if error}
    <ErrorAlert message={error} />
  {:else}
    <!-- Filter Panel and Download Button -->
    <FilterPanel {locationOptions} />
    <DownloadButton {filteredStargazers} />

    <!-- Table Rendering -->
    <table class="min-w-full divide-y divide-gray-200 mt-4">
      <thead>
        <tr>
          <th class="px-3 py-2 text-left">Avatar</th>
          <th class="px-3 py-2 text-left">Username</th>
          <th class="px-3 py-2 text-left">Name</th>
          <th class="px-3 py-2 text-left">Location</th>
          <th class="px-3 py-2 text-left">Company</th>
          <th class="px-3 py-2 text-left">Total Repos</th>
          <th class="px-3 py-2 text-left">Activity</th>
          <th class="px-3 py-2 text-left">Twitter</th>
          <th class="px-3 py-2 text-left">Website</th>
          <th class="px-3 py-2 text-left">Email</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        {#each filteredStargazers.slice(startIdx, endIdx) as user}
          <tr>
            <td class="whitespace-nowrap px-3 py-4">
              <img src={user.avatarUrl} alt="{user.login}'s avatar" class="h-10 w-10 rounded-full" />
            </td>
            <td class="whitespace-nowrap px-3 py-4">
              <a href={user.url} target="_blank" class="text-indigo-600 hover:text-indigo-900">
                {user.login}
              </a>
            </td>
            <td class="whitespace-nowrap px-3 py-4">{user.name || 'N/A'}</td>
            <td class="whitespace-nowrap px-3 py-4">{user.location || 'N/A'}</td>
            <td class="whitespace-nowrap px-3 py-4">{user.company || 'N/A'}</td>
            <td class="whitespace-nowrap px-3 py-4">{user.repositories?.totalCount || 0}</td>
            <td class="whitespace-nowrap px-3 py-4">
              <img
                src={`https://ghchart.rshah.org/${user.login}`}
                alt="GitHub Activity"
                class="w-20 h-20 cursor-pointer"
                on:click={() => handleImageClick(`https://ghchart.rshah.org/${user.login}`)}
              />
            </td>
            <td class="whitespace-nowrap px-3 py-4">
              {#if user.twitterUsername}
                <a
                  href={`https://twitter.com/${user.twitterUsername}`}
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  @{user.twitterUsername}
                </a>
              {:else}
                N/A
              {/if}
            </td>
            <td class="whitespace-nowrap px-3 py-4">
              {#if user.websiteUrl}
                <a
                  href={user.websiteUrl.startsWith('http') ? user.websiteUrl : `http://${user.websiteUrl}`}
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  Website
                </a>
              {:else}
                N/A
              {/if}
            </td>
            <td class="whitespace-nowrap px-3 py-4">{user.email || 'N/A'}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <PaginationControls {pageInfo} onNextPage={handleNextPage} />
  {/if}
{:else}
  <p>Please enter a valid repository URL to view stargazers.</p>
{/if}

{#if showModal}
  <Modal on:close={closeModal}>
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">GitHub Activity</h2>
      <button on:click={closeModal} class="text-red-500">
        Close
      </button>
    </div>
    <img src={selectedImage} alt="GitHub Activity" class="max-w-full h-auto" />
  </Modal>
{/if}
