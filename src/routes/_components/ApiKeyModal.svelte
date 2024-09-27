<script lang="ts">
    export let onSubmit: () => void;  // Define the type for onSubmit as a function
    let apiKey: string = "";  // Explicitly define apiKey as a string
  
    function handleSubmit(event: Event): void {  // Specify event type
      event.preventDefault();
      sessionStorage.setItem("GITHUB_API_KEY", apiKey);  // Store API key in session storage
      onSubmit();  // Call the submit function passed from parent
    }
</script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-md">
      <h2 class="text-lg font-bold mb-4">Enter GitHub API Key</h2>
      <form on:submit={handleSubmit}>
        <input
          type="text"
          bind:value={apiKey}
          placeholder="Your GitHub API Key"
          class="block w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
          required
        />
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Submit
        </button>
      </form>
    </div>
  </div>
