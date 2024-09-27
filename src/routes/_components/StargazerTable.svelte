<script lang="ts">
    // Define a type for the stargazer user
    type Stargazer = {
        avatar_url: string;
        login: string;
        html_url: string;
        // Removed optional properties that cannot be populated
    };
  
    // Exporting stargazers prop with a specific type
    export let stargazers: Stargazer[] = [];
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
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <img src={user.avatar_url} alt={user.login} class="h-10 w-10 rounded-full" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <a href={user.html_url} target="_blank" class="text-indigo-600 hover:text-indigo-900">{user.login}</a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <a href={user.html_url} target="_blank" class="text-indigo-600 hover:text-indigo-900">Profile</a>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>