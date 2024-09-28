<!-- src/routes/+page.svelte -->
<script>
    import SearchBar from '$lib/components/SearchBar.svelte';
    import StargazersTable from '$lib/components/StargazersTable.svelte';
    import { onMount } from 'svelte';
    import { fetchRateLimit } from '$lib/utils/api';
    import { rateLimitStore } from '$lib/stores/rateLimitStore';
  
    onMount(async () => {
      // Optionally, fetch rate limit information on mount
      await fetchRateLimit();
    });
  </script>
  
  <main class="container mx-auto p-4">
    <SearchBar />
    <StargazersTable />
  </main>
  