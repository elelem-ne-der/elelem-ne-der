import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let _supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  _supabase = createClient(supabaseUrl as string, supabaseAnonKey as string, {
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
      // Provide friendly error methods to avoid undefined function crashes
      signInWithPassword: async () => {
        throw new Error('Supabase yapılandırılmamış: NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY ayarlanmalı.');
      },
      signUp: async () => {
        throw new Error('Supabase yapılandırılmamış: NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY ayarlanmalı.');
      },
      signOut: async () => ({ error: null }),
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
