<script lang="ts">
  import type { ComponentType } from "svelte";

  type Options = {
    label: string;
    icon?: ComponentType;
    disabled: boolean;
    onClick: () => void;
  };

  export let options: Options[] = [];
</script>

<ul class="absolute left-0 top-4 rounded-lg bg-white shadow-lg">
  {#each options as option}
    {#if !option.disabled}
      <li>
        <button
          class="flex w-full gap-x-2 p-4 font-sansSerif font-bold text-pastelPurple hover:text-daisyBush"
          on:click={option.onClick}
        >
          {#if option.icon}
            <svelte:component this={option.icon} />
          {/if}
          {option.label}
        </button>
      </li>
    {/if}
  {/each}
</ul>

<style lang="postcss">
  li {
    @apply border-b-2 border-whisper;
  }

  li:last-child {
    @apply border-b-0;
  }
</style>
