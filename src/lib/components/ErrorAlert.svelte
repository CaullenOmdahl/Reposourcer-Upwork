<!-- src/lib/components/ErrorAlert.svelte -->
<script>
  export let message = '';
</script>

<div class="rounded-md bg-red-50 p-4" role="alert" aria-live="assertive">
  <div class="flex">
    <div class="flex-shrink-0">
      <!-- Heroicon: Exclamation Triangle -->
      <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-red-800">Error</h3>
      <div class="mt-2 text-sm text-red-700">
        <p>{message}</p>
      </div>
    </div>
  </div>
</div>
