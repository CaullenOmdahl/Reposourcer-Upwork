<script lang="ts">
    import { createEventDispatcher } from "svelte"; // Import the dispatcher

    const dispatch = createEventDispatcher(); // Create the dispatcher

    let locationFilter = '';
    let emailFilter = false;

    const applyFilters = () => {
        dispatch("filterChange", { locationFilter, emailFilter });
    };
</script>

<div class="flex gap-4 mb-4">
    <input type="text" bind:value={locationFilter} placeholder="Filter by location" class="p-2 rounded" />
    <label>
        <input type="checkbox" bind:checked={emailFilter} /> Only with email
    </label>
    <button on:click={applyFilters} class="px-4 py-2 bg-blue-500 text-white rounded">Apply Filters</button>
</div>
