<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import CircledAmount from "$lib/components/CircledAmount.svelte";
  import { createEventDispatcher } from "svelte";
  import type { LineItem } from "../../../global";
  import LineItemRow from "./LineItemRow.svelte";
  import { centsToDollars, sumLineItems } from "$lib/utils/moneyHelpers";

  export let lineItems: LineItem[] | undefined = undefined;
  export let isEditable = true;

  const dispatch = createEventDispatcher();

  export let discount = 0;
  $: subTotalNum = sumLineItems(lineItems);
  $: subtotal = centsToDollars(subTotalNum);
  $: discountNum = (subTotalNum * discount) / 100;
  $: discountedAmount = centsToDollars(discountNum);
  $: total = centsToDollars(subTotalNum - discountNum);
</script>

<div class="invoice-line-item border-b-2 border-daisyBush pb-2">
  <div class="table-header">Description</div>
  <div class="table-header text-right">Unit Price</div>
  <div class="table-header text-center">Qty</div>
  <div class="table-header text-right">Amount</div>
</div>

{#if lineItems}
  {#each lineItems as lineItem, index}
    <LineItemRow
      {lineItem}
      on:removeLineItem
      canDelete={lineItems.length > 1}
      on:updateLineItem
      isRequired={index === 0}
      {isEditable}
    />
  {/each}
{/if}

<div class="invoice-line-item">
  <div class="col-span-1 sm:col-span-2">
    {#if isEditable}
      <Button style="textOnly" on:click={() => dispatch("addLineItem")}>+ Line Item</Button>
    {/if}
  </div>
  <div class="font-bold py-5 text-right text-monsoon print:col-span-3">Subtotal</div>
  <div class="py-6 text-right font-mono">{subtotal}</div>
</div>

<div class="invoice-line-item">
  <div class="col-span-1 sm:col-span-2 text-right font-bold py-5 text-monsoon print:col-span-3">
    Discount
  </div>
  <div class="relative">
    <input
      class="line-item h-10 w-full border-b-2 border-dashed border-stone-300 pr-4 print:pr-0 text-right focus:border-solid focus:border-larvenderIndigo focus:outline-none"
      type="number"
      name="discount"
      min="0"
      max="100"
      disabled={!isEditable}
      bind:value={discount}
      on:change={() => dispatch("updateDiscount", discount)}
    />
    <span class="absolute right-0 top-2 font-mono">%</span>
  </div>
  <div class="py-5 text-right font-mono">{discountedAmount}</div>
</div>

<div class="invoice-line-item">
  <div class="col-span-3 sm:col-span-6 print:col-span-6">
    <CircledAmount label="Total" amount={`$${total}`} />
  </div>
</div>

<style lang="postcss">
  .table-header {
    @apply hidden sm:block text-sm font-bold text-daisyBush print:block;
  }
</style>
