<script>
    import SearchBar from '$lib/components/SearchBar.svelte';
    import StargazersTable from '$lib/components/StargazersTable.svelte';
    import { onMount } from 'svelte';
    import { fetchRateLimit } from '$lib/utils/api';
    import { apiKeyStore } from '$lib/stores/apiKeyStore';
    import { get } from 'svelte/store';
  
    onMount(async () => {
      const apiKey = get(apiKeyStore);
      if (apiKey) {
        await fetchRateLimit();
      }
    });
  </script>
  
  <main class="container mx-auto p-4">
    <SearchBar />
    <StargazersTable />
  </main>
  