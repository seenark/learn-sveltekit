<script lang="ts">
  import Arrow from "$lib/icon/Arrow.svelte";
  import { createEventDispatcher } from "svelte";
  import Overlay from "./Overlay.svelte";
  import Portal from "./Portal.svelte";
  import { fly } from "svelte/transition";
  import { clickOutside } from "$lib/actions/ClickOutside";

  const dispatch = createEventDispatcher();
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key === "Escape") {
      dispatch("closePanel");
    }
  }}
/>
<Portal>
  <Overlay></Overlay>
  <div
    class="bg-white fixed overflow-y-scroll w-full lg:w-3/4 h-screen px-5 pt-16 lg:py-20 lg:px-32 right-0 top-0 z-slidePanel shadow-slidePanel"
    transition:fly={{ x: 1000, duration: 500 }}
    use:clickOutside={() => dispatch("closePanel")}
  >
    <button
      class="absolute top-5 left-7 text-pastelPurple hover:text-daisyBush"
      on:click={() => dispatch("closePanel")}><Arrow /></button
    >
    <slot />
  </div>
</Portal>
