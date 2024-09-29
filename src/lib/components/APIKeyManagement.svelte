<script>
  import { apiKeyStore } from '../stores/apiKeyStore';
  import APIKeyModal from './APIKeyModal.svelte';
  import { onMount, onDestroy } from 'svelte';

  let showModal = false;
  let apiKey = '';

  const unsubscribe = apiKeyStore.subscribe((value) => {
    apiKey = value;
  });

  const openModal = () => {
    showModal = true;
  };

  const handleKeySaved = () => {
    showModal = false;
  };

  const removeKey = () => {
    apiKeyStore.set('');
  };

  onMount(() => {
    if (!apiKey) {
      showModal = true; // Open the modal if no API key is stored
    }
  });

  onDestroy(() => {
    unsubscribe();
  });
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
  <APIKeyModal on:keySaved={handleKeySaved} on:close={() => (showModal = false)} />
{/if}
