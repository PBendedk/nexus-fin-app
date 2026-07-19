import { NextResponse } from "next/server";
import { requireActiveMembership } from "@/lib/auth/require-active-membership";
import { supabaseAdmin } from "@/lib/supabase/server";

function readTextField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const { memberships } = await requireActiveMembership();
  const formData = await request.formData();

  const tenantId = readTextField(formData, "tenantId");
  const legalName = readTextField(formData, "legalName");
  const taxId = readTextField(formData, "taxId");

  if (!tenantId || !legalName) {
    return NextResponse.json(
      { error: "El tenant y la razón social son obligatorios." },
      { status: 400 },
    );
  }

  const hasTenantAccess = memberships.some(
    (membership) => membership.tenant_id === tenantId,
  );

  if (!hasTenantAccess) {
    return NextResponse.json(
      { error: "No tienes acceso al tenant seleccionado." },
      { status: 403 },
    );
  }

  const { error } = await supabaseAdmin.from("companies").insert({
  tenant_id: tenantId,
  name: legalName,
  tax_id: taxId || null,
  status: "active",
});

  if (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "No se pudo crear el cliente." },
      { status: 500 },
    );
  }

  return new NextResponse(null, {
    status: 303,
    headers: { Location: "/companies" },
  });
}