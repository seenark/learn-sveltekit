import type { ClientStatus, InvoiceStatus } from "./enums";

type Client = {
  city?: string;
  clientStatus?: ClientStatus;
  email: string;
  id: string;
  name: string;
  state?: string;
  street?: string;
  zip?: string;
  invoice?: Invoice[];
};

type LineItem = {
  amount: number;
  description: string;
  id: string;
  quantity: number;
};

type Invoice = {
  client: Client;
  createdAt: string;
  discount?: number;
  dueDate: string;
  id: string;
  invoiceNumber: string;
  invoiceStatus: InvoiceStatus;
  issueDate: string;
  lineItems: LineItem[];
  notes?: string;
  subject?: string;
  terms?: string;
};

type Settings = {
  myName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

type NotificationType = "info" | "warning" | "error" | "success";
type Snackbar = {
  id: string;
  message: string;
  type: NotificationType;
};
