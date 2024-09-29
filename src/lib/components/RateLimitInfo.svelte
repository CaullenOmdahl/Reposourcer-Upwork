<script>
    import { rateLimitStore } from '../stores/rateLimitStore';
    import { get } from 'svelte/store';
    import { fetchRateLimit } from '../utils/api';
    import { apiKeyStore } from '../stores/apiKeyStore';
    import ErrorAlert from './ErrorAlert.svelte';
  
    let rateLimits = get(rateLimitStore);
    let errorMessage = '';
  
    rateLimitStore.subscribe((value) => {
      rateLimits = value;
    });
  
    const refreshRateLimit = async () => {
      const apiKey = get(apiKeyStore);
      if (apiKey) {
        try {
          await fetchRateLimit();
          errorMessage = '';
        } catch (error) {
          errorMessage = 'Failed to fetch rate limits.';
        }
      } else {
        errorMessage = 'API key is not set. Please set your API key.';
      }
    };
  </script>
  
  <div class="mt-4 p-4 bg-gray-100 rounded shadow">
    <p class="text-sm text-gray-700 cursor-pointer" on:click={refreshRateLimit}>
      Click to Refresh Rate Limits
    </p>
    {#if errorMessage}
      <ErrorAlert message={errorMessage} />
    {/if}
    {#if rateLimits && Object.keys(rateLimits).length > 0}
      <!-- Table content -->
    {:else}
      <p class="text-sm text-gray-700">No rate limit information available.</p>
    {/if}
  </div>
  