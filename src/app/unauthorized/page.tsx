import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center">
        <section className="rounded-3xl border border-red-400/20 bg-red-400/10 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-red-300">
            NEXUS FIN
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Access not authorized
          </h1>

          <p className="mt-4 text-slate-300">
            Your login is valid, but your account does not currently have an
            active tenant membership for NEXUS FIN.
          </p>

          <p className="mt-4 text-sm text-slate-400">
            Contact a NEXUS FIN administrator if you believe you should have
            access to UNIMED, TODICON, or another tenant deployment.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-full bg-cyan-300 px-5 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-cyan-200"
            >
              Back to login
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-semibold text-slate-200 hover:border-cyan-300 hover:text-cyan-200"
            >
              Back to landing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}