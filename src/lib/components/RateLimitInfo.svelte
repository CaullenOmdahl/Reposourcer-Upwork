<!-- src/lib/components/RateLimitInfo.svelte -->
<script>
    import { rateLimitStore } from '../stores/rateLimitStore';
    import { get } from 'svelte/store';
  
    let rateLimit = get(rateLimitStore);
  
    rateLimitStore.subscribe(value => {
      rateLimit = value;
    });
  </script>
  
  <div class="mt-4 p-4 bg-gray-100 rounded shadow">
    <p class="text-sm text-gray-700">
      API Requests Remaining: {rateLimit.remaining}
    </p>
    {#if rateLimit.reset}
      <p class="text-sm text-gray-700">
        Rate Limit Resets At: {rateLimit.reset.toLocaleTimeString()}
      </p>
    {/if}
  </div>
  