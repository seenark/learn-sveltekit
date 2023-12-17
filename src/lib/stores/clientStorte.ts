import { writable } from "svelte/store";
import type { Client } from "../../global";
import supabase from "$lib/utils/supabase";
import { displayErrorMessage } from "$lib/utils/handleError";
import { snackbar } from "./snackbarStore";
import { deleteClientInvoices } from "./invoiceStore";

export const clients = writable<Client[]>([]);

export async function loadClients() {
  const { data, error } = await supabase
    .from("client")
    .select("*, invoice(id, invoiceStatus, lineItems(*))");
  if (error) {
    console.error(error);
    return;
  }
  console.log("client", data);
  clients.set(data);
}

export async function addClient(client: Client) {
  const { data, error } = await supabase
    .from("client")
    .insert([
      {
        userId: client.id,
        ...client,
        clientStatus: "active",
      },
    ])
    .select();
  if (error) {
    console.error(error);
    return;
  }
  const id = data[0].id;
  clients.update((clients) => [...clients, { ...client, clientStatus: "active", id }]);
  return client;
}

export async function getClientById(id: string) {
  const { data, error } = await supabase
    .from("client")
    .select("*, invoice(id, invoiceStatus, invoiceNumber, dueDate, client(id,name), lineItems(*))")
    .eq("id", id);
  if (error) {
    console.error(error);
    return;
  }
  if (data && data[0]) return data[0];
  console.warn(`cannot find client for id: ${id}`);
}

export const updateClient = async (clientToUpdate: Client) => {
  const { invoice, ...newClient } = clientToUpdate;
  const { data, error } = await supabase.from("client").update(newClient).eq("id", newClient.id);
  if (error) {
    displayErrorMessage(error);
    return;
  }
  clients.update((prev: Client[]) =>
    prev.map((cur: Client) => (cur.id === clientToUpdate.id ? clientToUpdate : cur)),
  );
  return clientToUpdate;
};

export const deleteClient = async (clientToDelete: Client) => {
  // delete the associated invoices in Supabase
  const isSuccessful = await deleteClientInvoices(clientToDelete.id);
  if (!isSuccessful) return;

  // delete the client within Supabase
  const { error } = await supabase.from("client").delete().eq("id", clientToDelete.id);

  if (error) {
    displayErrorMessage(error);
    return;
  }

  // update the store
  clients.update((prev: Client[]) => prev.filter((cur: Client) => cur.id !== clientToDelete.id));

  // display a success message
  snackbar.send({
    message: "Your client was successfully deleted.",
    type: "success",
  });

  return;
};
