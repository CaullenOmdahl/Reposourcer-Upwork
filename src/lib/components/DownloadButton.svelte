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

<div>
  <button on:click={handleDownload} class="bg-green-500 text-white px-4 py-2 rounded">
    Download Results as CSV
  </button>

  {#if downloadError}
    <div class="mt-2">
      <ErrorAlert message={downloadError} />
    </div>
  {/if}
</div>
