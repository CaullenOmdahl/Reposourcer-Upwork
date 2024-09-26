<script>
  // Exporting currentPage, total, and pageChange function
  export let currentPage = 1;
  export let total = 0;
  export let pageChange;

  // Calculate total pages based on total items
  const totalPages = Math.ceil(total / 100);

  // Navigate to a specific page
  function goToPage(page) {
      if (page < 1 || page > totalPages) return; // Prevent invalid page navigation
      currentPage = page; // Update current page
      pageChange(); // Trigger page change event
  }
</script>

{#if totalPages > 1}
  <div class="mt-6 flex justify-between">
      <button
          class="bg-indigo-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-300"
          on:click={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
      >
          Previous
      </button>
      <span class="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
      <button
          class="bg-indigo-600 text-white px-3 py-1 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-300"
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
      >
          Next
      </button>
  </div>
{/if}