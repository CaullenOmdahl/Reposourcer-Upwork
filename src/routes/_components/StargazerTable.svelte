<script lang="ts">
    // Define a type for the stargazer user
    type Stargazer = {
        avatar_url: string;
        login: string;
        html_url: string;
        name: string;
        location: string;
        company: string;
        total_stars: number;
        twitter: string;
        facebook: string; // Add other social media fields as needed
        linkedin: string;
        x: string; // For X (formerly Twitter)
        stackoverflow: string;
        discord: string;
        reddit: string;
        instagram: string;
        website: string;
        email: string;
    };
  
    // Exporting stargazers prop with a specific type
    export let stargazers: Stargazer[] = [];
  
    let selectedStargazers: Set<string> = new Set(); // Track selected stargazers

    function toggleSelect(login: string): void {
        if (selectedStargazers.has(login)) {
            selectedStargazers.delete(login);
        } else {
            selectedStargazers.add(login);
        }
    }

    function selectAll(): void {
        stargazers.forEach(user => selectedStargazers.add(user.login));
    }

    function deselectAll(): void {
        selectedStargazers.clear();
    }

    function downloadCSV(): void {
        const csvContent = "data:text/csv;charset=utf-8," + 
            Array.from(selectedStargazers).map(login => {
                const user = stargazers.find(u => u.login === login);
                return `${user.login},${user.name},${user.location},${user.company},${user.total_stars},${user.twitter},${user.website},${user.email}`;
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "selected_stargazers.csv");
        document.body.appendChild(link);
        link.click();
    }

    function downloadAllCSV(): void {
        const csvContent = "data:text/csv;charset=utf-8," + 
            stargazers.map(user => {
                return `${user.login},${user.name},${user.location},${user.company},${user.total_stars},${user.twitter},${user.website},${user.email}`;
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "all_stargazers.csv");
        document.body.appendChild(link);
        link.click();
    }
</script>

<div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stars</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Socials</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            {#each stargazers as user}
                <tr on:click={() => toggleSelect(user.login)}>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" checked={selectedStargazers.has(user.login)} on:change={() => toggleSelect(user.login)} />
                        <img src={user.avatar_url} alt={user.login} class="h-10 w-10 rounded-full" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <a href={user.html_url} target="_blank" class="text-indigo-600 hover:text-indigo-900">{user.login}</a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.location}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.company || "N/A"}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.total_stars}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        {#if user.twitter}
                            <a href={user.twitter} target="_blank" aria-label="Twitter">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M22 5.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.343 8.343 0 0 1-2.605.981A4.13 4.13 0 0 0 15.85 4a4.068 4.068 0 0 0-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 0 1 3.4 4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 6.1 13.635a4.192 4.192 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 2 18.184 11.732 11.732 0 0 0 8.291 20 11.502 11.502 0 0 0 19.964 8.5c0-.177 0-.349-.012-.523A8.143 8.143 0 0 0 22 5.892Z" clip-rule="evenodd"/>
                                </svg>
                            </a>
                        {/if}
                        {#if user.facebook}
                            <a href={user.facebook} target="_blank" aria-label="Facebook">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/>
                                </svg>
                            </a>
                        {/if}
                        {#if user.linkedin}
                            <a href={user.linkedin} target="_blank" aria-label="LinkedIn">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd"/>
                                    <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
                                </svg>
                            </a>
                        {/if}
                        {#if user.x}
                            <a href={user.x} target="_blank" aria-label="X">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
                                </svg>
                            </a>
                        {/if}
                        {#if user.stackoverflow}
                            <a href={user.stackoverflow} target="_blank" aria-label="Stack Overflow">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M17 20v-5h2v6.988H3V15h1.98v5H17Z"/>
                                    <path d="m6.84 14.522 8.73 1.825.369-1.755-8.73-1.825-.369 1.755Zm1.155-4.323 8.083 3.764.739-1.617-8.083-3.787-.739 1.64Zm3.372-5.481L10.235 6.08l6.859 5.704 1.132-1.362-6.859-5.704ZM15.57 17H6.655v2h8.915v-2ZM12.861 3.111l6.193 6.415 1.414-1.415-6.43-6.177-1.177 1.177Z"/>
                                </svg>
                            </a>
                        {/if}
                        {#if user.discord}
                            <a href={user.discord} target="_blank" aria-label="Discord">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M18.942 5.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.586 11.586 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3 17.392 17.392 0 0 0-2.868 11.662 15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.638 10.638 0 0 1-1.706-.83c.143-.106.283-.217.418-.331a11.664 11.664 0 0 0 10.118 0c.137.114.277.225.418.331-.544.328-1.116.606-1.71.832a12.58 12.58 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM8.678 14.813a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.929 1.929 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                                </svg>
                            </a>
                        {/if}
                        {#if user.reddit}
                            <a href={user.reddit} target="_blank" aria-label="Reddit">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12.008 16.521a3.84 3.84 0 0 0 2.47-.77v.04a.281.281 0 0 0 .005-.396.281.281 0 0 0-.395-.005 3.291 3.291 0 0 1-2.09.61 3.266 3.266 0 0 1-2.081-.63.27.27 0 0 0-.38.381 3.84 3.84 0 0 0 2.47.77Z"/>
                                    <path fill="currentColor" fill-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-4.845-1.407A1.463 1.463 0 0 1 18.67 12a1.46 1.46 0 0 1-.808 1.33c.01.146.01.293 0 .44 0 2.242-2.61 4.061-5.829 4.061s-5.83-1.821-5.83-4.061a3.25 3.25 0 0 1 0-.44 1.458 1.458 0 0 1-.457-2.327 1.458 1.458 0 0 1 2.063-.064 7.163 7.163 0 0 1 3.9-1.23l.738-3.47v-.006a.31.31 0 0 1 .37-.236l2.452.49a1 1 0 1 1-.132.611l-2.14-.45-.649 3.12a7.11 7.11 0 0 1 3.85 1.23c.259-.246.6-.393.957-.405Z" clip-rule="evenodd"/>
                                    <path fill="currentColor" d="M15.305 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-4.625 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                                </svg>
                            </a>
                        {/if}
                        {#if user.instagram}
                            <a href={user.instagram} target="_blank" aria-label="Instagram">
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                </svg> <!-- Ensure this SVG is properly closed -->
                            </a>
                        {/if}
<script lang="ts">
    // Define a type for the stargazer user
    type Stargazer = {
        avatar_url: string;
        login: string;
        html_url: string;
        name: string; // Added name
        location: string; // Added location
        company: string; // Added company
        total_stars: number; // Added total stars
        twitter: string; // Added Twitter
        website: string; // Added website
        email: string; // Added email
    };
  
    // Exporting stargazers prop with a specific type
    export let stargazers: Stargazer[] = [];
  
    let selectedStargazers: Set<string> = new Set(); // Track selected stargazers

    function toggleSelect(login: string): void {
        if (selectedStargazers.has(login)) {
            selectedStargazers.delete(login);
        } else {
            selectedStargazers.add(login);
        }
    }

    function selectAll(): void {
        stargazers.forEach(user => selectedStargazers.add(user.login));
    }

    function deselectAll(): void {
        selectedStargazers.clear();
    }

    function downloadCSV(): void {
        const csvContent = "data:text/csv;charset=utf-8," + 
            Array.from(selectedStargazers).map(login => {
                const user = stargazers.find(u => u.login === login);
                return `${user.login},${user.name},${user.location},${user.company},${user.total_stars},${user.twitter},${user.website},${user.email}`;
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "selected_stargazers.csv");
        document.body.appendChild(link);
        link.click();
    }

    function downloadAllCSV(): void {
        const csvContent = "data:text/csv;charset=utf-8," + 
            stargazers.map(user => {
                return `${user.login},${user.name},${user.location},${user.company},${user.total_stars},${user.twitter},${user.website},${user.email}`;
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "all_stargazers.csv");
        document.body.appendChild(link);
        link.click();
    }
</script>

<div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stars</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Twitter</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Socials</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            {#each stargazers as user}
                <tr on:click={() => toggleSelect(user.login)}>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" checked={selectedStargazers.has(user.login)} on:change={() => toggleSelect(user.login)} />
                        <img src={user.avatar_url} alt={user.login} class="h-10 w-10 rounded-full" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <a href={user.html_url} target="_blank" class="text-indigo-600 hover:text-indigo-900">{user.login}</a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.location}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.company || "N/A"}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.total_stars}</td>
                    <td class="px-6 py-4 whitespace-nowrap"><a href={user.twitter} target="_blank">Twitter</a></td>
                    <td class="px-6 py-4 whitespace-nowrap"><a href={user.website} target="_blank">{user.website}</a></td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.email}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>