<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import Arrow from "$lib/icon/Arrow.svelte";
  import { fly } from "svelte/transition";

  let previousPage: string | undefined = undefined;

  afterNavigate((navigation) => {
    previousPage = navigation.from?.url.pathname;
  });
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key === "Escape") {
      goto(previousPage || "/invoices");
    }
  }}
/>

<div
  class="bg-whisper print:bg-transparent h-full min-h-screen w-screen pt-16 lg:pt-12 pb-32 print:pt-0 print:pb-0"
>
  <main class="mx-auto max-w-screen-lg min-h-screen" transition:fly={{ y: 500, duration: 250 }}>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href={previousPage || "/invoices"} class="fixed top-7 left-7 text-pastelPurple print:hidden">
      <Arrow />
    </a>
    <slot />
  </main>
</div>
