<script>
    import { onMount } from "svelte";
    import SearchForm from './_components/SearchForm.svelte';
    import StargazerTable from './_components/StargazerTable.svelte';
    import Filters from './_components/Filters.svelte';
    import Pagination from './_components/Pagination.svelte';
    import ApiKeyModal from './_components/ApiKeyModal.svelte';  // Import the modal
  
    let stargazers = [];
    let filteredStargazers = [];
    let locationFilter = '';
    let emailAvailable = false;
    let repoUrl = '';
    let totalStargazers = 0;
    let currentPage = 1;
    let showApiKeyModal = false;
  
    // Check if API key is in session storage
    onMount(() => {
      const apiKey = sessionStorage.getItem("GITHUB_API_KEY");
      if (!apiKey) {
        showApiKeyModal = true;
      }
    });
  
    // Function to fetch stargazers from the serverless function
    async function fetchStargazers() {
      const apiKey = sessionStorage.getItem("GITHUB_API_KEY");
      if (!apiKey) {
        showApiKeyModal = true;
        return;
      }
  
      try {
        const response = await fetch(`/api/getStargazers?repo=${repoUrl}&page=${currentPage}&apiKey=${apiKey}`);
        const data = await response.json();
        stargazers = data;
        filteredStargazers = stargazers;
      } catch (error) {
        console.error("Error fetching stargazers:", error);
      }
    }
  
    function handleApiKeySubmit() {
      showApiKeyModal = false;
      fetchStargazers();  // Fetch stargazers after the API key is submitted
    }
  
    // Function to apply filters
    function applyFilters() {
      filteredStargazers = stargazers.filter(user => {
        const matchesLocation = !locationFilter || user.location?.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesEmail = !emailAvailable || user.email;
        return matchesLocation && matchesEmail;
      });
    }
  
    $: applyFilters();
  </script>
  
  <div class="container mx-auto px-4 py-6">
    {#if showApiKeyModal}
      <!-- API Key Modal -->
      <ApiKeyModal onSubmit={handleApiKeySubmit} />
    {/if}
  
    <!-- Main Content (only shown when API key is set) -->
    <SearchForm bind:repoUrl={repoUrl} on:submit={fetchStargazers} />
    <Filters bind:locationFilter={locationFilter} bind:emailAvailable={emailAvailable} />
    <StargazerTable stargazers={filteredStargazers} />
    <Pagination bind:currentPage={currentPage} total={totalStargazers} on:pageChange={fetchStargazers} />
  </div>
  