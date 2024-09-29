<script>
  import { createEventDispatcher } from 'svelte';
  import { filtersStore } from '../stores/filtersStore';
  import ErrorAlert from './ErrorAlert.svelte';

  export let locationOptions = [];
  let location = '';
  let hasEmail = false;
  let hasLocation = false;
  let hasCompany = false;
  let hasTwitter = false;
  let hasWebsite = false;
  let filterError = '';

  const dispatch = createEventDispatcher();

  const updateFilters = () => {
    if (location && location.length > 100) {
      filterError = 'Location is too long. Maximum 100 characters allowed.';
      return;
    }

    filterError = '';
    filtersStore.set({
      location,
      hasEmail,
      hasLocation,
      hasCompany,
      hasTwitter,
      hasWebsite,
    });
    dispatch('filtersUpdated');
  };
</script>

<div class="mb-4 p-4 bg-white rounded shadow">
  <h3 class="text-lg font-semibold mb-2">Filters</h3>
  <div class="flex flex-col space-y-2">
    <div>
      <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
      <input
        id="location"
        type="text"
        list="locations"
        bind:value={location}
        placeholder="e.g., San Francisco"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        aria-label="Filter by location"
      />
      <datalist id="locations">
        {#each locationOptions as loc}
          <option value={loc}></option>
        {/each}
      </datalist>
    </div>
    <div class="flex items-center">
      <input
        type="checkbox"
        id="hasEmail"
        bind:checked={hasEmail}
        class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        aria-label="Filter by email availability"
      />
      <label for="hasEmail" class="ml-2 block text-sm text-gray-900">
        Has Email
      </label>
    </div>
    <!-- Additional Filters -->
    <div class="flex items-center">
      <input
        type="checkbox"
        id="hasLocation"
        bind:checked={hasLocation}
        class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        aria-label="Filter by location availability"
      />
      <label for="hasLocation" class="ml-2 block text-sm text-gray-900">
        Has Location
      </label>
    </div>
    <div class="flex items-center">
      <input
        type="checkbox"
        id="hasCompany"
        bind:checked={hasCompany}
        class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        aria-label="Filter by company availability"
      />
      <label for="hasCompany" class="ml-2 block text-sm text-gray-900">
        Has Company
      </label>
    </div>
    <div class="flex items-center">
      <input
        type="checkbox"
        id="hasTwitter"
        bind:checked={hasTwitter}
        class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        aria-label="Filter by Twitter availability"
      />
      <label for="hasTwitter" class="ml-2 block text-sm text-gray-900">
        Has Twitter
      </label>
    </div>
    <div class="flex items-center">
      <input
        type="checkbox"
        id="hasWebsite"
        bind:checked={hasWebsite}
        class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        aria-label="Filter by website availability"
      />
      <label for="hasWebsite" class="ml-2 block text-sm text-gray-900">
        Has Website
      </label>
    </div>
    <button
      on:click={updateFilters}
      class="mt-2 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
    >
      Apply Filters
    </button>
    {#if filterError}
      <div class="mt-2">
        <ErrorAlert message={filterError} />
      </div>
    {/if}
  </div>
</div>
