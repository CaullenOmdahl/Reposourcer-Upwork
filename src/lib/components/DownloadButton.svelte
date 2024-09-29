<script>
  import { stargazersStore } from '../stores/stargazersStore';
  import { get } from 'svelte/store';
  import ErrorAlert from './ErrorAlert.svelte';
  import { generateCSV } from '../utils/csvGenerator';

  let selectedProfiles = new Set();
  let stargazers = [];
  let downloadError = '';

  const unsubscribe = stargazersStore.subscribe((state) => {
    selectedProfiles = state.selected || new Set();
    stargazers = state.data || [];
  });

  const handleDownload = () => {
    downloadError = '';
    if (selectedProfiles.size === 0) {
      downloadError = 'No profiles selected for download.';
      return;
    }

    try {
      const selectedData = stargazers.filter((user) => selectedProfiles.has(user.login));
      generateCSV(selectedData);
    } catch (err) {
      console.error('Error generating CSV:', err);
      downloadError = 'Failed to download CSV. Please try again.';
    }
  };
</script>

<div>
  <button on:click={handleDownload} class="bg-green-500 text-white px-4 py-2 rounded">
    Download Selected Profiles
  </button>

  {#if downloadError}
    <div class="mt-2">
      <ErrorAlert message={downloadError} />
    </div>
  {/if}
</div>
