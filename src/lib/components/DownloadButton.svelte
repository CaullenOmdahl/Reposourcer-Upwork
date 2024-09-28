<!-- src/lib/components/DownloadButton.svelte -->
<script>
  import Papa from 'papaparse';
  import { stargazersStore } from '../stores/stargazersStore';
  import { get } from 'svelte/store';
  import ErrorAlert from './ErrorAlert.svelte';

  let selectedProfiles = new Set();
  let stargazers = [];
  let downloadError = '';

  stargazersStore.subscribe((state) => {
    selectedProfiles = state.selected;
    stargazers = state.data;
    console.log('DownloadButton store update:', state);
  });

  const handleDownload = () => {
    console.log('Download button clicked.');
    downloadError = '';
    if (selectedProfiles.size === 0) {
      console.log('No profiles selected for download.');
      return;
    }

    try {
      const selectedData = stargazers.filter((user) => selectedProfiles.has(user.login));
      console.log('Selected data for CSV:', selectedData);

      const csvData = selectedData.map((user) => ({
        Username: user.login,
        Name: user.details.name || '',
        Location: user.details.location || '',
        Company: user.details.company || '',
        Total_Stars: user.details.public_gists || 0,
        Twitter: user.details.twitter_username
          ? `https://twitter.com/${user.details.twitter_username}`
          : '',
        Website: user.details.blog || '',
        Email: user.details.email || '',
      }));

      const csv = Papa.unparse(csvData);
      console.log('Generated CSV:', csv);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'stargazers.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('CSV download initiated.');
    } catch (err) {
      console.error('Error generating CSV:', err);
      downloadError = 'Failed to download CSV. Please try again.';
    }
  };
</script>

<div>
  <button
    on:click={handleDownload}
    class="bg-green-500 px-4 py-2 text-center text-sm font-semibold text-white rounded shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
    disabled={selectedProfiles.size === 0}
  >
    Download Selected Profiles
  </button>

  {#if downloadError}
    <div class="mt-2">
      <ErrorAlert message={downloadError} />
    </div>
  {/if}
</div>
