import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/public";
import type { Database } from "$lib/utils/supabase.types";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  env.PUBLIC_SUPABASE_URL || "",
  env.PUBLIC_SUPABASE_ANON_KEY || "",
);

export default supabase;
