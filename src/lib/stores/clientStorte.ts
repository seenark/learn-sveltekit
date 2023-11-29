import { writable } from "svelte/store";
import type { Client } from "../../global";
import data from "../../seed.json";

export const clients = writable<Client[]>([]);

export function loadClients() {
  const cls: Client[] = data.clients;
  clients.set(cls);
}

export function addClient(client: Client) {
  clients.update((clients) => [...clients, { ...client, clientStatus: "active" }]);
  return client;
}

export function getClientById(id: string) {
  return data.clients.find((client) => client.id === id);
}

export const updateClient = (clientToUpdate: Client) => {
  clients.update((prev: Client[]) =>
    prev.map((cur: Client) => (cur.id === clientToUpdate.id ? clientToUpdate : cur)),
  );
  return clientToUpdate;
};
