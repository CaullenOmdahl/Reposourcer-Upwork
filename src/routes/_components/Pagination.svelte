<script lang="ts">
    import { createEventDispatcher } from "svelte"; // Import the dispatcher

    const dispatch = createEventDispatcher(); // Initialize dispatch

    export let currentPage = 1;
    export let totalCount: number = 0; // Ensure this is defined as number
    let pageSize = 30;  // Assuming 30 results per page

    const totalPages = Math.ceil(totalCount / pageSize);

    const changePage = (newPage) => {
        currentPage = newPage;
        dispatch("pageChange", { page: newPage });
    };
</script>

<div class="flex justify-between items-center">
    <button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1} class="px-4 py-2">Previous</button>
    <span>Page {currentPage} of {totalPages}</span>
    <button on:click={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} class="px-4 py-2">Next</button>
</div>
