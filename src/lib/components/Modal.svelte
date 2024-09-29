<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  let modalElement;

  const close = () => {
    dispatch('close');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  onMount(() => {
    modalElement.focus();
  });
</script>

<div
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  tabindex="-1"
  role="dialog"
  aria-modal="true"
  on:keydown={handleKeyDown}
  bind:this={modalElement}
>
  <div class="bg-white p-4 rounded shadow-lg relative">
    <button
      on:click={close}
      class="absolute top-2 right-2 text-gray-500"
      aria-label="Close modal"
    >
      ✖
    </button>
    <slot></slot>
  </div>
</div>
