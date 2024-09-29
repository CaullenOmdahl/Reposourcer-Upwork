<!-- src/lib/components/WelcomeModal.svelte -->
<script>
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  let show = false;

  onMount(() => {
    const hasVisited = localStorage.getItem('starScopeHasVisited');
    if (!hasVisited) {
      show = true;
    }
  });

  const close = () => {
    show = false;
    localStorage.setItem('starScopeHasVisited', 'true');
    dispatch('close');
  };
</script>

{#if show}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
      <h2 class="text-2xl font-bold mb-4">Welcome to StarScope!</h2>
      <p class="mb-4">
        StarScope allows you to explore the stargazers of any GitHub repository. Analyze the profiles of users who have shown interest in your projects.
      </p>
      <div class="mb-4">
        <strong>Limitations:</strong>
        <ul class="list-disc list-inside">
          <li>Maximum of 100 stargazers displayed per page.</li>
          <li>GitHub API rate limits apply. Please ensure you have a valid API key.</li>
        </ul>
      </div>
      <p class="mb-4">
        <a href="https://github.com/CaullenOmdahl/StarScope" target="_blank" class="text-blue-500 hover:underline">
          View Source Code on GitHub
        </a>
      </p>
      <button on:click={close} class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500">
        Get Started
      </button>
    </div>
  </div>
{/if}

<style>
  /* Optional: Add any custom styles for the modal */
</style>
