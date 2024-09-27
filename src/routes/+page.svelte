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
        avatar_url: string;
        login: string;
        html_url: string;
        name: string;
        location: string;
        company: string;
        total_stars: number; // Ensure this is included
        twitter: string;
        website: string;
        email: string;
    };

    let stargazers: Stargazer[] = []; // Ensure this is defined as let
    let filteredStargazers: Stargazer[] = []; // Explicitly define the type
    let locationFilter: string = ""; // Ensure this is defined as string
    let emailAvailable: boolean = false; // Ensure this is defined as boolean
    let repoUrl: string = ''; // Explicitly define the type
    let totalStargazers: number = 0; // Explicitly define as number
    let currentPage: number = 1; // Explicitly define as number
    let showApiKeyModal: boolean = false; // Explicitly define as boolean
    let apiCallsRemaining: number = 5000; // Example initial value
    let resetTime: string = ""; // Reset time for API calls

    // Check if API key is in session storage
    onMount(() => {
        const apiKey: string | null = sessionStorage.getItem("GITHUB_API_KEY");
        if (!apiKey) {
            showApiKeyModal = true;
        }
    });

    // Function to fetch remaining API calls
    async function fetchRateLimit(apiKey: string): Promise<void> {
        const response = await fetch('https://api.github.com/rate_limit', {
            headers: {
                Authorization: `token ${apiKey}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            apiCallsRemaining = data.resources.core.remaining;
            resetTime = new Date(data.resources.core.reset * 1000).toLocaleTimeString();
        } else {
            console.error("Failed to fetch rate limits");
        }
    }

    // Function to fetch stargazers from the serverless function
    async function fetchStargazers(): Promise<void> {
        const apiKey: string | null = sessionStorage.getItem("GITHUB_API_KEY");
        if (!apiKey) {
            showApiKeyModal = true;
            return;
        }

        const ownerAndRepo = getOwnerAndRepo(repoUrl);
        if (!ownerAndRepo) {
            console.error("Invalid repository URL format.");
            return;
        }

        const { owner, repo } = ownerAndRepo;

        try {
            const response: Response = await fetch(`/api/getStargazers?owner=${owner}&repo=${repo}&page=${currentPage}&apiKey=${apiKey}`);
            const stargazers: Stargazer[] = await response.json();

            // Log the raw stargazers data
            console.log("Raw Stargazers Data:", stargazers);

            // Fetch additional user details for each stargazer
            const detailedStargazers = await Promise.all(stargazers.map(async (stargazer) => {
                const userResponse = await fetch(`https://api.github.com/users/${stargazer.login}`, {
                    headers: {
                        Authorization: `token ${apiKey}`,
                    },
                });
                const userDetails = await userResponse.json();

                return {
                    ...stargazer,
                    name: userDetails.name || "",
                    location: userDetails.location || "",
                    company: userDetails.company || "",
                    twitter: userDetails.twitter_username || "",
                    website: userDetails.blog || "",
                    email: userDetails.email || "",
                    total_stars: stargazer.total_stars || 0,
                };
            }));

            // Log the detailed stargazers data
            console.log("Detailed Stargazers Data:", detailedStargazers);

            let stargazers2: Stargazer[] = detailedStargazers; // Declare stargazers2 as let
            filteredStargazers = stargazers2; // Assign to filteredStargazers
            apiCallsRemaining -= 1; // Decrement API calls remaining

            // Fetch remaining API calls
            await fetchRateLimit(apiKey);
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
    <div class="mb-4 text-sm text-gray-400">
        Remaining API Calls: {apiCallsRemaining}
        <br />
        Rate Limit Resets At: {resetTime}
    </div>
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
