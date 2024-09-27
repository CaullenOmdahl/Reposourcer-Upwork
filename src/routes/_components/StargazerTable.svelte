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
</script>

<div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Link</th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            {#each stargazers as user}
                <tr on:click={() => toggleSelect(user.login)}>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" checked={selectedStargazers.has(user.login)} />
                        <img src={user.avatar_url} alt={user.login} class="h-10 w-10 rounded-full" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <a href={user.html_url} target="_blank" class="text-indigo-600 hover:text-indigo-900">{user.login}</a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.location}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.company}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.total_stars}</td>
                    <td class="px-6 py-4 whitespace-nowrap"><a href={user.twitter} target="_blank">Twitter</a></td>
                    <td class="px-6 py-4 whitespace-nowrap"><a href={user.website} target="_blank">Website</a></td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.email}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>