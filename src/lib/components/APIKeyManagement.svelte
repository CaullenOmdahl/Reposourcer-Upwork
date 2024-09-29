<!-- src/lib/components/APIKeyManagement.svelte -->
<script>
  import { apiKeyStore } from '../stores/apiKeyStore';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  let apiKey = '';
  let showModal = false;
  let infoMessage = '';

  const dispatch = createEventDispatcher();

  onMount(() => {
    apiKeyStore.subscribe((value) => {
      apiKey = value;
    });
  });

  const saveAPIKey = () => {
    apiKeyStore.set(apiKey);
    showModal = false;
    dispatch('apiKeyUpdated');
  };

  const openModal = () => {
    showModal = true;
  };
</script>

<button on:click={openModal} class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500">
  {#if apiKey}
    Update API Key
  {:else}
    Set API Key
  {/if}
</button>

{#if showModal}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
      <h2 class="text-2xl font-bold mb-4">Enter Your GitHub API Key</h2>
      <p class="mb-4">
        To fetch stargazer data, please provide a valid GitHub API key. This key is used to authenticate requests and increase your API rate limits.
      </p>
      <input
        type="password"
        bind:value={apiKey}
        placeholder="Your GitHub API Key"
        class="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button on:click={saveAPIKey} class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500">
        Save API Key
      </button>
      <button on:click={() => (showModal = false)} class="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
        Cancel
      </button>
    </div>
  </div>
{/if}
