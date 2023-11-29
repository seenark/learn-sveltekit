<script lang="ts">
  import BlankRow from "$lib/components/BlankRow.svelte";
  import InvoiceRowHeader from "./InvoiceRowHeader.svelte";
</script>

<div>
  <!-- invoice header  -->
  <div class="-mt-8 md:-mt-6 lg:-mt-14">
    <h2
      class="pt-14 pl-24 md:pl-0 md:pr-28 text-left md:text-right mb-10 bg-arrowLeftUp md:bg-arrowRightUp bg-no-repeat bg-left md:bg-right font-handwritting text-2xl md:text-4xl font-bold text-caribbeanGreen"
    >
      Add Your First Invoice
    </h2>
  </div>
  <InvoiceRowHeader class="text-fog" />

  <!-- blank rows -->
  <BlankRow />
  <BlankRow />
  <BlankRow />
</div>
