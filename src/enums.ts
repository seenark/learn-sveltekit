export const enum InvoiceStatus {
  draft = "draft",
  sent = "sent",
  paid = "paid",
}

// export const enum ClientStatus {
//   active = "active",
//   archived = "archive",
// }
export type ClientStatus = "active" | "archive";
