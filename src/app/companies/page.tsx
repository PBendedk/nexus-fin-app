import Link from "next/link";
import { cookies } from "next/headers";
import { requireActiveMembership } from "@/lib/auth/require-active-membership";
import { supabaseAdmin } from "@/lib/supabase/server";
import { TenantSelector } from "@/components/tenant-selector";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  // 1. Validar la sesión y obtener los accesos del usuario
  const { memberships } = await requireActiveMembership();

  // 2. Leer la cookie para saber en qué espacio de trabajo estamos
  const cookieStore = await cookies();
  const activeCookie = cookieStore.get("nexus_active_tenant")?.value;
  const isValidCookie = memberships.some((m) => m.tenant_id === activeCookie);
  const currentTenantId = isValidCookie && activeCookie ? activeCookie : memberships[0].tenant_id;
  const activeTenantName = memberships.find((m) => m.tenant_id === currentTenantId)?.tenant_name;

  // 3. Consultar a la base de datos SOLO las empresas de este tenant
  const { data: companies, error } = await supabaseAdmin
    .from("companies")
    .select("*")
    .eq("tenant_id", currentTenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching companies: ${error.message}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        
        {/* Encabezado */}
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Gestión Comercial
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Directorio de Clientes
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <TenantSelector memberships={memberships} currentTenantId={currentTenantId} />
            <Link href="/dashboard" className="text-sm font-medium hover:underline text-slate-200">
              Dashboard
            </Link>
            <Link href="/logout" className="text-sm font-medium text-red-400 hover:underline">
              Logout
            </Link>
          </div>
        </header>

        {/* Barra de acciones */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-200">
            Clientes en {activeTenantName}
          </h2>
          <Link 
            href="/companies/new" 
            className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-400"
          >
            + Nuevo Cliente
          </Link>
        </div>

        {/* Tabla de datos */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Razón Social / Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Nombre Comercial</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">RTN / Tax ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Estado</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {companies && companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-white/[0.02]">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{company.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-400">{company.email || "-"}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-400">{company.tax_id || "-"}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        company.status === 'active' 
                          ? 'bg-green-400/10 text-green-400' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {company.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button className="text-cyan-400 hover:text-cyan-300">Editar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                    No hay clientes registrados en este espacio de trabajo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </section>
    </main>
  )}