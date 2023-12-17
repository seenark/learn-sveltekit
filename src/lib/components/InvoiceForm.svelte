<script lang="ts">
  import Trash from "$lib/icon/Trash.svelte";
  import LineItemRows from "../../routes/(dashboard)/invoices/LineItemRows.svelte";
  import Button from "./Button.svelte";
  import type { Client, Invoice, LineItem } from "../../global";
  import { v4 as randomUUID } from "uuid";
  import { slide } from "svelte/transition";
  import { states } from "$lib/utils/states";
  import { createEventDispatcher, onMount } from "svelte";
  import { addClient, clients, loadClients } from "$lib/stores/clientStorte";
  import { today } from "$lib/utils/dateHelpers";
  import { InvoiceStatus } from "../../enums";
  import { addInvoice, updateInvoice } from "$lib/stores/invoiceStore";
  import ConfirmDelete from "../../routes/(dashboard)/invoices/ConfirmDelete.svelte";
  import { snackbar } from "$lib/stores/snackbarStore";

  const dispatcher = createEventDispatcher();

  const blankLineItem: LineItem = {
    id: randomUUID(),
    description: "",
    amount: 0,
    quantity: 0,
  };

  const blankClient: Client = {
    id: randomUUID(),
    city: "",
    email: "",
    name: "",
    state: "",
    zip: "",
  };
  let isNewClient = false;
  export let isModalShowing = false;
  export let formState: "create" | "edit" = "create";
  export let invoice: Invoice = {
    id: randomUUID(),
    client: { ...blankClient },
    lineItems: [{ ...blankLineItem }],
    createdAt: "",
    dueDate: "",
    invoiceNumber: "",
    invoiceStatus: InvoiceStatus.draft,
    issueDate: "",
    notes: "",
    subject: "",
    terms: "",
  };
  let newClient: Client = { ...blankClient };

  function addLineItem() {
    invoice.lineItems = [...invoice.lineItems, { ...blankLineItem, id: randomUUID() }];
  }

  function removeLineItem(event: CustomEvent<string>) {
    invoice.lineItems = invoice.lineItems.filter((item) => item.id !== event.detail);
  }

  function updateLineItem() {
    invoice.lineItems = invoice.lineItems;
  }

  function updateDiscount(event: CustomEvent<number>) {
    invoice.discount = event.detail;
  }

  async function handleSubmit() {
    console.log({ invoice, newClient });
    addInvoice(invoice);
    if (isNewClient) {
      invoice.client = newClient;
      const addedClient = await addClient(newClient);
      invoice.client.id = addedClient?.id || "";
    }

    if (formState === "create") {
      await addInvoice(invoice);
    } else {
      updateInvoice(invoice);
    }

    dispatcher("closeForm");
  }

  onMount(() => {
    loadClients();
  });
</script>

<h2 class="mb-7 font-sansSerif text-3xl font-bold text-daisyBush">
  {#if formState === "create"}Create{:else}Edit{/if} an Invoice
</h2>

<form class="grid grid-cols-6 gap-x-5" on:submit|preventDefault={handleSubmit}>
  <!-- client-->
  <div class="field col-span-6 md:col-span-4">
    {#if !isNewClient}
      <label for="client">Client</label>
      <div class="flex flex-wrap sm:flex-nowrap items-end gap-x-2 md:gap-x-5">
        <select
          class="mb-2 sm:mb-0"
          name="client"
          id="client"
          required={isNewClient === false}
          bind:value={invoice.client.id}
          on:change={() => {
            const selectedClient = $clients.find((client) => client.id === invoice.client.id);
            invoice.client.name = selectedClient?.name === undefined ? "" : selectedClient.name;
          }}
        >
          <option />
          {#each $clients as client}
            <option value={client.id}>{client.name}</option>
          {/each}
        </select>
        <div class="text-base font-bold text-monsoon leading-[2.5rem] lg:leading-[3.5rem]">or</div>
        <Button style="outline" on:click={() => (isNewClient = true)}>+ Client</Button>
      </div>
    {:else}
      <label for="newClient">New Client</label>
      <div class="flex flex-wrap sm:flex-nowrap items-end gap-x-2 md:gap-x-5">
        <input
          class="mb-2 sm:mb-0"
          type="text"
          name="newClient"
          required={isNewClient}
          bind:value={invoice.client.name}
        />
        <div class="text-base font-bold text-monsoon leading-[2.5rem] lg:leading-[3.5rem]">or</div>
        <Button
          style="outline"
          on:click={() => {
            isNewClient = false;
            newClient = { ...blankClient };
          }}>+ Existing Client</Button
        >
      </div>
    {/if}
  </div>

  <!-- invoice id -->
  <div class="field row-start-1 md:row-start-auto col-span-6 md:col-span-2">
    <label for="invoiceNumber">Invoice ID</label>
    <input type="text" name="invoiceNumber" required bind:value={invoice.invoiceNumber} />
  </div>

  <!-- new client -->
  {#if isNewClient}
    <div class="field grid col-span-6 gap-x-5" transition:slide>
      <div class="field col-span-6">
        <label for="email">Client's Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required={isNewClient}
          bind:value={newClient.email}
        />
      </div>

      <div class="field col-span-6">
        <label for="street">Street</label>
        <input type="text" name="street" id="street" bind:value={newClient.street} />
      </div>

      <div class="field col-span-6">
        <label for="city">City</label>
        <input type="text" name="city" id="city" bind:value={newClient.city} />
      </div>

      <div class="field col-span-6">
        <label for="state">State</label>
        <select name="state" id="state" bind:value={newClient.state}>
          <option />
          {#each states as state}
            <option value={state.value}>{state.name}</option>
          {/each}
          <option value="TN">Tennessee</option>
        </select>
      </div>

      <div class="field col-span-6">
        <label for="zip">Zip</label>
        <input type="text" name="zip" id="zip" bind:value={newClient.zip} />
      </div>
    </div>
  {/if}

  <!-- due date -->
  <div class="field col-span-3 sm:col-span-2">
    <label for="dueDate"> Due Date</label>
    <input type="date" name="dueDate" min={today} required bind:value={invoice.dueDate} />
  </div>
  <!-- issue date -->
  <div class="field col-span-3 md:col-span-2 md:col-start-5">
    <label for="issueDate"> Issue Date</label>
    <input type="date" name="issueDate" min={today} bind:value={invoice.issueDate} />
  </div>
  <!-- subject -->
  <div class="field col-span-6">
    <label for="subject">Subject</label>
    <input type="text" name="subject" bind:value={invoice.subject} />
  </div>
  <!-- line items -->
  <div class="field col-span-6">
    <LineItemRows
      discount={invoice.discount === undefined ? 0 : invoice.discount}
      lineItems={invoice.lineItems}
      on:addLineItem={addLineItem}
      on:removeLineItem={removeLineItem}
      on:updateLineItem={updateLineItem}
      on:updateDiscount={updateDiscount}
    />
  </div>
  <!-- notes -->
  <div class="field col-span-6">
    <label for="notes"
      >Notes <span class="font-normal">(optional, displayed on invoice)</span></label
    >
    <textarea name="notes" id="notes" bind:value={invoice.notes}></textarea>
  </div>
  <!-- terms -->
  <div class="field col-span-6">
    <label for="terms"
      >Terms <span class="font-normal">(optional, enter your terms and conditions)</span></label
    >
    <textarea name="terms" id="terms" bind:value={invoice.terms}></textarea>
    <div class="text-xs text-gray-400">
      Formatting tips: <strong>*bold*</strong><em>_italics_</em>
    </div>
  </div>
  <!-- buttons -->
  <div class="field col-span-2">
    <!-- only be visible if editing -->
    {#if formState === "edit"}
      <Button style="textOnlyDestructive" iconLeft={Trash} on:click={() => (isModalShowing = true)}
        >Delete</Button
      >
    {/if}
  </div>
  <div class="field col-span-4 flex justify-end gap-x-5">
    <Button
      style="secondary"
      on:click={() => {
        dispatcher("closeForm");
      }}>Cancel</Button
    >
    <button
      type="submit"
      class="button bg-larvenderIndigo text-white translate-y-0 hover:-translate-y-2 transition-all shadow-colored hover:shadow-coloredHover"
      >Save</button
    >
  </div>
</form>

<ConfirmDelete
  {invoice}
  {isModalShowing}
  on:close={() => {
    isModalShowing = false;
    dispatcher("closeForm");
  }}
/>
