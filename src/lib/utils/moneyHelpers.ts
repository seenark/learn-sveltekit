import type { Invoice, LineItem } from "../../global";

export function sumLineItems(lineItem?: LineItem[]): number {
  if (lineItem === undefined || lineItem.length === 0) return 0;
  return lineItem.reduce((prev, curr) => {
    return prev + (isNaN(curr.amount) ? 0 : curr.amount);
  }, 0);
}

/**
 * Calculates the total amount for an invoice, after applying a discount.
 *
 * @param lineItems - An array of line items for the invoice.
 * @param discount - The discount percentage to be applied.
 * @returns The total amount for the invoice after applying the discount.
 */
export function calculateInvoiceTotal(lineItems: LineItem[], discount: number): number {
  // Calculate the sum of all line items
  const sum = sumLineItems(lineItems);

  // Calculate the discount amount
  const discountAmount = (sum * discount) / 100;

  // Calculate the total amount after applying the discount
  const totalAmount = sum - discountAmount;

  return totalAmount;
}

export function centsToDollars(cent: number): string {
  const decimals = twoDecimals(cent / 100);
  return addThoundSeparator(decimals);
}

export function centsToDollarsWithoutSeparator(cent: number): string {
  const decimals = twoDecimals(cent / 100);
  return decimals;
}

export function twoDecimals(num: number): string {
  return num.toFixed(2);
}

export function addThoundSeparator(numStr: string): string {
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const sumInvoices = (invoices: Invoice[] | undefined): number => {
  if (!invoices) return 0;
  return invoices.reduce((prevValue, curValue) => {
    const invoiceSum = calculateInvoiceTotal(curValue.lineItems, curValue.discount || 0);
    return prevValue + invoiceSum;
  }, 0);
};

export function dollarsToCents(dollar: number): number {
  return dollar * 100;
}
