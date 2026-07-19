import { redirect } from "next/navigation";
import { requireActiveMembership } from "@/lib/auth/require-active-membership";

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
  await requireActiveMembership();

  redirect("/dashboard");
}