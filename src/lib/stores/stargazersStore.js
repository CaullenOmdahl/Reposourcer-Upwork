// src/lib/stores/stargazersStore.js
import { writable } from 'svelte/store';

const initialState = {
  data: [],
  currentPage: 1,
  perPage: 25,
  hasNextPage: false,
  hasPrevPage: false,
  loading: false,
  error: null,
  owner: null,
  repo: null,
  selected: new Set(),
};

export const stargazersStore = writable(initialState);

export const setStargazers = (newData, paginationInfo) => {
  stargazersStore.update((state) => ({
    ...state,
    data: newData,
    loading: false,
    error: null,
    hasNextPage: paginationInfo.hasNextPage,
    hasPrevPage: paginationInfo.hasPrevPage,
  }));
};

export const updateCurrentPage = (page) => {
  stargazersStore.update((state) => ({
    ...state,
    currentPage: page,
  }));
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
    error: errorMessage,
  }));
};

// Optional reset function
export const resetStore = () => {
  stargazersStore.set(initialState);
};
