import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminSupabase = createAdminClient();

    // Create avatars bucket if it doesn't exist
    const { error: bucketError } = await adminSupabase.storage.createBucket("avatars", {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    });

    if (bucketError && !bucketError.message.includes("already exists")) {
      return NextResponse.json({ error: bucketError.message }, { status: 500 });
    }

    // Try to update bucket to be public
    await adminSupabase.storage.updateBucket("avatars", { public: true });

    return NextResponse.json({ success: true, message: "Avatars bucket ready" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

function isAdmin(user: any) {
  return (
    user?.app_metadata?.role === "admin" ||
    user?.user_metadata?.role === "admin"
  );
}
