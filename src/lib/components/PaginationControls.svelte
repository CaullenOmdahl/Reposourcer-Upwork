<!-- src/lib/components/PaginationControls.svelte -->
<script>
  export let pageInfo;
  export let onNextPage;
</script>

<div class="flex justify-center mt-4">
  {#if pageInfo?.hasNextPage}
    <button on:click={onNextPage} class="px-4 py-2 bg-blue-500 text-white rounded">
      Load More
    </button>
  {/if}
</div>

<style>
  button:disabled {
    cursor: not-allowed;
  }
</style>
