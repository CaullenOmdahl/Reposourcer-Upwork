<!-- src/lib/components/APIKeyModal.svelte -->
<script>
    import { onMount } from 'svelte';
    import { apiKeyStore } from '../stores/apiKeyStore';
    import { createEventDispatcher } from 'svelte';
    import { browser } from '$app/environment';
  
    let apiKey = '';
    let showModal = false;
    const dispatch = createEventDispatcher();
    let successMessage = '';
  
    onMount(() => {
      if (browser) {
        const storedKey = localStorage.getItem('github_api_key');
        if (!storedKey) {
          showModal = true;
        } else {
          apiKeyStore.set(storedKey);
        }
      }
    });
  
    const handleSave = () => {
      if (apiKey.trim()) {
        apiKeyStore.set(apiKey.trim());
        successMessage = 'API Key saved successfully!';
        // Automatically close the modal after a short delay
        setTimeout(() => {
          successMessage = '';
          showModal = false;
          dispatch('keySaved');
        }, 1500);
      }
    };
  
    const handleClose = () => {
      // Optionally prevent closing without a key
      // For now, allow closing
      showModal = false;
    };
  </script>
  
  {#if showModal}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl mb-4">Enter GitHub API Key</h2>
        <input
          type="password"
          bind:value={apiKey}
          placeholder="GitHub API Key"
          class="w-full p-2 border rounded mb-4"
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
  {/if}
  