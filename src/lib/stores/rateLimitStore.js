import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let initialState = {
  core: {
    remaining: 60,
    reset: null,
    limit: 60,
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

if (browser) {
  rateLimitStore.subscribe((value) => {
    localStorage.setItem('rate_limit', JSON.stringify(value));
  });
}
