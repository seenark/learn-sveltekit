import { getInvoiceById } from "$lib/stores/invoiceStore";

export function load({ params }) {
  const id = params?.id;
  const invoice = getInvoiceById(id);
  console.log({ invoice });

  return {
    invoice,
  };
}
