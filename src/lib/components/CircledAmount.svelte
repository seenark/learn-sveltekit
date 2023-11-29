<script lang="ts">
  export let label: string;
  export let amount: string;
</script>

<div class="flex gap-x-4 bg-circle bg-no-repeat min-h-[6rem] min-w-[16rem] center float-right">
  <div class="font-bold">{label}</div>
  <div class="font-mono text-xl font-bold">{amount}</div>
</div>
