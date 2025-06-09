import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/constants/supabase";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(SUPABASE_URL, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
