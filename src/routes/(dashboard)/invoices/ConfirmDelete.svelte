<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { deleteInvoice } from "$lib/stores/invoiceStore";
  import { centsToDollars, sumLineItems } from "$lib/utils/moneyHelpers";
  import { createEventDispatcher } from "svelte";
  import type { Invoice } from "../../../global";
  import { snackbar } from "$lib/stores/snackbarStore";

  export let isModalShowing = false;
  export let invoice: Invoice;

  const dispatcher = createEventDispatcher();
</script>

<Modal isVisible={isModalShowing} on:close>
  <div class="flex flex-col justify-between items-center gap-6 min-h-[175px]">
    <div class="text-center text-xl font-bold text-daisyBush">
      Are you sure you want to delete this invoice to ?
      <span class="text-scarlet">{invoice.client.name}</span> for
      <span class="text-scarlet">${centsToDollars(sumLineItems(invoice.lineItems))}</span>
    </div>
    <div class="flex gap-4">
      <Button
        isAnimated={false}
        style="secondary"
        on:click={() => {
          dispatcher("close");
        }}>Cancel</Button
      >
      <Button
        isAnimated={false}
        style="destructive"
        on:click={() => {
          deleteInvoice(invoice);
          dispatcher("close");
          snackbar.send({
            message: "Your invoice was successfully deleted.",
            type: "success",
          });
        }}>Yes, Delete It</Button
      >
    </div>
  </div>
</Modal>
