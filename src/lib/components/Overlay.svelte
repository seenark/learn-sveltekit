<script lang="ts">
  import { fade } from "svelte/transition";

  export let className = "";
  export { className as class };
</script>

<svelte:head>
  <style lang="postcss">
    body {
      @apply overflow-hidden;
    }
  </style>
</svelte:head>

<div transition:fade class={`fixed inset-0 bg-blueGem opacity-60 z-overlay ${className}`}></div>
