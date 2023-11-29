<script lang="ts">
  import CircledAmount from "$lib/components/CircledAmount.svelte";
  import Search from "$lib/components/Search.svelte";

  import { invoices, loadInvoices } from "$lib/stores/invoiceStore";
  import { onMount } from "svelte";
  import InvoiceRow from "./InvoiceRow.svelte";
  import { centsToDollars, sumInvoices } from "$lib/utils/moneyHelpers";
  import BlankState from "./BlankState.svelte";
  import InvoiceRowHeader from "./InvoiceRowHeader.svelte";
  import Button from "$lib/components/Button.svelte";
  import SlidePanel from "$lib/components/SlidePanel.svelte";
  import InvoiceForm from "$lib/components/InvoiceForm.svelte";

  let isInvoiceFormShowing = false;

  onMount(() => {
    loadInvoices();
    console.log($invoices);
  });
</script>

<svelte:head>
  <title>Invoice | The Dollar Holler</title>
</svelte:head>

<div
  class="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-y-6 md:gap-y-4 mb-7 lg:mb-16"
>
  <!-- search fields -->
  {#if $invoices.length > 0}
    <Search />
  {:else}
    <div />
  {/if}

  <!-- new invoice button -->
  <div>
    <Button
      isAnimated={true}
      style="primary"
      on:click={() => {
        isInvoiceFormShowing = true;
      }}>+ Invoice</Button
    >
  </div>
</div>

<!-- list of invoice -->
<div>
  <!-- header  -->

  <!-- invoices  -->
  {#if $invoices === null}
    Loading...
  {:else if $invoices.length === 0}
    <BlankState />
  {:else}
    <InvoiceRowHeader class="text-daisyBush" />
    <div class="flex flex-col-reverse">
      {#each $invoices as invoice}
        <InvoiceRow {invoice} />
      {/each}
    </div>
    <CircledAmount label="Total" amount={`$${centsToDollars(sumInvoices($invoices))}`} />
  {/if}
</div>

{#if isInvoiceFormShowing}
  <SlidePanel
    on:closePanel={() => {
      isInvoiceFormShowing = false;
    }}
  >
    <InvoiceForm
      on:closeForm={() => {
        isInvoiceFormShowing = false;
      }}
    />
  </SlidePanel>
{/if}

<style lang="postcss">
</style>
