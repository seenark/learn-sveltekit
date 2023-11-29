<script lang="ts">
  import AdditionalOptions from "$lib/components/AdditionalOptions.svelte";
  import Tag from "$lib/components/Tag.svelte";
  import ThreeDots from "$lib/icon/ThreeDots.svelte";
  import View from "$lib/icon/View.svelte";
  import { convertDate, isLate } from "$lib/utils/dateHelpers";
  import { calculateInvoiceTotal, centsToDollars } from "$lib/utils/moneyHelpers";
  import { InvoiceStatus } from "../../../enums";
  import type { Invoice } from "../../../global";
  import Send from "$lib/icon/Send.svelte";
  import Trash from "$lib/icon/Trash.svelte";
  import Edit from "$lib/icon/Edit.svelte";
  import SlidePanel from "$lib/components/SlidePanel.svelte";
  import InvoiceForm from "$lib/components/InvoiceForm.svelte";
  import ConfirmDelete from "./ConfirmDelete.svelte";
  import { clickOutside } from "$lib/actions/ClickOutside";
  import { swipe } from "$lib/actions/Swipe";
  import Cancel from "$lib/icon/Cancel.svelte";

  export let invoice: Invoice;
  let isAdditionalMenuShowing = false;
  let isOptionDisabled = false;
  let isModalShowing = false;
  let isInvoiceFormShowing = false;
  let triggerReset = false;

  function getInvoiceLabel(inv: Invoice): Tag["$$prop_def"]["label"] {
    if (inv.invoiceStatus === InvoiceStatus.draft) {
      return "draft";
    } else if (inv.invoiceStatus === InvoiceStatus.sent && !isLate(inv.dueDate)) {
      isOptionDisabled = true;
      return "sent";
    } else if (inv.invoiceStatus === InvoiceStatus.sent && isLate(inv.dueDate)) {
      isOptionDisabled = true;
      return "late";
    } else if (inv.invoiceStatus === InvoiceStatus.paid) {
      isOptionDisabled = true;
      return "paid";
    }
  }

  function handleDelete() {
    console.log("delete");
    isModalShowing = true;
    isAdditionalMenuShowing = false;
  }
  function handleEdit() {
    console.log("editing");
    isInvoiceFormShowing = true;
    isAdditionalMenuShowing = false;
  }
  function handleSendInvoice() {
    console.log("sending");
  }
</script>

<div class="relative">
  <!-- card -->
  <div
    class="z-row relative invoice-table invoice-row items-center bg-white rounded-lg py-3 lg:py-6 shadow-tableRow"
    use:swipe={{ triggerReset }}
    on:outOfView={() => (triggerReset = false)}
  >
    <div class="status"><Tag class="ml-auto lg:ml-0" label={getInvoiceLabel(invoice)} /></div>
    <div class="dueDate text-sm lg:text-lg">{convertDate(invoice.dueDate)}</div>
    <div class="invoiceNumber text-sm lg:text-lg">{invoice.invoiceNumber}</div>
    <div class="clientName text-base lg:text-xl font-bold truncate">{invoice.client.name}</div>
    <div class="amount text-sm lg:text-lg font-mono font-bold text-right">
      ${centsToDollars(calculateInvoiceTotal(invoice.lineItems, invoice.discount || 0))}
    </div>
    <div class="lg:center viewButton hidden text-sm lg:text-lg">
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a href={`/invoices/${invoice.id}`} class="text-pastelPurple hover:text-daisyBush"><View /></a
      >
    </div>
    <div
      class="relative lg:center moreButton hidden text-sm lg:text-lg"
      use:clickOutside={() => (isAdditionalMenuShowing = false)}
    >
      <button
        class=" text-pastelPurple hover:text-daisyBush"
        on:click={() => {
          isAdditionalMenuShowing = !isAdditionalMenuShowing;
        }}><ThreeDots /></button
      >
      {#if isAdditionalMenuShowing}
        <AdditionalOptions
          options={[
            { label: "Edit", icon: Edit, onClick: handleEdit, disabled: isOptionDisabled },
            { label: "Delete", icon: Trash, onClick: handleDelete, disabled: false },
            { label: "Send", icon: Send, onClick: handleSendInvoice, disabled: isOptionDisabled },
          ]}
        />
      {/if}
    </div>
  </div>

  <!--swipe to reveal  -->
  <div class="swipe-revealed-actions">
    <button
      class="action-button"
      on:click={() => {
        triggerReset = true;
      }}
    >
      <Cancel width={32} height={32} />
      Cancel
    </button>
    {#if !isOptionDisabled}
      <button class="action-button" on:click={handleEdit}>
        <Edit width={32} height={32} />
        Edit
      </button>
      <button class="action-button" on:click={handleSendInvoice}>
        <Send width={32} height={32} />
        Send
      </button>
    {/if}
    <button class="action-button" on:click={handleDelete}>
      <Trash width={32} height={32} />
      Delete
    </button>
    <a href={`/invoices/${invoice.id}`} class="action-button">
      <View width={32} height={32} />
      View
    </a>
  </div>
</div>

<ConfirmDelete {invoice} {isModalShowing} on:close={() => (isModalShowing = false)} />
{#if isInvoiceFormShowing}
  <SlidePanel
    on:closePanel={() => {
      isInvoiceFormShowing = false;
    }}
  >
    <InvoiceForm
      {invoice}
      formState="edit"
      on:closeForm={() => {
        isInvoiceFormShowing = false;
      }}
    />
  </SlidePanel>
{/if}

<style lang="postcss">
  .invoice-row {
    grid-template-areas:
      "invoiceNumber invoiceNumber"
      "clientName amount"
      "dueDate status";
  }

  @media (min-width: 1024px) {
    .invoice-row {
      grid-template-areas: "status dueDate invoiceNumber clientName amount viewButton moreButton";
    }
  }

  .invoice-row .status {
    grid-area: status;
  }

  .invoice-row .dueDate {
    grid-area: dueDate;
  }

  .invoice-row .invoiceNumber {
    grid-area: invoiceNumber;
  }

  .invoice-row .clientName {
    grid-area: clientName;
  }

  .invoice-row .amount {
    grid-area: amount;
  }

  .invoice-row .viewButton {
    grid-area: viewButton;
  }

  .invoice-row .moreButton {
    grid-area: moreButton;
  }
</style>
