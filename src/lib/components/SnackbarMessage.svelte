<script lang="ts">
  import { snackbar } from "$lib/stores/snackbarStore";
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";

  let progress = tweened(100, { duration: 3000 });

  progress.subscribe((n) => {
    console.log(n);
  });
  onMount(async () => {
    await progress.set(0);
    snackbar.remove();
  });
</script>

<div class="whitespace-nowrap">
  <slot />
</div>
