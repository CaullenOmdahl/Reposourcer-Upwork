// src/lib/stores/apiKeyStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize the store with the API key from localStorage if in the browser
const initialKey = browser ? localStorage.getItem('github_api_key') || '' : '';

export const apiKeyStore = writable(initialKey);

// Subscribe to changes and update localStorage only if in the browser
if (browser) {
  apiKeyStore.subscribe((value) => {
    if (value) {
      localStorage.setItem('github_api_key', value);
    } else {
      localStorage.removeItem('github_api_key');
    }
  });
}
