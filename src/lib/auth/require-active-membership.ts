import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { supabaseAdmin } from "@/lib/supabase/server";

type ActiveMembership = {
  tenant_id: string;
  role: string;
  status: string;
  tenant_code: string;
  tenant_name: string;
};

export async function requireActiveMembership() {
  const authClient = await createAuthServerClient();

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data, error } = await supabaseAdmin
    .from("tenant_memberships")
    .select(
      `
      tenant_id,
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

  if (error) {
    throw new Error(`Error reading tenant memberships: ${error.message}`);
  }

  const memberships: ActiveMembership[] = (data ?? [])
    .map((membership) => {
      const tenant = Array.isArray(membership.tenants)
        ? membership.tenants[0]
        : membership.tenants;

      return {
        tenant_id: membership.tenant_id,
        role: membership.role,
        status: membership.status,
        tenant_code: tenant?.tenant_code ?? "",
        tenant_name: tenant?.name ?? "",
      };
    })
    .filter((membership) => membership.tenant_code && membership.tenant_name);

  if (memberships.length === 0) {
    redirect("/unauthorized");
  }

  return {
    user,
    memberships,
  };
}