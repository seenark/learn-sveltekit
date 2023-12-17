import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
  const session = await getSession();
  console.log("dashboard session", session);
  if (!session) {
    throw redirect(303, "/login");
  }
};
