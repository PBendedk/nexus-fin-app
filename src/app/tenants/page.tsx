import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type JsonMap = Record<string, unknown>;

function asMap(value: unknown): JsonMap {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonMap;
  }

  return {};
}

function enabledItems(value: unknown): string[] {
  const map = asMap(value);

  return Object.entries(map)
    .filter(([, enabled]) => enabled === true)
    .map(([key]) => key.replaceAll("_", " "));
}

function formatBoolean(value: unknown): string {
  return value === true ? "Enabled" : "Disabled";
}

export default async function TenantsPage() {
  const { data, error } = await supabaseAdmin
    .from("tenant_configs")
    .select(
      `
      id,
      product_label,
      brand_name,
      collections_mode,
      ai_assistance_enabled,
      reporting_enabled,
      reporting_cadence,
      ai_capabilities,
      risk_rules,
      notes,
      tenants (
        tenant_code,
        name,
        country,
        currency,
        industry,
        status
      )
    `
    )
    .order("brand_name");

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
            ← Back to NEXUS FIN
          </Link>

          <section className="mt-8 rounded-2xl border border-red-500/40 bg-red-950/40 p-6">
            <h1 className="text-2xl font-semibold">Tenant Config Error</h1>
            <p className="mt-3 text-sm text-red-100">{error.message}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
          ← Back to NEXUS FIN
        </Link>

        <section className="mt-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            NEXUS FIN
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Tenant Configuration
          </h1>

          <p className="mt-4 max-w-3xl text-slate-300">
            Internal validation view for NEXUS FIN multi-tenant deployments.
            This confirms that UNIMED and TODICON are configured as tenant
            deployments of one reusable product.
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {data?.map((config) => {
            const tenant = Array.isArray(config.tenants)
              ? config.tenants[0]
              : config.tenants;

            const reportingItems = enabledItems(config.reporting_cadence);
            const aiItems = enabledItems(config.ai_capabilities);
            const riskRules = asMap(config.risk_rules);

            return (
              <article
                key={config.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                      {tenant?.tenant_code}
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                      {config.brand_name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {config.product_label}
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                    {tenant?.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-900/80 p-4">
                    <p className="text-slate-400">Tenant</p>
                    <p className="mt-1 font-medium">{tenant?.name}</p>
                    <p className="mt-1 text-slate-400">
                      {tenant?.country} · {tenant?.currency} ·{" "}
                      {tenant?.industry}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900/80 p-4">
                    <p className="text-slate-400">Collections Mode</p>
                    <p className="mt-1 text-lg font-semibold capitalize">
                      {config.collections_mode}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900/80 p-4">
                    <p className="text-slate-400">AI Assistance</p>
                    <p className="mt-1 font-medium">
                      {formatBoolean(config.ai_assistance_enabled)}
                    </p>

                    <ul className="mt-3 space-y-1 text-slate-300">
                      {aiItems.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-slate-900/80 p-4">
                    <p className="text-slate-400">Reporting</p>
                    <p className="mt-1 font-medium">
                      {formatBoolean(config.reporting_enabled)}
                    </p>

                    <ul className="mt-3 space-y-1 text-slate-300">
                      {reportingItems.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-slate-900/80 p-4">
                    <p className="text-slate-400">Risk / Control Rules</p>

                    <ul className="mt-3 space-y-1 text-slate-300">
                      {Object.entries(riskRules).map(([key, value]) => (
                        <li key={key}>
                          • {key.replaceAll("_", " ")}: {String(value)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {config.notes ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                      <p className="text-slate-400">Notes</p>
                      <p className="mt-1 text-slate-300">{config.notes}</p>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-xl font-semibold">Architecture Status</h2>

          <p className="mt-3 text-slate-300">
            NEXUS FIN is now structured as one deployable multi-tenant product.
            UNIMED and TODICON are tenant deployments with shared AI and full
            reporting capabilities, while operational collections mode may vary
            by tenant.
          </p>
        </section>
      </div>
    </main>
  );
}