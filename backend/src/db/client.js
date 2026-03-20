import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error(
    "Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en las variables de entorno"
  );
}

export const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);