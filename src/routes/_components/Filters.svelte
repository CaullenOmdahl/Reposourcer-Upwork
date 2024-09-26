<script>
  // Exporting locationFilter and emailAvailable
  export let locationFilter = "";
  export let emailAvailable = false;
</script>

<div class="mb-6 flex space-x-4">
  <!-- Location Filter -->
  <div>
      <label for="location" class="block text-sm font-medium text-gray-700">Filter by Location</label>
      <input
          id="location"
          type="text"
          bind:value={locationFilter}
          placeholder="Enter location"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
  </div>

  <!-- Email Availability Filter -->
  <div class="flex items-center mt-6">
      <label for="emailAvailable" class="mr-2 text-sm font-medium text-gray-700">Email Available</label>
      <input
          id="emailAvailable"
          type="checkbox"
          bind:checked={emailAvailable}
          class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
      />
  </div>
</div>