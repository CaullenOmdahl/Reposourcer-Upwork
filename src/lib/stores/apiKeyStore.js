// src/lib/stores/apiKeyStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialKey = browser ? localStorage.getItem('github_api_key') || '' : '';

export const apiKeyStore = writable(initialKey);

apiKeyStore.subscribe((value) => {
  if (browser) {
    if (value) {
      localStorage.setItem('github_api_key', value);
    } else {
      localStorage.removeItem('github_api_key');
    }
  }
});
