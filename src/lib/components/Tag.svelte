<script lang="ts">
  export let label: "draft" | "sent" | "current" | "late" | "paid" | "archive" | "active" = "draft";
  export let className = "";
  export { className as class };
</script>

<div
  class={`text-md w-20 rounded-full text-center font-bold capitalize text-pastelPurple border-pastelPurple border-1 ${className}`}
  class:inverted={label === "draft" || label === "active"}
  class:success={label === "sent" || label === "current"}
  class:alert={label === "late"}
  class:archive={label === "paid" || label === "archive"}
>
  {label}
</div>

<style lang="postcss">
  .inverted {
    @apply border-pastelPurple text-pastelPurple;
  }

  .success {
    @apply border-robinEggBlue bg-robinEggBlue text-blueGem;
  }

  .alert {
    @apply border-scarlet bg-scarlet text-goldenFizz;
  }

  .archive {
    @apply border-pastelPurple bg-pastelPurple text-white;
  }
</style>
