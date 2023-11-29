<script lang="ts">
  import Overlay from "./Overlay.svelte";
  import Portal from "./Portal.svelte";
  import Cancel from "$lib/icon/Cancel.svelte";
  import { createEventDispatcher } from "svelte";
  import { clickOutside } from "$lib/actions/ClickOutside";

  export let isVisible = false;
  const dispatch = createEventDispatcher();
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key === "Escape") {
      dispatch("close");
    }
  }}
/>

{#if isVisible}
  <Portal>
    <Overlay class="!z-modalOverlay"></Overlay>
    <div class="fixed inset-0 z-modal center">
      <div
        class="relative max-w-[450px] min-h-[230px] w-full rounded-lg bg-white px-10 py-7"
        use:clickOutside={() => dispatch("close")}
      >
        <button
          class="right-4 top-4 absolute text-pastelPurple hover:text-daisyBush"
          on:click={() => dispatch("close")}><Cancel /></button
        >
        <slot />
      </div>
    </div>
  </Portal>
{/if}
