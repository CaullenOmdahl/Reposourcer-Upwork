// src/lib/stores/stargazersStore.js
import { writable } from 'svelte/store';

// Initial state of the stargazers store
const initialState = {
  data: [],           // Array to hold stargazers data
  page: 1,            // Current page number
  perPage: 100,       // Number of stargazers per page (GitHub API allows up to 100)
  hasNextPage: false, // Indicates if there is a next page
  hasPrevPage: false, // Indicates if there is a previous page
  loading: false,     // Loading state
  error: null,        // Error message, if any
  selected: new Set(),// Set to hold selected stargazers' usernames
};

export const stargazersStore = writable(initialState);

// Helper functions to interact with the store
export const addStargazers = (newStargazers) => {
  stargazersStore.update((state) => {
    return {
      ...state,
      data: [...state.data, ...newStargazers],
    };
  });
};

export const setStargazers = (stargazers, page, hasNextPage) => {
  stargazersStore.set({
    ...initialState,
    data: stargazers,
    page,
    hasNextPage,
    hasPrevPage: page > 1,
    loading: false,
    error: null,
    selected: new Set(),
  });
};

export const setLoading = (isLoading) => {
  stargazersStore.update((state) => ({
    ...state,
    loading: isLoading,
  }));
};

export const setError = (errorMessage) => {
  stargazersStore.update((state) => ({
    ...state,
    loading: false,
    error: errorMessage,
  }));
};

export const toggleSelect = (username) => {
  stargazersStore.update((state) => {
    const newSelected = new Set(state.selected);
    if (newSelected.has(username)) {
      newSelected.delete(username);
    } else {
      newSelected.add(username);
    }
    return {
      ...state,
      selected: newSelected,
    };
  });
};

export const selectAll = () => {
  stargazersStore.update((state) => {
    const allUsernames = state.data.map((user) => user.login);
    return {
      ...state,
      selected: new Set(allUsernames),
    };
  });
};

export const deselectAll = () => {
  stargazersStore.update((state) => ({
    ...state,
    selected: new Set(),
  }));
};

export const resetStargazers = () => {
  stargazersStore.set(initialState);
};
