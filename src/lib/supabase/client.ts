import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://qxivwyyompzpipfzcufl.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_2AwU9whNSoohKmLAdq6wtw_VC7Oydiu";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
