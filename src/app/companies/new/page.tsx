import Link from "next/link";
import { cookies } from "next/headers";
import { requireActiveMembership } from "@/lib/auth/require-active-membership";

export const dynamic = "force-dynamic";

export default async function NewCompanyPage() {
  const { memberships } = await requireActiveMembership();

  const cookieStore = await cookies();
  const activeCookie = cookieStore.get("nexus_active_tenant")?.value;

  const isValidCookie = memberships.some(
    (membership) => membership.tenant_id === activeCookie,
  );

  const currentTenantId =
    isValidCookie && activeCookie
      ? activeCookie
      : memberships[0].tenant_id;

  const activeTenantName = memberships.find(
    (membership) => membership.tenant_id === currentTenantId,
  )?.tenant_name;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <Link
            href="/companies"
            className="text-sm font-medium text-cyan-400 hover:underline"
          >
            ← Volver al directorio
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Agregar Nuevo Cliente
          </h1>

          <p className="mt-2 text-slate-400">
            Este cliente se registrará en el espacio de trabajo:{" "}
            <strong className="text-white">{activeTenantName}</strong>
          </p>
        </header>

        <form
          action="/api/companies"
          method="POST"
          className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-8"
        >
          <input type="hidden" name="tenantId" value={currentTenantId} />

          <div>
            <label
              htmlFor="legalName"
              className="block text-sm font-medium text-slate-300"
            >
              Razón Social / Nombre Completo *
            </label>

            <input
              type="text"
              name="legalName"
              id="legalName"
              required
              placeholder="Ej. Inversiones Tecnológicas S.A."
              className="mt-2 block w-full rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label
              htmlFor="tradeName"
              className="block text-sm font-medium text-slate-300"
            >
              Nombre Comercial{" "}
              <span className="text-slate-500">(Opcional)</span>
            </label>

            <input
              type="text"
              name="tradeName"
              id="tradeName"
              placeholder="Ej. InveTec"
              className="mt-2 block w-full rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label
              htmlFor="taxId"
              className="block text-sm font-medium text-slate-300"
            >
              RTN / Tax ID{" "}
              <span className="text-slate-500">(Opcional)</span>
            </label>

            <input
              type="text"
              name="taxId"
              id="taxId"
              placeholder="08019999123456"
              className="mt-2 block w-full rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-md bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}