<!-- src/lib/components/PaginationControls.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  export let currentPage = 1;
  export let hasNextPage = false;
  export let hasPrevPage = false;

  const dispatch = createEventDispatcher();

  const goToNext = () => {
    dispatch('paginate', { page: currentPage + 1 });
  };

  const goToPrev = () => {
    dispatch('paginate', { page: currentPage - 1 });
  };
</script>

<div class="flex justify-center items-center space-x-4 mt-4">
  <button
    on:click={goToPrev}
    class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={!hasPrevPage}
  >
    Previous
  </button>
  <span class="text-sm text-gray-700">Page {currentPage}</span>
  <button
    on:click={goToNext}
    class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={!hasNextPage}
  >
    Next
  </button>
</div>
