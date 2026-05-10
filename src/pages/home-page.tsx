const workstreams = [
  {
    title: 'Admin dashboard',
    description: 'Batch setup, reviewer queue, payout monitoring.',
  },
  {
    title: 'Verification flow',
    description: 'Beneficiary submission, AI checks, trust decisions.',
  },
  {
    title: 'Payout controls',
    description: 'Squad lookup, release gating, transfer status audit.',
  },
]

const structure = [
  {
    path: 'src/components/layout',
    description: 'Shared app shell and reusable layout primitives.',
  },
  {
    path: 'src/pages',
    description: 'Top-level product screens while the app is still small.',
  },
  {
    path: 'supabase/functions',
    description: 'Reserved for Edge Functions that will call Squad and AI providers.',
  },
  {
    path: 'README.md',
    description: 'Project definition, product scope, and architecture notes.',
  },
]

export function HomePage() {
  return (
    <section className="flex min-h-full flex-col justify-center px-6 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-amber-700">
            Scholarship payout MVP
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            AI-verified payouts before money moves.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            This is the clean starting scaffold for PROVA. The structure is in place,
            the stack is wired, and the next layer is feature work, not template cleanup.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {workstreams.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-black/8 bg-stone-50 px-5 py-5"
            >
              <h2 className="text-lg font-semibold text-zinc-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-black/8 bg-zinc-950 px-6 py-6 text-white sm:px-7">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
              Current structure
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Minimal first iteration for teammates.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
              This repo is intentionally light. The goal of this pass is to show the
              agreed structure, not to build the full product yet.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {structure.map((item) => (
              <article
                key={item.path}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
              >
                <p className="font-mono text-sm text-amber-300">{item.path}</p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}