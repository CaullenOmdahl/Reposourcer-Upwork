<script lang="ts">
  // Exporting repoUrl and submit function to parent component
  export let repoUrl: string = ""; // Explicitly typed as string
  export let submit: () => void; // Explicitly typed as a function that returns void

  // Handle form submission
  function handleSubmit(event: Event): void { // Explicitly typed event and return type
      event.preventDefault(); // Prevent default form submission
      submit(); // Call the submit function passed from parent
  }

  // Function to extract owner and repo from the repoUrl
  function getOwnerAndRepo(url: string): { owner: string; repo: string } | null {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
          return { owner: match[1], repo: match[2] };
      }
      return null; // Return null if the format is incorrect
  }
</script>

<form class="mb-6" on:submit={handleSubmit}>
  <label for="repoUrl" class="block text-sm font-medium text-gray-700">GitHub Repository URL</label>
  <div class="mt-1">
      <input
          id="repoUrl"
          type="text"
          bind:value={repoUrl}
          placeholder="https://github.com/owner/repo"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
  </div>
  <button type="submit" class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700">
      Search
  </button>
</form>