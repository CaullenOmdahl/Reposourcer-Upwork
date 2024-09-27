<script lang="ts">  // Added lang="ts" for TypeScript
    import "../app.css";
    import { onMount } from "svelte";
    import type { SvelteComponentTyped } from "svelte";
    import SearchForm from './_components/SearchForm.svelte';
    import StargazerTable from './_components/StargazerTable.svelte';
    import Filters from './_components/Filters.svelte';
    import Pagination from './_components/Pagination.svelte';
    import ApiKeyModal from './_components/ApiKeyModal.svelte';  // Import the modal
  
    // Define a type for stargazer objects
    type Stargazer = {
        login: string; // Example property
        location?: string; // Optional property
        email?: string; // Optional property
        avatar_url: string; // Add missing property
        html_url: string; // Add missing property
    };

    // Define props for SearchForm
    type SearchFormProps = {
        repoUrl: string;
        submit: () => void;
    };

    let stargazers: Stargazer[] = []; // Explicitly define the type
    let filteredStargazers: Stargazer[] = []; // Explicitly define the type
    let locationFilter: string = ""; // Explicitly define the type
    let emailAvailable: boolean = false; // Explicitly define as boolean
    let repoUrl: string = ''; // Explicitly define the type
    let totalStargazers: number = 0; // Explicitly define as number
    let currentPage: number = 1; // Explicitly define as number
    let showApiKeyModal: boolean = false; // Explicitly define as boolean
  
    // Check if API key is in session storage
    onMount(() => {
      const apiKey: string | null = sessionStorage.getItem("GITHUB_API_KEY");
      if (!apiKey) {
        showApiKeyModal = true;
      }
    });
  
    // Function to fetch stargazers from the serverless function
    async function fetchStargazers(): Promise<void> {
      const apiKey: string | null = sessionStorage.getItem("GITHUB_API_KEY");
      if (!apiKey) {
        showApiKeyModal = true;
        return;
      }

      // Assuming getOwnerAndRepo is a function that needs to be defined or imported
      // Since it's not defined or imported, we'll define it here for demonstration
      // This function extracts the owner and repository name from a given GitHub repository URL
      function getOwnerAndRepo(url: string): { owner: string; repo: string } | null {
        const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = url.match(regex);
        if (match && match.length > 2) {
          return { owner: match[1], repo: match[2] };
        }
        return null;
      }

      const ownerAndRepo = getOwnerAndRepo(repoUrl);
      if (!ownerAndRepo) {
        console.error("Invalid repository URL format.");
        return;
      }

      const { owner, repo } = ownerAndRepo;

      try {
        const response: Response = await fetch(`/api/getStargazers?owner=${owner}&repo=${repo}&page=${currentPage}&apiKey=${apiKey}`);
        const data: Stargazer[] = await response.json();
        stargazers = data;
        filteredStargazers = stargazers;
      } catch (error) {
        console.error("Error fetching stargazers:", error);
      }
    }
  
    function handleApiKeySubmit(): void {
      showApiKeyModal = false;
      fetchStargazers();  // Fetch stargazers after the API key is submitted
    }
  
    // Function to apply filters
    function applyFilters(): void {
      filteredStargazers = stargazers.filter((user: Stargazer) => {
        const matchesLocation: boolean = !locationFilter || (user.location?.toLowerCase().includes(locationFilter.toLowerCase()) ?? false);
        const matchesEmail: boolean = !emailAvailable || (user.email !== undefined && user.email !== null);
        return matchesLocation && matchesEmail;
      });
    }
  
    $: applyFilters(); // Reactive statement to apply filters
  </script>
  
  <div class="container mx-auto px-4 py-6">
    {#if showApiKeyModal}
      <!-- API Key Modal -->
      <ApiKeyModal onSubmit={handleApiKeySubmit} />
    {/if}
  
    <!-- Main Content (only shown when API key is set) -->
    <SearchForm bind:repoUrl={repoUrl} on:submit={fetchStargazers} submit={fetchStargazers} />
    <Filters bind:locationFilter={locationFilter} bind:emailAvailable={emailAvailable} />
    <StargazerTable stargazers={filteredStargazers} />
    <Pagination 
        bind:currentPage={currentPage} 
        total={totalStargazers} 
        on:pageChange={fetchStargazers}
        />
  </div>
