import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createAdminClient();

    // Create avatars bucket if it doesn't exist
    const { error: bucketError } = await supabase.storage.createBucket("avatars", {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    });

    if (bucketError && !bucketError.message.includes("already exists")) {
      return NextResponse.json({ error: bucketError.message }, { status: 500 });
    }

    // Try to update bucket to be public
    await supabase.storage.updateBucket("avatars", { public: true });

    return NextResponse.json({ success: true, message: "Avatars bucket ready" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
