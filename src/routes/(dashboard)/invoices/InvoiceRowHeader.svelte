<script lang="ts">
  let className = "";
  export { className as class };
</script>

<div class={`table-header hidden lg:grid invoice-table ${className}`}>
  <h3>Status</h3>
  <h3>Due Date</h3>
  <h3>ID</h3>
  <h3>Clients</h3>
  <h3 class="text-right">Amount</h3>
  <div></div>
  <div></div>
</div>

<style lang="postcss">
  .table-header h3 {
    @apply text-xl font-black leading-snug;
  }
</style>
