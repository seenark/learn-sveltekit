import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { getSession, a } }) => {
  console.log(a);
  const session = await getSession();
  if (session) {
    throw redirect(303, "/invoices");
  }
};
