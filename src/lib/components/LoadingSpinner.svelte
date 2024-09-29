<!-- src/lib/components/LoadingSpinner.svelte -->
<script>
  export let message = "Loading...";
</script>

<div class="flex flex-col items-center justify-center my-8">
  <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
  <p class="mt-2 text-indigo-600">{message}</p>
</div>