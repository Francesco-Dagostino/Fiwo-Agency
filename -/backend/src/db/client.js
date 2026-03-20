import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error(
    "Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en el archivo .env"
  );
}

// Service key: permisos completos, bypasea RLS.
// NUNCA expongas esta key en el frontend.
export const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);