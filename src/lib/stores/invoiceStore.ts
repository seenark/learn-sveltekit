import { writable } from "svelte/store";
import type { Invoice } from "../../global";
import data from "../../seed.json";

export const invoices = writable<Invoice[]>([]);

export const loadInvoices = () => {
  // FIXME:
  invoices.set(data.invoices);
};

export function addInvoice(invoice: Invoice) {
  invoices.update((prev) => {
    return [...prev, invoice];
  });
  return invoice;
}

export function deleteInvoice(invoice: Invoice) {
  invoices.update((prev) => {
    return prev.filter((i) => i.id !== invoice.id);
  });
  return invoice;
}

export function updateInvoice(invoice: Invoice) {
  invoices.update((prev) =>
    prev.map((i) => {
      if (i.id === invoice.id) {
        return invoice;
      }
      return i;
    }),
  );
  return invoice;
}

export function getInvoiceById(id: string) {
  return data.invoices.find((i) => i.id === id) as Invoice;
}
