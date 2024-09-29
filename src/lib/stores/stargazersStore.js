// src/lib/stores/stargazersStore.js
import { writable } from 'svelte/store';

const initialState = {
  allData: [], // Store all stargazers here
  filteredData: [], // Store filtered stargazers here
  currentPage: 1,
  perPage: 25,
  hasNextPage: false,
  hasPrevPage: false,
  loading: false,
  error: null,
  owner: null,
  repo: null,
};

export const stargazersStore = writable(initialState);

export const setAllStargazers = (newData) => {
  stargazersStore.update((state) => ({
    ...state,
    allData: newData,
    loading: false,
    error: null,
  }));
};

export const setFilteredStargazers = (filteredData) => {
  stargazersStore.update((state) => ({
    ...state,
    filteredData,
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
