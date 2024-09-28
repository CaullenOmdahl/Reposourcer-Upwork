import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig(); // Load environment variables from .env

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  },
  preprocess: vitePreprocess()
};

export default config;
