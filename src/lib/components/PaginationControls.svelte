<!-- src/lib/components/PaginationControls.svelte -->
<script>
  import { stargazersStore } from '../stores/stargazersStore';
  import { loadStargazers } from '../utils/fetchStargazers';

  let currentPage = 1;
  let hasNextPage = false;
  let hasPrevPage = false;
  let owner = null;
  let repo = null;

  const unsubscribe = stargazersStore.subscribe((state) => {
    currentPage = state.currentPage;
    hasNextPage = state.hasNextPage;
    hasPrevPage = state.hasPrevPage;
    owner = state.owner;
    repo = state.repo;
  });

  const goToPage = async (page) => {
    if (owner && repo) {
      await loadStargazers(owner, repo, page);
    }
  };
</script>

<div class="flex items-center justify-center space-x-4 mt-4">
  <button
    on:click={() => goToPage(currentPage - 1)}
    disabled={!hasPrevPage}
    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    aria-label="Previous page"
  >
    Previous
  </button>
  <span>Page {currentPage}</span>
  <button
    on:click={() => goToPage(currentPage + 1)}
    disabled={!hasNextPage}
    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
    aria-label="Next page"
  >
    Next
  </button>
</div>
