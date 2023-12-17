import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import seed from "./src/seed.json";
import type { Database } from "./src/lib/utils/supabase.types";

dotenv.config();
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || "";

/* ----------- ATTENTION: ADD VARIABLE --------------------------------------- */
const userId = "d97df385-063f-49bb-a137-a4b005781540";
/* --------------------------------------------------------------------------- */

console.log({ supabaseUrl, supabaseAnonKey });
// setup supabase
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

async function seedSettings(data: (typeof seed)["settings"]) {
  const result = await supabase.from("Settings").insert({
    userId,
    ...data,
  });
  console.log("seed settings result", result);
  console.log("⚙️ Added Settings");
}

async function seedLineItems(
  lineItem: (typeof seed)["clients"][number]["invoices"][number]["lineItems"][number],
) {
  const { id, ...rest } = lineItem;
  const result = await supabase.from("lineItems").insert({
    userId,
    ...rest,
  });

  console.log("📝 Added Line Item", result);
}

async function seedInvoice(invoice: (typeof seed)["clients"][number]["invoices"][number]) {
  const { id, client, lineItems, ...rest } = invoice;
  const result = await supabase.from("invoice").insert({
    userId,
    ...rest,
  });
  console.log("💰 Added Invoice", result);
  for await (const lineItem of lineItems) {
    await seedLineItems(lineItem);
  }
}

async function seedClient(data: (typeof seed)["clients"][number]) {
  const { id, invoices, ...rest } = data;
  const result = await supabase.from("client").insert({
    userId: userId,
    city: rest.city,
    clientStatus: rest.clientStatus,
    email: rest.email,
    name: rest.name,
    state: rest.state,
    street: rest.street,
    zip: rest.zip,
  });
  console.log("seed client result", result);
  console.log("👤 Added Client");

  for await (const invoice of invoices) {
    await seedInvoice(invoice);
  }
}

async function main() {
  for await (const client of seed.clients) {
    await seedClient(client);
  }

  seedSettings(seed.settings);
}

main();
console.log("✨ Done");
