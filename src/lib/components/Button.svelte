<script lang="ts">
  import type { ComponentType } from "svelte";

  let className = "";
  export let label: string | undefined = undefined;
  export { className as class };
  export let style:
    | "primary"
    | "secondary"
    | "destructive"
    | "outline"
    | "textOnly"
    | "textOnlyDestructive" = "primary";
  export let isAnimated = false;
  export let iconLeft: ComponentType | null = null;
  export let iconRight: ComponentType | null = null;
  export let height: "short" | "regular" = "regular";
</script>

<button
  class={`button ${className}`}
  class:isAnimated
  class:primary={style === "primary"}
  class:secondary={style === "secondary"}
  class:destructive={style === "destructive"}
  class:outline={style === "outline"}
  class:textOnly={style === "textOnly"}
  class:textOnlyDestructive={style === "textOnlyDestructive"}
  class:short={height === "short"}
  type="button"
  on:click|preventDefault
>
  {#if iconLeft}
    <div class="mr-2">
      <svelte:component this={iconLeft}></svelte:component>
    </div>
  {/if}
  {#if label && label.length > 0}
    {label}
  {:else}
    <slot />
  {/if}
  {#if iconRight}
    <div class="mr-2">
      <svelte:component this={iconRight}></svelte:component>
    </div>
  {/if}
</button>

<style lang="postcss">
  .isAnimated {
    @apply translate-y-0 hover:-translate-y-2 transition-all shadow-colored hover:shadow-coloredHover;
  }

  .primary {
    @apply bg-larvenderIndigo text-white;
  }

  .secondary {
    @apply bg-gallery text-daisyBush;
  }

  .destructive {
    @apply bg-scarlet text-goldenFizz;
  }

  .outline {
    @apply border-daisyBush text-daisyBush hover:bg-daisyBush hover:text-white;
  }

  .textOnly {
    @apply bg-transparent px-0 text-larvenderIndigo no-underline hover:underline;
  }

  .textOnlyDestructive {
    @apply bg-transparent px-0 text-scarlet underline hover:no-underline;
  }

  .short {
    @apply !py-1;
  }
</style>
