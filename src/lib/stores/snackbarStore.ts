import { writable } from "svelte/store";
import type { Snackbar } from "../../global";
import { v4 as randomUUID } from "uuid";

const newSnackbar = () => {
  const { update, subscribe } = writable<Snackbar[]>([]);

  function send(content: Pick<Snackbar, "message" | "type">) {
    const newContent: Snackbar = { ...content, id: randomUUID() };

    update((prev) => [...prev, newContent]);
  }

  function remove(id: string | null = null) {
    update((prev) => {
      if (id) return prev.filter((s) => s.id !== id);
      const [, ...rest] = prev;
      return rest;
    });
  }

  return {
    remove,
    send,
    subscribe,
  };
};

export const snackbar = newSnackbar();
