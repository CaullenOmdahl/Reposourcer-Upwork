<!-- src/lib/components/DownloadButton.svelte -->
<script>
  import ErrorAlert from './ErrorAlert.svelte';
  import { generateCSV } from '../utils/csvGenerator';

  export let filteredStargazers = [];
  let downloadError = '';

  const handleDownload = () => {
    downloadError = '';
    if (filteredStargazers.length === 0) {
      downloadError = 'No data available for download.';
      return;
    }

    try {
      generateCSV(filteredStargazers);
    } catch (err) {
      console.error('Error generating CSV:', err);
      downloadError = 'Failed to download CSV. Please try again.';
    }
  };
</script>

<div class="flex items-center space-x-2">
  <button on:click={handleDownload} class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400">
    Download Results as CSV
  </button>

  {#if downloadError}
    <div class="ml-2">
      <ErrorAlert message={downloadError} />
    </div>
  {/if}
</div>
