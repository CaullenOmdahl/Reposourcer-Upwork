<script lang="ts">
    // Define a type for the stargazer user
    type Stargazer = {
        avatar_url: string;
        login: string;
        html_url: string;
        name: string; // User's name
        location: string; // User's location
        company?: string; // User's company (optional)
        total_stars: number; // Total stars given by the user
        twitter?: string; // User's Twitter (optional)
        facebook?: string; // User's Facebook (optional)
        linkedin?: string; // User's LinkedIn (optional)
        x?: string; // User's X (formerly Twitter) (optional)
        stackoverflow?: string; // User's Stack Overflow (optional)
        discord?: string; // User's Discord (optional)
        reddit?: string; // User's Reddit (optional)
        instagram?: string; // User's Instagram (optional)
        website?: string; // User's website (optional)
        email?: string; // User's email (optional)
    };

    // Exporting stargazers prop with a specific type
    export let stargazers: Stargazer[] = [];
    let selectedStargazers: Set<string> = new Set(); // Track selected stargazers

    function toggleSelect(login: string): void {
        selectedStargazers.has(login) ? selectedStargazers.delete(login) : selectedStargazers.add(login);
    }

    function selectAll(): void {
        stargazers.forEach(user => selectedStargazers.add(user.login));
    }

    function deselectAll(): void {
        selectedStargazers.clear();
    }

    function downloadCSV(selected: boolean): void {
        const csvContent = "data:text/csv;charset=utf-8," + 
            (selected ? Array.from(selectedStargazers) : stargazers).map(login => {
                const user = selected ? stargazers.find(u => u.login === login) : login;
                return `${user.login},${user.name},${user.location},${user.company || "N/A"},${user.total_stars},${user.twitter || "N/A"},${user.website || "N/A"},${user.email || "N/A"}`;
            }).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", selected ? "selected_stargazers.csv" : "all_stargazers.csv");
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
                        {#if user.twitter}<a href={user.twitter} target="_blank" aria-label="Twitter">Twitter</a>{/if}
                        {#if user.facebook}<a href={user.facebook} target="_blank" aria-label="Facebook">Facebook</a>{/if}
                        {#if user.linkedin}<a href={user.linkedin} target="_blank" aria-label="LinkedIn">LinkedIn</a>{/if}
                        {#if user.x}<a href={user.x} target="_blank" aria-label="X">X</a>{/if}
                        {#if user.stackoverflow}<a href={user.stackoverflow} target="_blank" aria-label="Stack Overflow">Stack Overflow</a>{/if}
                        {#if user.discord}<a href={user.discord} target="_blank" aria-label="Discord">Discord</a>{/if}
                        {#if user.reddit}<a href={user.reddit} target="_blank" aria-label="Reddit">Reddit</a>{/if}
                        {#if user.instagram}<a href={user.instagram} target="_blank" aria-label="Instagram">Instagram</a>{/if}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.website || "N/A"}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{user.email || "N/A"}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>