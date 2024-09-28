// src/lib/stores/rateLimitStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize the store, optionally from localStorage
const initialState = browser ? JSON.parse(localStorage.getItem('rate_limit') || '{"remaining":60,"reset":null}') : {
  remaining: 60,
  reset: null,
};

export const rateLimitStore = writable(initialState);

// Subscribe and update localStorage only in the browser
if (browser) {
  rateLimitStore.subscribe((value) => {
    localStorage.setItem('rate_limit', JSON.stringify(value));
  });
}
