<!-- src/lib/components/RateLimitInfo.svelte -->
<script>
  import { rateLimitStore, setRateLimit } from '../stores/rateLimitStore';
  import { fetchRateLimit } from '../utils/fetchRateLimit';
  import { get } from 'svelte/store';
  import { apiKeyStore } from '../stores/apiKeyStore';
  import ErrorAlert from './ErrorAlert.svelte';
  import { onDestroy } from 'svelte';

  let rateLimits = get(rateLimitStore);
  let errorMessage = '';
  let isFetching = false;

  const unsubscribe = rateLimitStore.subscribe((value) => {
    rateLimits = value;
  });

  const refreshRateLimit = async () => {
    const apiKey = get(apiKeyStore);
    if (apiKey) {
      isFetching = true;
      try {
        await fetchRateLimit();
        errorMessage = '';
      } catch (error) {
        errorMessage = error.response?.data?.error || 'Failed to fetch rate limits.';
      } finally {
        isFetching = false;
      }
    } else {
      errorMessage = 'API key is not set. Please set your API key.';
    }
  };

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="mt-4 p-4 bg-gray-100 rounded shadow">
  <button
    on:click={refreshRateLimit}
    class="mb-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400"
    aria-label="Refresh Rate Limits"
    disabled={isFetching}
  >
    {#if isFetching}
      Refreshing...
    {:else}
      Click to Refresh Rate Limits
    {/if}
  </button>

  {#if errorMessage}
    <ErrorAlert message={errorMessage} />
  {/if}

  {#if rateLimits && Object.keys(rateLimits).length > 0}
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-3 py-2 text-left">Category</th>
            <th class="px-3 py-2 text-left">Limit</th>
            <th class="px-3 py-2 text-left">Remaining</th>
            <th class="px-3 py-2 text-left">Reset Time</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each Object.entries(rateLimits) as [category, info]}
            <tr>
              <td class="px-3 py-2">{category}</td>
              <td class="px-3 py-2">{info.limit}</td>
              <td class="px-3 py-2">{info.remaining}</td>
              <td class="px-3 py-2">
                {#if info.reset}
                  {new Date(info.reset * 1000).toLocaleString()}
                {:else}
                  N/A
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <p class="text-sm text-gray-700">No rate limit information available.</p>
  {/if}
</div>
