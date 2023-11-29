<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { loadSettings, settings } from "$lib/stores/settingsStore";
  import { convertDate } from "$lib/utils/dateHelpers.js";
  import { onMount } from "svelte";
  import LineItemRows from "../LineItemRows.svelte";
  import SvelteMarkdown from "svelte-markdown";
  import { page } from "$app/stores";

  export let data;
  console.log(data);
  let copyLinkLabel = "Copy Link";

  function printInvoice() {
    window.print();
  }

  function copyLink() {
    navigator.clipboard.writeText($page.url.href);
    console.log("copy link");
    copyLinkLabel = "Copied!";
    setTimeout(() => {
      copyLinkLabel = "Copy Link";
    }, 1250);
  }

  function payInvoice() {
    console.log("pay invoice");
  }
  function sendInvoice() {
    console.log("Send invoice");
  }

  onMount(() => {
    loadSettings();
  });
</script>

<div
  class="fixed z-0 mb-16 flex flex-col md:flex-row gap-y-5 px-4 lg:px-0 justify-between w-full max-w-screen-lg print:hidden"
>
  <h1 class="text-xl font-bold text-daisyBush">Invoice</h1>
  <div class="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-4">
    <Button isAnimated height="short" style="outline" on:click={printInvoice}>Print</Button>
    <Button isAnimated height="short" on:click={copyLink} class="min-w-[100px] sm:min-w-[178px]"
      >{copyLinkLabel}</Button
    >
    <Button isAnimated height="short" on:click={payInvoice}>Pay Invoice</Button>
    <Button isAnimated height="short" on:click={sendInvoice}>Send</Button>
  </div>
</div>

<div
  class="relative print:top-0 top-32 z-10 grid grid-cols-6 gap-x-5 gap-y-8 bg-white py-8 print:py-0 px-5 md:py-16 md:px-32 shadow-invoice print:shadow-none"
>
  <div class="sm:col-span-3 print:col-span-3 col-span-6">
    <img
      src="/images/logo.png"
      srcset="/images/logo@2x.png 2x, /images/logo.png 1x"
      alt="Compressed.fm"
    />
  </div>

  <div class="col-span-6 sm:col-span-2 sm:col-start-5 pt-4">
    {#if $settings && $settings.myName}
      <div class="label">From</div>
      <p>
        {$settings.myName}<br />
        {#if $settings.street && $settings.city && $settings.state && $settings.zip}
          {$settings.street} <br />
          {$settings.city}, {$settings.state}
          {$settings.zip}
        {/if}
      </p>
    {:else}
      <div class="center min-h-[68px] rounded bg-gallery print:col-span-3">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#" class="text-stone-600 underline hover:no-underline"
          >Add your contact information.</a
        >
      </div>
    {/if}
  </div>

  <div class="col-span-6 sm:col-span-3 print:col-span-3">
    <div class="label">Bill to</div>
    <p>
      <strong>{data.invoice?.client.name}</strong><br />
      {data.invoice?.client.email}<br />
      {data.invoice?.client.street}<br />
      {data.invoice?.client.city}, {data.invoice?.client.state}
      {data.invoice?.client.zip}
    </p>
  </div>

  <div class="col-span-6 sm:col-span-2 sm:col-start-5">
    <div class="label">Invoice ID</div>
    <p>{data.invoice?.invoiceNumber}</p>
  </div>

  <div class="col-span-3">
    <div class="label">Due Date</div>
    <p>{data.invoice && convertDate(data.invoice.dueDate)}</p>
  </div>

  <div class="col-span-3 sm:col-span-2 sm:col-start-5">
    <div class="label">Issue Date</div>
    <p>{data.invoice && convertDate(data.invoice.issueDate)}</p>
  </div>

  <div class="col-span-6">
    <div class="label">Subject</div>
    <p>{data.invoice?.subject}</p>
  </div>

  <div class="col-span-6">
    <!-- line items -->
    <LineItemRows
      lineItems={data.invoice.lineItems || []}
      isEditable={false}
      discount={data.invoice.discount}
    />
  </div>

  {#if data.invoice?.notes}
    <div class="col-span-6">
      <div class="label">Notes</div>
      <SvelteMarkdown source={data.invoice.notes} />
    </div>
  {/if}

  {#if data.invoice?.terms}
    <div class="col-span-6">
      <div class="label">Terms and Coditions</div>
      <SvelteMarkdown source={data.invoice.terms} />
    </div>
  {/if}
</div>

<style lang="postcss">
  .label {
    @apply font-black text-monsoon;
  }
</style>
