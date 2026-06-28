const modules = [
  {
    name: "ERP Core",
    description: "Clientes, facturas, cuentas por cobrar, pagos y saldos.",
    status: "Próximo",
  },
  {
    name: "Sentinel IA",
    description: "Lectura documental, extracción de campos y confidence score.",
    status: "Diseñado",
  },
  {
    name: "RFC Halt",
    description: "Bloqueo automático cuando la IA no alcanza confianza suficiente.",
    status: "Diseñado",
  },
  {
    name: "X-NSO Risk Engine",
    description: "Scoring de riesgo, mora, tiers y alertas de cobranza.",
    status: "Diseñado",
  },
  {
    name: "MSR Dashboard",
    description: "Vista ejecutiva de facturado, cobrado, vencido y riesgo.",
    status: "Próximo",
  },
  {
    name: "BPO Handoff",
    description: "Escalación controlada de casos a PAY-REC u otro partner.",
    status: "Futuro",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              NEXA Suite
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              NEXUS FIN
            </h1>
          </div>

          <div className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-200">
            MVP v0.1
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Finance SaaS with embedded AI Assistance
            </p>

            <h2 className="max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">
              ERP financiero ligero para documentos, cobros, riesgo y auditoría.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              NEXUS FIN convierte documentos financieros desordenados en flujos
              controlados de cuentas por cobrar, pagos, mora, riesgo y
              escalación. La IA asiste, pero el core financiero manda.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950">
                Core financiero primero
              </span>
              <span className="rounded-full border border-white/15 px-5 py-3 text-sm text-slate-200">
                IA con RFC Halt
              </span>
              <span className="rounded-full border border-white/15 px-5 py-3 text-sm text-slate-200">
                Audit log obligatorio
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/40">
            <h3 className="text-xl font-bold">Reglas no negociables</h3>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="font-semibold text-cyan-300">01. IA no toca saldos</p>
                <p className="mt-1 text-sm text-slate-300">
                  La IA puede sugerir, extraer y explicar. No modifica dinero sin
                  validación.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="font-semibold text-cyan-300">02. Confidence gate</p>
                <p className="mt-1 text-sm text-slate-300">
                  Si la confianza es menor a 90%, el caso entra en RFC Halt.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="font-semibold text-cyan-300">03. Trazabilidad</p>
                <p className="mt-1 text-sm text-slate-300">
                  Toda acción crítica debe generar evidencia y audit log.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Product modules
              </p>
              <h3 className="mt-2 text-2xl font-bold">Mapa inicial del MVP</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <article
                key={module.name}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-lg font-bold">{module.name}</h4>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-cyan-200">
                    {module.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {module.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
