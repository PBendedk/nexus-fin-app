import { NextResponse } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

export async function GET(request: Request) {
  const supabase = await createAuthServerClient();

  await supabase.auth.signOut();

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "https";

  if (host) {
    return NextResponse.redirect(`${protocol}://${host}/login`);
  }

  return NextResponse.redirect(new URL("/login", request.url));
}