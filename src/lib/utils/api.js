// src/lib/utils/api.js
import axios from 'axios';
import { get } from 'svelte/store';
import { apiKeyStore } from '../stores/apiKeyStore';
import { rateLimitStore } from '../stores/rateLimitStore';

const GITHUB_API_BASE = 'https://api.github.com';

async function updateRateLimit(headers) {
  const remaining = headers['x-ratelimit-remaining'];
  const reset = headers['x-ratelimit-reset'];
  rateLimitStore.set({
    remaining: Number(remaining),
    reset: new Date(Number(reset) * 1000),
  });
}

export async function fetchStargazers(owner, repo, page = 1, per_page = 100) {
  const apiKey = get(apiKeyStore);
  const headers = apiKey ? { Authorization: `token ${apiKey}` } : {};
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/stargazers?page=${page}&per_page=${per_page}`;
  
  try {
    const response = await axios.get(url, { headers, params: { per_page, page } });
    await updateRateLimit(response.headers);
    return response.data;
  } catch (error) {
    console.error("Error fetching stargazers:", error); // Log the error
    throw error; // Rethrow the error for further handling
  }
}

const userCache = new Map();

export async function fetchUserDetails(username) {
  if (userCache.has(username)) {
    return userCache.get(username);
  }
  const apiKey = get(apiKeyStore);
  const headers = apiKey ? { Authorization: `token ${apiKey}` } : {};
  const url = `${GITHUB_API_BASE}/users/${username}`;
  const response = await axios.get(url, { headers });
  await updateRateLimit(response.headers);
  userCache.set(username, response.data);
  return response.data;
}

export async function fetchRateLimit() {
  const apiKey = get(apiKeyStore);
  const headers = apiKey ? { Authorization: `token ${apiKey}` } : {};
  const url = `${GITHUB_API_BASE}/rate_limit`;
  const response = await axios.get(url, { headers });
  const core = response.data.resources.core;
  rateLimitStore.set({
    remaining: core.remaining,
    reset: new Date(core.reset * 1000),
  });
  return response.data;
}
