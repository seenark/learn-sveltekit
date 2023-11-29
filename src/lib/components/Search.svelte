<script lang="ts">
  import Search from "$lib/icon/Search.svelte";
</script>

<div class="relative flex w-full items-baseline">
  <div class="mr-2 text-pastelPurple mt-auto">
    <Search />
  </div>
  <input
    type="text"
    name="search"
    placeholder="Search by keyword"
    class="search w-full pr-[80px] md:pr-0 md:w-[14rem] lg:w-72 border-b-2 border-dashed border-b-pastelPurple bg-transparent font-sansSerif text-base lg:text-xl text-black outline-none focus:border-b-larvenderIndigo focus:border-solid"
  />
  <button
    class="absolute pointer-events-none transition-transform transform duration-300 left-8 font-sansSerif text-lg lg:text-xl font-black text-pastelPurple"
    >Search</button
  >
</div>

<style lang="postcss">
  ::placeholder {
    color: transparent;
  }
  input:not(:placeholder-shown) + button,
  /* input ที่ focused และ อยู่ติดกับ button เราจะใส่ class ให้ button */
  input:focus + button {
    @apply pointer-events-auto translate-x-[calc(100%-65px)] lg:translate-x-80 md:translate-x-[16rem] left-auto md:left-0 right-0 md:right-auto text-right text-larvenderIndigo;
  }

  input + button:focus,
  input:focus + button:hover {
    @apply text-daisyBush;
  }
</style>
