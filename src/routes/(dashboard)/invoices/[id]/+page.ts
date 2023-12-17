import { getInvoiceById } from "$lib/stores/invoiceStore";

export async function load({ params }) {
  const id = params?.id;
  const invoice = await getInvoiceById(id);
  console.log({ invoice });

  return {
    invoice,
  };
}
