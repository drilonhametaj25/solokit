import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Admin client using service role key
// Use this only in server-side code (API routes, server actions)
// This bypasses Row Level Security
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
