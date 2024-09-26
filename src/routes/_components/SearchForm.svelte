<script>
  // Exporting repoUrl and submit function to parent component
  export let repoUrl = "";
  export let submit;

  // Handle form submission
  function handleSubmit(event) {
      event.preventDefault(); // Prevent default form submission
      submit(); // Call the submit function passed from parent
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