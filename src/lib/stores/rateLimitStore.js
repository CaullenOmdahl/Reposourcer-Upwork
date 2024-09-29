// src/lib/stores/rateLimitStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let initialState = {
  core: {
    remaining: 60,
    reset: null,
    limit: 60,
    used: 0,
  },
  search: {
    remaining: 10,
    reset: null,
    limit: 10,
    used: 0,
  },
  graphql: {
    remaining: 0,
    reset: null,
    limit: 0,
    used: 0,
  },
  integration_manifest: {
    remaining: 0,
    reset: null,
    limit: 0,
    used: 0,
  },
  scim: {
    remaining: 0,
    reset: null,
    limit: 0,
    used: 0,
  },
};

if (browser) {
  const storedRateLimit = localStorage.getItem('rate_limit');
  if (storedRateLimit) {
    try {
      initialState = JSON.parse(storedRateLimit);
    } catch (error) {
      console.error('Error parsing stored rate limit data:', error);
    }
  }
}

export const rateLimitStore = writable(initialState);

/**
 * Sets the rate limit data.
 * @param {Object} newRateLimit - The new rate limit data.
 */
export const setRateLimit = (newRateLimit) => {
  rateLimitStore.set(newRateLimit);
};

if (browser) {
  rateLimitStore.subscribe((value) => {
    localStorage.setItem('rate_limit', JSON.stringify(value));
  });
}
