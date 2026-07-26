"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { identifyUser } from "@/lib/analytics/events";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserName(data.user.user_metadata?.full_name || null);
        identifyUser(data.user.id, {
          email: data.user.email,
          name: data.user.user_metadata?.full_name,
          created_at: data.user.created_at,
        });
      }
    });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Topbar
          onMenuClick={() => setSidebarOpen((p) => !p)}
          userName={userName}
        />
        <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20 lg:p-6" style={{ paddingBottom: 'max(5rem, env(safe-area-inset-bottom))' }} tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
