import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function requireActiveMembership() {
  const authClient = await createAuthServerClient();

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: memberships, error: membershipsError } = await supabaseAdmin
    .from("tenant_memberships")
    .select(
      `
      role,
      status,
      tenants (
        tenant_code,
        name
      )
    `
    )
    .eq("user_id", user.id)
    .eq("status", "active");

  if (membershipsError) {
    throw new Error(
      `Error reading tenant memberships: ${membershipsError.message}`
    );
  }

  if (!memberships || memberships.length === 0) {
    redirect("/login?error=unauthorized");
  }

  return {
    user,
    memberships,
  };
}