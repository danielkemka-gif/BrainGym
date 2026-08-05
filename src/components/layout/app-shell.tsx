"use client";

import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { identifyUser } from "@/lib/analytics/events";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { TouchDebug } from "@/components/debug/touch-debug";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setUserName(user.user_metadata?.full_name || null);
    identifyUser(user.id, {
      email: user.email,
      name: user.user_metadata?.full_name,
      created_at: user.created_at,
    });
  }, [user]);

  return (
    <div className="flex min-h-dvh">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar
          onMenuClick={() => setSidebarOpen((p) => !p)}
          userName={userName}
        />
        <main
          id="main-content"
          className="flex-1 w-full max-w-full px-3 py-3 pb-28 sm:px-4 sm:py-4 lg:p-6"
          style={{
            paddingBottom: 'max(7rem, calc(env(safe-area-inset-bottom) + 4rem))',
          }}
          tabIndex={-1}
        >
          {children}
        </main>
        <MobileNav />
        {process.env.NODE_ENV === "development" && <TouchDebug />}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShellInner>{children}</AppShellInner>
    </AuthProvider>
  );
}
