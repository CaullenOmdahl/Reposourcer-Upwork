<script>
  import "../app.css";
  import { onMount } from "svelte";
  import SearchForm from './_components/SearchForm.svelte';
  import StargazerTable from './_components/StargazerTable.svelte';
  import Filters from './_components/Filters.svelte';
  import Pagination from './_components/Pagination.svelte';
  import ApiKeyModal from './_components/ApiKeyModal.svelte'; // Import the modal

  let stargazers = [];
  let filteredStargazers = [];
  let locationFilter = '';
  let emailAvailable = false;
  let repoUrl = '';
  let totalStargazers = 0;
  let currentPage = 1;
  let showModal = true; // Control modal visibility

  // Function to fetch stargazers from serverless API
  async function fetchStargazers() {
      const apiKey = sessionStorage.getItem("GITHUB_API_KEY"); // Get API key from session storage
      try {
          const response = await fetch(`/api/getStargazers?repo=${repoUrl}&page=${currentPage}`, {
              headers: {
                  Authorization: `token ${apiKey}` // Use the API key in the request
              }
          });
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`); // Log HTTP errors
          }
          const data = await response.json();
          stargazers = data;
          filteredStargazers = stargazers;
      } catch (error) {
          console.error("Error fetching stargazers:", error); // Log the error
          alert("An error occurred while fetching stargazers. Please try again."); // Notify the user
      }
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

  // Function to handle API key submission
  function handleApiKeySubmit() {
      showModal = false; // Hide the modal after submission
      fetchStargazers(); // Fetch stargazers after API key is set
  }
</script>

{#if showModal}
  <ApiKeyModal on:submit={handleApiKeySubmit} />
{/if}

<div class="container mx-auto px-4 py-6">
  <!-- Search Form Component -->
  <SearchForm bind:repoUrl={repoUrl} on:submit={fetchStargazers} />

  <!-- Filters Component -->
  <Filters bind:locationFilter={locationFilter} bind:emailAvailable={emailAvailable} />

  <!-- Stargazer Table Component -->
  <StargazerTable stargazers={filteredStargazers} />

  <!-- Pagination Component -->
  <Pagination bind:currentPage={currentPage} total={totalStargazers} on:pageChange={fetchStargazers} />
</div>