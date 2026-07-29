"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient, User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  supabase: SupabaseClient;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  supabase: null as unknown as SupabaseClient,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useRef<SupabaseClient>(null as unknown as SupabaseClient);

  if (!supabase.current) {
    supabase.current = createClient();
  }

  useEffect(() => {
    const sb = supabase.current;

    // Fetch initial session
    sb.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, supabase: supabase.current, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
