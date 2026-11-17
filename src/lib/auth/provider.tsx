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
    let mounted = true;

    // Safety timeout: ensure loading resolves within 3 seconds even if database is paused or offline
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 3000);

    // Fetch initial session safely
    sb.auth
      .getUser()
      .then(({ data }) => {
        if (mounted) {
          setUser(data?.user ?? null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Supabase auth unreachable or paused:", err);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
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
