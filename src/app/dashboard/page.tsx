import Link from "next/link";
import { requireActiveMembership } from "@/lib/auth/require-active-membership";
import { supabaseAdmin } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { TenantSelector } from "@/components/tenant-selector";

export const dynamic = "force-dynamic";

function formatHnl(value: number) {
  return new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
    minimumFractionDigits: 2,
  }).format(value);
}

async function getCount(table: string, allowedTenantIds: string[]) {
  const query = supabaseAdmin
    .from(table)
    .select("*", { count: "exact", head: true });

  const { count, error } =
    table === "tenants"
      ? await query.in("id", allowedTenantIds)
      : await query.in("tenant_id", allowedTenantIds);

  if (error) {
    throw new Error(`Error reading ${table}: ${error.message}`);
  }

  return count ?? 0;
}

async function getDashboardData(allowedTenantIds: string[]) {
  const [
    invoicesResult,
    receivablesResult,
    allocationsResult,
    tenantsCount,
    companiesCount,
    invoicesCount,
    paymentsCount,
    auditLogsCount,
  ] = await Promise.all([
    supabaseAdmin
      .from("invoices")
      .select("amount,status")
      .in("tenant_id", allowedTenantIds),

    supabaseAdmin
      .from("receivables")
      .select("original_amount,balance,status")
      .in("tenant_id", allowedTenantIds),

    supabaseAdmin
      .from("payment_allocations")
      .select("amount")
      .in("tenant_id", allowedTenantIds),

    getCount("tenants", allowedTenantIds),
    getCount("companies", allowedTenantIds),
    getCount("invoices", allowedTenantIds),
    getCount("payments", allowedTenantIds),
    getCount("audit_logs", allowedTenantIds),
  ]);

  if (invoicesResult.error) {
    throw new Error(`Error reading invoices: ${invoicesResult.error.message}`);
  }

  if (receivablesResult.error) {
    throw new Error(
      `Error reading receivables: ${receivablesResult.error.message}`,
    );
  }

  if (allocationsResult.error) {
    throw new Error(
      `Error reading payment allocations: ${allocationsResult.error.message}`,
    );
  }

  const totalInvoiced = invoicesResult.data.reduce(
    (sum, invoice) => sum + Number(invoice.amount ?? 0),
    0,
  );

  const totalReceivableBalance = receivablesResult.data.reduce(
    (sum, receivable) => sum + Number(receivable.balance ?? 0),
    0,
  );

  const totalApplied = allocationsResult.data.reduce(
    (sum, allocation) => sum + Number(allocation.amount ?? 0),
    0,
  );

  return {
    totalInvoiced,
    totalApplied,
    totalReceivableBalance,
    tenantsCount,
    companiesCount,
    invoicesCount,
    paymentsCount,
    auditLogsCount,
  };
}

export default async function DashboardPage() {
  const { memberships } = await requireActiveMembership();

  const cookieStore = await cookies();
  const activeCookie = cookieStore.get("nexus_active_tenant")?.value;
  const isValidCookie = memberships.some((m) => m.tenant_id === activeCookie);

  const currentTenantId =
    isValidCookie && activeCookie ? activeCookie : memberships[0].tenant_id;

  const data = await getDashboardData([currentTenantId]);
  const activeTenantName = memberships.find(
    (m) => m.tenant_id === currentTenantId,
  )?.tenant_name;

  const kpis = [
    {
      label: "Total Facturado",
      value: formatHnl(data.totalInvoiced),
      helper: "Monto total de facturas registradas.",
    },
    {
      label: "Total Aplicado",
      value: formatHnl(data.totalApplied),
      helper: "Pagos aplicados a cuentas por cobrar.",
    },
    {
      label: "Saldo Pendiente",
      value: formatHnl(data.totalReceivableBalance),
      helper: "Balance actual pendiente de cobro.",
    },
    {
      label: "Audit Events",
      value: data.auditLogsCount,
      helper: "Eventos registrados en la caja negra del sistema.",
    },
  ];

  const operationalCounts = [
    { label: "Tenants", value: data.tenantsCount },
    { label: "Companies", value: data.companiesCount },
    { label: "Invoices", value: data.invoicesCount },
    { label: "Payments", value: data.paymentsCount },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              NEXUS FIN
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Dashboard financiero interno - {activeTenantName}
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Vista server-only conectada a Supabase para validar el MVP
              financiero: facturas, pagos aplicados, saldo pendiente y
              auditoría.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <TenantSelector
              memberships={memberships}
              currentTenantId={currentTenantId}
            />

            <Link
              href="/companies"
              className="text-sm font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Clientes
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-slate-200 hover:underline"
            >
              Landing
            </Link>

            <Link
              href="/logout"
              className="text-sm font-medium text-red-400 hover:underline"
            >
              Logout
            </Link>
          </div>
        </header>

        <section className="grid gap-4 py-10 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article
              key={kpi.label}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                {kpi.label}
              </p>
              <p className="mt-4 text-3xl font-bold">{kpi.value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {kpi.helper}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-bold">Conteo operativo</h2>

            <div className="mt-6 space-y-4">
              {operationalCounts.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl bg-slate-900 p-4"
                >
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-xl font-bold text-cyan-200">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <h2 className="text-xl font-bold text-cyan-100">
              Estado del flujo demo
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-200">
              <p>
                El flujo base ya demuestra una relación financiera completa:
                tenant, empresa, factura, cuenta por cobrar, pago aplicado y
                evento de auditoría.
              </p>

              <div className="rounded-2xl bg-slate-950/60 p-5">
                <p className="font-semibold text-cyan-200">
                  {activeTenantName} → Corporación XYZ Demo
                </p>
                <p className="mt-2 text-slate-300">
                  Factura demo: HNL 25,000. Pago aplicado: HNL 10,000. Saldo
                  pendiente esperado: HNL 15,000.
                </p>
              </div>

              <p className="text-slate-400">
                Próximo control obligatorio: tenant-scoped dashboard filtering
                y políticas RLS antes de exponer datos reales de clientes.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}