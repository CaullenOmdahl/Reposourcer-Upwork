<script>
  import { onDestroy } from 'svelte';
  import { stargazersStore } from '../stores/stargazersStore';
  import { filtersStore } from '../stores/filtersStore';
  // ... other imports

  let stargazers = [];
  let filteredStargazers = [];
  // ... other variables

  let filters = {};
  const unsubscribeFilters = filtersStore.subscribe((value) => {
    filters = value;
    applyFilters();
  });

  const unsubscribeStargazers = stargazersStore.subscribe((state) => {
    stargazers = state.data;
    // ... other state updates
    applyFilters();
  });

  function applyFilters() {
    filteredStargazers = stargazers.filter((user) => {
      let matches = true;

      if (filters.location) {
        matches = matches && user.details?.location?.toLowerCase().includes(filters.location.toLowerCase());
      }

      if (filters.hasEmail) {
        matches = matches && user.details?.email;
      }

      if (filters.hasLocation) {
        matches = matches && user.details?.location;
      }

      if (filters.hasCompany) {
        matches = matches && user.details?.company;
      }

      if (filters.hasTwitter) {
        matches = matches && user.details?.twitter_username;
      }

      if (filters.hasWebsite) {
        matches = matches && user.details?.blog;
      }

      return matches;
    });
  }

  onDestroy(() => {
    unsubscribeStargazers();
    unsubscribeFilters();
  });
</script>
