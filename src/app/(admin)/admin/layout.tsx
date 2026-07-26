import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 lg:ml-60">
        <header className="flex h-14 items-center border-b border-border bg-background px-4 lg:px-6">
          <h1 className="text-sm font-semibold text-muted-foreground">Admin Panel</h1>
        </header>
        <main id="main-content" className="p-4 lg:p-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
