// tailwind.config.cjs
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}', // Ensure this path matches your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'), // Ensure this plugin is installed if used
  ],
};
