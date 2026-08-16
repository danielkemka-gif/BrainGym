import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const ref = searchParams.get("ref") || searchParams.get("code") || "";
  const target = ref ? `/signup?ref=${encodeURIComponent(ref)}` : "/signup";
  const res = NextResponse.redirect(`${origin}${target}`);
  if (ref) {
    res.cookies.set("pending_ref", encodeURIComponent(ref), {
      path: "/",
      maxAge: 900,
      sameSite: "lax",
    });
  }
  return res;
}
