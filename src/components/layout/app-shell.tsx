import type { PropsWithChildren } from 'react'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen px-6 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col rounded-[28px] border border-black/10 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <header className="flex items-center justify-between border-b border-black/5 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/45">
              PROVA
            </p>
            <p className="mt-1 text-sm text-black/55">
              Verified disbursement platform scaffold
            </p>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            MVP setup
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}