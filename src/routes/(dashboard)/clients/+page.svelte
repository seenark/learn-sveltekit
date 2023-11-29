<script lang="ts">
  import Button from "$lib/components/Button.svelte";

  import Search from "$lib/icon/Search.svelte";
  import { clients, loadClients } from "$lib/stores/clientStorte";
  import { onMount } from "svelte";
  import ClientRow from "./ClientRow.svelte";
  import ClientRowHeader from "./ClientRowHeader.svelte";
  import BlankStage from "./BlankStage.svelte";
  import SlidePanel from "$lib/components/SlidePanel.svelte";
  import ClientForm from "./ClientForm.svelte";

  let isClientFormShowing = false;

  const closePanel = () => {
    isClientFormShowing = false;
  };

  onMount(() => {
    loadClients();
  });
</script>

<svelte:head><title>Clients | The Dollar Holler</title></svelte:head>

<div
  class="md:gap-7-4 mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center lg:mb-16"
>
  <!-- search field -->
  {#if $clients.length > 0}
    <Search />
  {:else}
    <div />
  {/if}

  <!-- new invoice button -->
  <div>
    <Button
      on:click={() => {
        isClientFormShowing = true;
      }}>+ Client</Button
    >
  </div>
</div>

<!-- clients -->
<div>
  {#if $clients === null}
    Loading...
  {:else if $clients.length <= 0}
    <BlankStage />
  {:else}
    <!--  client header row -->
    <ClientRowHeader />

    <!-- client rows -->
    <div class="flex flex-col-reverse">
      {#each $clients as client}
        <ClientRow {client} />
      {/each}
    </div>
  {/if}
</div>

{#if isClientFormShowing}
  <SlidePanel on:closePanel={closePanel}>
    <ClientForm {closePanel} />
  </SlidePanel>
{/if}
