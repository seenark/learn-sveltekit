<script lang="ts">
  import { clickOutside } from "$lib/actions/ClickOutside";
  import { swipe } from "$lib/actions/Swipe";
  import AdditionalOptions from "$lib/components/AdditionalOptions.svelte";
  import SlidePanel from "$lib/components/SlidePanel.svelte";
  import Tag from "$lib/components/Tag.svelte";
  import Activate from "$lib/icon/Activate.svelte";
  import Archive from "$lib/icon/Archive.svelte";
  import Cancel from "$lib/icon/Cancel.svelte";
  import Edit from "$lib/icon/Edit.svelte";
  import Send from "$lib/icon/Send.svelte";
  import ThreeDots from "$lib/icon/ThreeDots.svelte";
  import Trash from "$lib/icon/Trash.svelte";
  import View from "$lib/icon/View.svelte";
  import { centsToDollars, sumInvoices } from "$lib/utils/moneyHelpers";
  import type { Client } from "../../../global";
  import ClientForm from "./ClientForm.svelte";

  export let client: Client;
  console.log({ client });

  let isAdditionalMenuShowing = false;

  let isClientFormShowing = false;

  let triggerReset = false;

  const closePanel = () => {
    isClientFormShowing = false;
  };

  const receivedInvoices = () => {
    if (client?.invoice) {
      // find invoices that have been paid
      const paidInvoices = client.invoice.filter((invoice) => invoice.invoiceStatus === "paid");

      // get the sum of all of them
      return sumInvoices(paidInvoices);
    }
    return 0;
  };

  const balanceInvoices = () => {
    if (client?.invoice) {
      // find invoices that have NOT been paid
      const paidInvoices = client.invoice.filter((invoice) => invoice.invoiceStatus !== "paid");

      // get the sum of all of them
      return sumInvoices(paidInvoices);
    }
    return 0;
  };

  const handleEdit = () => {
    isClientFormShowing = true;
    isAdditionalMenuShowing = false;
  };

  const handleArchive = () => {
    client.clientStatus = "archive";
    isAdditionalMenuShowing = false;
  };

  const handleActivate = () => {
    client.clientStatus = "active";
    isAdditionalMenuShowing = false;
  };
  const handleDelete = () => console.log("deleting");
</script>

<div class="relative">
  <!-- card -->
  <div
    class="z-row relative client-table rounded-lg bg-white py-3 shadow-tableRow lg:py-6"
    use:swipe={{ triggerReset }}
    on:outOfView={() => (triggerReset = false)}
  >
    <div><Tag class="ml-auto" label={client.clientStatus} /></div>
    <div class="truncate whitespace-nowrap text-base font-bold lg:text-xl">{client.name}</div>
    <div class="text-right font-mono text-sm font-bold lg:text-lg">
      ${centsToDollars(receivedInvoices())}
    </div>
    <div class="text-right font-mono text-sm font-bold text-scarlet lg:text-lg">
      ${centsToDollars(balanceInvoices())}
    </div>
    <div class="relative hidden items-center justify-center lg:flex">
      <a href={`/clients/${client.id}`} class="text-pastelPurple hover:text-daisyBush"><View /></a>
    </div>
    <div
      class="relative hidden items-center justify-center lg:flex"
      use:clickOutside={() => (isAdditionalMenuShowing = false)}
    >
      <button
        class="text-pastelPurple hover:text-daisyBush"
        on:click={() => {
          isAdditionalMenuShowing = !isAdditionalMenuShowing;
        }}><ThreeDots /></button
      >
      {#if isAdditionalMenuShowing}
        <AdditionalOptions
          options={[
            { label: "Edit", icon: Edit, onClick: handleEdit, disabled: false },
            {
              label: "Activate",
              icon: Activate,
              onClick: handleActivate,
              disabled: client.clientStatus === "active",
            },
            {
              label: "Archive",
              icon: Archive,
              onClick: handleArchive,
              disabled: client.clientStatus === "archive",
            },
            {
              label: "Delete",
              icon: Trash,
              onClick: handleDelete,
              disabled: false,
            },
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
    <button class="action-button" on:click={handleEdit}>
      <Edit width={32} height={32} />
      Edit
    </button>
    {#if client.clientStatus === "active"}
      <button class="action-button" on:click={handleArchive}>
        <Archive width={32} height={32} />
        Archive
      </button>
    {/if}
    {#if client.clientStatus === "archive"}
      <button class="action-button" on:click={handleActivate}>
        <Activate width={32} height={32} />
        Activate
      </button>
    {/if}

    <button class="action-button" on:click={handleDelete}>
      <Trash width={32} height={32} />
      Delete
    </button>
    <a href={`/clients/${client.id}`} class="action-button">
      <View width={32} height={32} />
      View
    </a>
  </div>
</div>

{#if isClientFormShowing}
  <SlidePanel on:closePanel={closePanel}>
    <ClientForm {closePanel} formStatus="edit" {client} />
  </SlidePanel>
{/if}
