<!-- src/lib/components/APIKeyManagement.svelte -->
<script>
    import { apiKeyStore } from '../stores/apiKeyStore';
    import APIKeyModal from './APIKeyModal.svelte';
    import { get } from 'svelte/store';
  
    let showModal = false;
    let apiKey;

    // Reactive statement to update apiKey whenever the store changes
    $: apiKey = get(apiKeyStore);
  
    const openModal = () => {
      showModal = true;
    };
  
    const handleKeySaved = () => {
      showModal = false;
      // Ensure the API key is updated in the store
      apiKeyStore.set(apiKey);
    };
  
    const removeKey = () => {
      apiKeyStore.set('');
    };
</script>
  
<div class="flex items-center space-x-4">
    <span class="text-sm text-gray-700">API Key: {apiKey ? 'Configured' : 'Not Set'}</span>
    <button on:click={openModal} class="bg-blue-500 text-white px-3 py-1 rounded">
      {apiKey ? 'Update Key' : 'Set Key'}
    </button>
    {#if apiKey}
      <button on:click={removeKey} class="bg-red-500 text-white px-3 py-1 rounded">
        Remove Key
      </button>
    {/if}
</div>
  
{#if showModal}
    <APIKeyModal on:keySaved={handleKeySaved} on:close={() => showModal = false} />
{/if}
