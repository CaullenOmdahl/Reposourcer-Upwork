<script>
  import { apiKeyStore } from '../stores/apiKeyStore';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  let apiKey = '';
  const dispatch = createEventDispatcher();
  let successMessage = '';

  onMount(() => {
    const storedKey = localStorage.getItem('github_api_key');
    if (storedKey) {
      apiKey = storedKey;
      apiKeyStore.set(storedKey);
    }
  });

  const saveKey = () => {
    if (apiKey.trim()) {
      apiKeyStore.set(apiKey.trim());
      successMessage = 'API Key saved successfully!';
      setTimeout(() => {
        successMessage = '';
        dispatch('keySaved');
      }, 1500);
    }
  };
</script>

<div>
  <input
    type="text"
    bind:value={apiKey}
    placeholder="Enter GitHub API Key"
    aria-label="GitHub API Key"
  />
  <button on:click={saveKey}>Save API Key</button>
  {#if successMessage}
    <p class="text-green-500">{successMessage}</p>
  {/if}
</div>
