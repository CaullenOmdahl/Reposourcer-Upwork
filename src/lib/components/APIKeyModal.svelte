<script>
    import { apiKeyStore } from '../stores/apiKeyStore';
    import { createEventDispatcher, onMount } from 'svelte';
    import { browser } from '$app/environment';
  
    let apiKey = '';
    const dispatch = createEventDispatcher();
    let successMessage = '';
  
    onMount(() => {
      if (browser) {
        const storedKey = localStorage.getItem('github_api_key');
        if (storedKey) {
          apiKeyStore.set(storedKey);
          apiKey = storedKey;
        }
      }
    });
  
    const handleSave = () => {
      if (apiKey.trim()) {
        const sanitizedKey = apiKey.trim(); // Remove unnecessary character filtering
        apiKeyStore.set(sanitizedKey);
        localStorage.setItem('github_api_key', sanitizedKey);
        successMessage = 'API Key saved successfully!';
        setTimeout(() => {
          successMessage = '';
          dispatch('keySaved');
        }, 1500);
      }
    };
  
    const handleClose = () => {
      dispatch('close');
    };
  </script>
  
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    tabindex="-1"
    aria-modal="true"
    role="dialog"
  >
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-xl mb-4">Enter GitHub API Key</h2>
      <input
        type="text"
        bind:value={apiKey}
        placeholder="GitHub API Key"
        class="w-full p-2 border rounded mb-4"
        aria-label="GitHub API Key"
      />
      {#if successMessage}
        <p class="text-green-500 mb-2">{successMessage}</p>
      {/if}
      <div class="flex justify-end space-x-2">
        <button on:click={handleClose} class="bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Cancel
        </button>
        <button on:click={handleSave} class="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  </div>
  