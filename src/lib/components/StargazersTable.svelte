<script>
  import { onDestroy } from 'svelte';
  import { stargazersStore } from '../stores/stargazersStore';
  import { filtersStore } from '../stores/filtersStore';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import ErrorAlert from './ErrorAlert.svelte';
  import DownloadButton from './DownloadButton.svelte';
  import PaginationControls from './PaginationControls.svelte';
  import Modal from './Modal.svelte';
  import FilterPanel from './FilterPanel.svelte';
  import { loadStargazers } from '../utils/fetchStargazers';

  let stargazers = [];
  let filteredStargazers = [];
  let locationOptions = [];
  let loading = false;
  let error = '';
  let owner = null;
  let repo = null;
  let showModal = false;
  let selectedImage = '';
  let currentPage = 1;
  let hasNextPage = false;
  let hasPrevPage = false;

  let filters = {};
  const unsubscribeFilters = filtersStore.subscribe((value) => {
    filters = value;
    applyFilters();
  });

  const unsubscribeStargazers = stargazersStore.subscribe((state) => {
    stargazers = state.data;
    loading = state.loading;
    error = state.error;
    owner = state.owner;
    repo = state.repo;
    currentPage = state.currentPage;
    hasNextPage = state.hasNextPage;
    hasPrevPage = state.hasPrevPage;
    updateLocationOptions();
    applyFilters();
  });

  function applyFilters() {
    filteredStargazers = stargazers.filter((user) => {
      let matches = true;

      if (filters.location) {
        matches = matches && user.details?.location?.toLowerCase().includes(filters.location.toLowerCase());
      }

      if (filters.hasEmail) {
        matches = matches && !!user.details?.email;
      }

      if (filters.hasLocation) {
        matches = matches && !!user.details?.location;
      }

      if (filters.hasCompany) {
        matches = matches && !!user.details?.company;
      }

      if (filters.hasTwitter) {
        matches = matches && !!user.details?.twitter_username;
      }

      if (filters.hasWebsite) {
        matches = matches && !!user.details?.blog;
      }

      return matches;
    });

    // Update the store with filtered data for the download button
    stargazersStore.update((state) => ({
      ...state,
      filteredData: filteredStargazers,
    }));
  }

  function updateLocationOptions() {
    const locationsSet = new Set();
    stargazers.forEach(user => {
      if (user.details?.location) {
        locationsSet.add(user.details.location);
      }
    });
    locationOptions = Array.from(locationsSet);
  }

  const handleImageClick = (imageUrl) => {
    selectedImage = imageUrl;
    showModal = true;
  };

  const closeModal = () => {
    showModal = false;
    selectedImage = '';
  };

  onDestroy(() => {
    unsubscribeStargazers();
    unsubscribeFilters();
  });
</script>

{#if owner && repo}
  <!-- Display the table and pagination controls -->
  {#if loading}
    <LoadingSpinner />
  {:else if error}
    <ErrorAlert message={error} />
  {:else}
    <!-- FilterPanel, DownloadButton, and Table Components -->
    <FilterPanel {locationOptions} />
    <DownloadButton />

    <!-- Table rendering -->
    <table class="min-w-full divide-y divide-gray-200 mt-4">
      <thead>
        <tr>
          <th class="px-3 py-2 text-left">Avatar</th>
          <th class="px-3 py-2 text-left">Username</th>
          <th class="px-3 py-2 text-left">Name</th>
          <th class="px-3 py-2 text-left">Location</th>
          <th class="px-3 py-2 text-left">Company</th>
          <th class="px-3 py-2 text-left">Total Stars</th>
          <th class="px-3 py-2 text-left">Activity</th>
          <th class="px-3 py-2 text-left">Twitter</th>
          <th class="px-3 py-2 text-left">Website</th>
          <th class="px-3 py-2 text-left">Email</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        {#each filteredStargazers as user}
          <tr>
            <td class="whitespace-nowrap px-3 py-4">
              <img src={user.avatar_url} alt="{user.login}'s avatar" class="h-10 w-10 rounded-full" />
            </td>
            <td class="whitespace-nowrap px-3 py-4">
              <a href={user.html_url} target="_blank" class="text-indigo-600 hover:text-indigo-900">{user.login}</a>
            </td>
            <td class="whitespace-nowrap px-3 py-4">{user.details?.name || 'N/A'}</td>
            <td class="whitespace-nowrap px-3 py-4">{user.details?.location || 'N/A'}</td>
            <td class="whitespace-nowrap px-3 py-4">{user.details?.company || 'N/A'}</td>
            <td class="whitespace-nowrap px-3 py-4">{user.details?.public_repos || 0}</td>
            <td class="whitespace-nowrap px-3 py-4">
              <img
                src={`https://ghchart.rshah.org/${user.login}`}
                alt="GitHub Activity"
                class="w-20 h-20 cursor-pointer"
                on:click={() => handleImageClick(`https://ghchart.rshah.org/${user.login}`)}
              />
            </td>
            <td class="whitespace-nowrap px-3 py-4">
              {#if user.details?.twitter_username}
                <a
                  href={`https://twitter.com/${user.details.twitter_username}`}
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  @{user.details.twitter_username}
                </a>
              {:else}
                N/A
              {/if}
            </td>
            <td class="whitespace-nowrap px-3 py-4">
              {#if user.details?.blog}
                <a
                  href={user.details.blog.startsWith('http') ? user.details.blog : `http://${user.details.blog}`}
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  Website
                </a>
              {:else}
                N/A
              {/if}
            </td>
            <td class="whitespace-nowrap px-3 py-4">{user.details?.email || 'N/A'}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <PaginationControls />
  {/if}
{:else}
  <p>Please enter a valid repository URL to view stargazers.</p>
{/if}

{#if showModal}
  <Modal on:close={closeModal}>
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">GitHub Activity</h2>
      <button on:click={closeModal} class="text-red-500">Close</button>
    </div>
    <img src={selectedImage} alt="GitHub Activity" class="max-w-full h-auto" />
  </Modal>
{/if}
