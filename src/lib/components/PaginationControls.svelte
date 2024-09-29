<!-- src/lib/components/PaginationControls.svelte -->
<script>
  import { stargazersStore } from '../stores/stargazersStore';
  import { onDestroy } from 'svelte';

  let currentPage = 1;
  let totalPages = 1;

  // Subscribe to the stargazersStore to get current pagination state
  const unsubscribe = stargazersStore.subscribe((state) => {
    currentPage = state.currentPage;
    const totalStargazers = state.filteredData.length;
    const perPage = state.perPage;
    totalPages = Math.ceil(totalStargazers / perPage);
  });

  /**
   * Navigates to a specific page by updating the store.
   * @param {number} page - The page number to navigate to.
   */
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    // Update the current page in the store
    stargazersStore.update((state) => ({
      ...state,
      currentPage: page,
    }));
  };

  // Clean up the subscription when the component is destroyed
  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="flex items-center justify-center space-x-4 mt-4">
  <button
    on:click={() => goToPage(currentPage - 1)}
    disabled={currentPage === 1}
    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    aria-label="Previous page"
  >
    Previous
  </button>
  
  <span class="text-gray-700">Page {currentPage} of {totalPages}</span>
  
  <button
    on:click={() => goToPage(currentPage + 1)}
    disabled={currentPage === totalPages}
    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    aria-label="Next page"
  >
    Next
  </button>
</div>

<style>
  button:disabled {
    cursor: not-allowed;
  }
</style>
