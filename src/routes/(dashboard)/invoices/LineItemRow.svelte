<script lang="ts">
  import Trash from "$lib/icon/Trash.svelte";
  import { createEventDispatcher } from "svelte";
  import type { LineItem } from "../../../global";
  import { dollarsToCents } from "$lib/utils/moneyHelpers";
  export let lineItem: LineItem;
  const dispatch = createEventDispatcher();

  export let canDelete = false;
  export let isRequired = false;
  export let isEditable = true;

  let amount = lineItem.amount / 100;
  let unitPrice = lineItem.amount / lineItem.quantity;
  $: {
    amount = lineItem.quantity * unitPrice;
    lineItem.amount = dollarsToCents(amount);
  }
</script>

<div class="invoice-line-item border-b-2 border-fog py-4 sm:py-2">
  <div class="description">
    <label for="description" class="line-item-label">Description</label>
    <input
      type="text"
      name="description"
      class="line-item"
      bind:value={lineItem.description}
      required={isRequired}
      disabled={!isEditable}
    />
  </div>

  <div class="unitPrice text-right">
    <label for="unitPrice" class="line-item-label">Unit Price</label>
    <input
      type="number"
      name="unitPrice"
      step="0.01"
      min="0"
      class="line-item text-right"
      disabled={!isEditable}
      bind:value={unitPrice}
      on:blur={() => {
        dispatch("updateLineItem");
      }}
      required={isRequired}
    />
  </div>

  <div class="qty text-center">
    <label for="quantity" class="line-item-label">Quantity</label>
    <input
      type="number"
      name="quantity"
      min="0"
      class="line-item text-center"
      disabled={!isEditable}
      bind:value={lineItem.quantity}
      on:blur={() => {
        dispatch("updateLineItem");
      }}
      required={isRequired}
    />
  </div>

  <div class="amount text-right">
    <label for="amount" class="line-item-label">Amount</label>
    <input
      type="number"
      name="amount"
      step="0.01"
      min="0"
      class="line-item text-right"
      bind:value={amount}
      disabled
    />
  </div>

  <div class="trash">
    {#if canDelete && isEditable}
      <button
        class="center h-10 w-10 text-pastelPurple hover:text-larvenderIndigo"
        on:click|preventDefault={() => dispatch("removeLineItem", lineItem.id)}><Trash /></button
      >
    {/if}
  </div>
</div>

<style lang="postcss">
  input[type="text"],
  input[type="number"] {
    @apply h-10 w-full border-b-2 border-dashed border-stone-300;
  }

  input[type="text"] {
    @apply font-sansSerif text-xl font-bold;
  }

  input[type="number"] {
    @apply font-mono text-base;
  }
  input[type="text"]:focus,
  input[type="number"]:focus {
    @apply border-solid border-larvenderIndigo outline-none;
  }

  input[type="text"]:disabled,
  input[type="number"]:disabled {
    @apply border-b-0 bg-transparent px-0;
  }

  .line-item-label {
    @apply block sm:hidden print:hidden;
  }
</style>
