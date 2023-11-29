declare namespace svelteHTML {
  interface HTMLAttributes<HTMLDivElement> {
    "on:outofview"?: (event) => void;
  }
}
