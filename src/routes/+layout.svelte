<!-- src/routes/+layout.svelte -->
<script>
  import APIKeyManagement from '$lib/components/APIKeyManagement.svelte';
  import '../app.css';
  import RateLimitInfo from '$lib/components/RateLimitInfo.svelte';
  import WelcomeModal from '$lib/components/WelcomeModal.svelte';
  
  let showWelcomeModal = true;

  const handleClose = () => {
    showWelcomeModal = false;
  };
</script>

<div class="min-h-screen bg-gray-100 p-4">
  <header class="flex flex-col md:flex-row justify-between items-center mb-4">
    <div class="flex items-center">
      <h1 class="text-3xl font-bold mb-2 md:mb-0 text-indigo-600">StarScope</h1>
      <!-- GitHub Link with Image -->
      <a
        href="https://github.com/CaullenOmdahl/StarScope"
        target="_blank"
        rel="noopener noreferrer"
        class="ml-3"
        aria-label="StarScope GitHub Repository"
      >
        <img
          src="/assets/github.svg"
          alt="GitHub Repository"
          class="h-6 w-6 text-gray-800 hover:text-indigo-600 transition-colors duration-200"
        />
      </a>
    </div>
    <APIKeyManagement />
  </header>
  <main>
    <slot />
  </main>
  <footer class="mt-4">
    <RateLimitInfo />
  </footer>
  
  {#if showWelcomeModal}
    <WelcomeModal on:close={handleClose} />
  {/if}
</div>
