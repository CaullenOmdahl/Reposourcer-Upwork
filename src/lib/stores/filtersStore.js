// src/lib/stores/filtersStore.js
import { writable } from 'svelte/store';

export const filtersStore = writable({
  location: '',
  hasEmail: false,
});
