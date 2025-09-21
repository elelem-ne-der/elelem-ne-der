import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // During build (or if envs are missing) create a minimal no-op mock to avoid
  // runtime/build-time crashes. This is a temporary safeguard — production
  // behavior requires real env vars configured in Vercel.
  _supabase = {
    auth: {
      onAuthStateChange: (_cb: any) => {
        return { data: null, subscription: { unsubscribe: () => {} } };
      },
    },
  } as unknown as SupabaseClient;
}

export const supabase = _supabase;

// Auth state listener helper — safe when supabase is the mock above
export const onAuthStateChange = (callback: (user: any) => void) => {
  if (!supabase || !supabase.auth || typeof supabase.auth.onAuthStateChange !== 'function') {
    return { data: null, subscription: { unsubscribe: () => {} } };
  }
  return supabase.auth.onAuthStateChange((event: any, session: any) => {
    callback(session?.user ?? null);
  });
};
