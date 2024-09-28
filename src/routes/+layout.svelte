<!-- src/routes/+layout.svelte -->
<script>
    import APIKeyManagement from '$lib/components/APIKeyManagement.svelte';
    import '../app.css';
  </script>
  
  <div class="min-h-screen bg-gray-100 p-4">
    <header class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Reposourcer</h1>
      <APIKeyManagement />
    </header>
    <main>
      <slot />
    </main>
  </div>
  