// src/lib/stores/filtersStore.js
import { writable } from 'svelte/store';

export const filtersStore = writable({
  location: '',
  hasEmail: false,
  hasLocation: false,
  hasCompany: false,
  hasTwitter: false,
  hasWebsite: false,
});
