import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Users, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAdminDashboard } from '@/lib/api'

const riskBadge: Record<string, string> = {
  Low: 'prova-chip-success',
  Medium: 'prova-chip-warm',
  High: 'prova-chip-danger',
}

export function HomePage() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
  })

  const queue = data?.recentQueue ?? []
  const metrics = data?.metrics

  const statCards = [
    {
      icon: Users,
      label: 'Beneficiaries',
      value: metrics ? new Intl.NumberFormat('en-US').format(metrics.totalBeneficiaries) : '--',
      note: 'Live records',
    },
    {
      icon: AlertTriangle,
      label: 'Pending review',
      value: metrics ? new Intl.NumberFormat('en-US').format(metrics.pendingVerifications) : '--',
      note: 'Needs manual action',
    },
    {
      icon: ShieldCheck,
      label: 'Trust score',
      value: metrics ? `${metrics.trustScore}%` : '--',
      note: 'Current confidence',
    },
    {
      icon: Wallet,
      label: 'Active programs',
      value: metrics ? new Intl.NumberFormat('en-US').format(metrics.activePrograms) : '--',
      note: metrics ? `${metrics.approvedBeneficiaries} ready to release` : 'Awaiting sync',
    },
  ]

  return (
    <>
      {isError ? (
        <section className="rounded-[24px] border border-[#ba1a1a]/30 bg-[#311311]/70 px-4 py-3 text-sm text-[#ffb4ab]">
          Live dashboard data could not be loaded: {error.message}
        </section>
      ) : null}

      <section className="prova-panel prova-hero-panel grid gap-6 rounded-[32px] p-6 md:p-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] xl:gap-8">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="prova-kicker w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            Live command center
          </div>

          <div className="max-w-[760px]">
            <h1 className="font-display prova-metric-value max-w-[720px] text-[2.9rem] font-semibold leading-[0.94] tracking-[-0.07em] text-white md:text-[4.8rem]">
              Trust before the transfer fires.
            </h1>
            <p className="mt-5 max-w-[520px] text-sm text-[#d9ccb8] md:text-base">Review first. Release second. Audit always.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="prova-chip-warm">AI review</span>
            <span className="prova-chip">Manual controls</span>
            <span className="prova-chip-info">Squad rail</span>
            <span className="prova-chip-success">Audit trail</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="prova-button-primary px-6 py-3.5 text-sm font-bold" to="/verification-hub">
              Open verification story
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="prova-button-secondary px-6 py-3.5 text-sm font-bold" to="/disbursements">
              Go to payout rail
            </Link>
          </div>
        </div>

        <div className="relative z-10 grid gap-4">
          <div className="prova-panel-soft rounded-[28px] p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Presentation sequence</p>
              <span className="prova-chip-warm">5 minute flow</span>
            </div>
            <div className="space-y-3">
              {[
                'Open the queue.',
                'Review one flagged case.',
                'Approve and release payout.',
                'Show audit and Squad status.',
              ].map((step, index) => (
                <div key={step} className="prova-panel-muted flex items-start gap-3 rounded-[20px] px-4 py-3">
                  <span className="font-display text-lg text-[#ffd59f]">{String(index + 1).padStart(2, '0')}</span>
                  <p className="text-sm leading-6 text-[#efe2cf]">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <div className="prova-panel-soft rounded-[28px] p-5">
              <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Live snapshot</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="prova-panel-muted rounded-[20px] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">Approved</p>
                  <p className="font-display prova-metric-value mt-2 text-[2rem] text-white">
                    {metrics ? metrics.approvedBeneficiaries : '--'}
                  </p>
                </div>
                <div className="prova-panel-muted rounded-[20px] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">Trust</p>
                  <p className="font-display prova-metric-value mt-2 text-[2rem] text-white">
                    {metrics ? `${metrics.trustScore}` : '--'}
                  </p>
                </div>
              </div>
            </div>

            <div className="prova-panel-soft rounded-[28px] p-5">
              <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Judge checks</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[#d9ccb8]">
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#92f0bb]" /> Squad is in the core flow.</p>
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#92f0bb]" /> The AI output is explainable.</p>
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#92f0bb]" /> The demo is live and auditable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ icon: Icon, label, note, value }) => (
          <article key={label} className="prova-panel rounded-[28px] p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">{label}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/4 text-[#ffd59f]">
                <Icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="font-display prova-metric-value text-[2.6rem] font-semibold leading-none text-white">{value}</p>
            <p className="mt-3 text-sm leading-6 text-[#d9ccb8]">{note}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <section className="prova-panel rounded-[32px] overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-5">
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Live review queue</p>
              <h2 className="mt-2 font-display text-[2rem] tracking-[-0.05em] text-white">Demo queue</h2>
            </div>
            <Link className="prova-button-secondary px-5 py-2.5 text-xs font-bold" to="/beneficiaries">
              Full ledger
            </Link>
          </div>

          {isLoading ? (
            <div className="px-6 py-10 text-sm text-[#d9ccb8]">Loading live verification queue...</div>
          ) : !queue.length ? (
            <div className="px-6 py-10 text-sm text-[#d9ccb8]">No live queue records exist yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="prova-table min-w-[760px] text-left">
                <thead>
                  <tr>
                    <th className="px-6 py-4">Beneficiary</th>
                    <th className="px-6 py-4">Program</th>
                    <th className="px-6 py-4">Risk</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((row) => (
                    <tr key={row.id}>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">{row.name}</p>
                        <p className="mt-1 text-xs text-[#998a76]">Ref {row.referenceId}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#efe2cf]">{row.type}</td>
                      <td className="px-6 py-4">
                        <span className={riskBadge[row.risk]}>{row.risk} risk</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#d9ccb8]">{row.time}</td>
                      <td className="px-6 py-4">
                        <Link className="prova-button-secondary px-4 py-2 text-xs font-bold" to={`/status?applicationId=${row.id}`}>
                          View status
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="prova-panel rounded-[32px] p-6">
          <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Talk track</p>
          <h2 className="mt-2 font-display text-[2rem] tracking-[-0.05em] text-white">Emphasize</h2>
          <div className="mt-5 space-y-4">
            {[
              'Trust gates the payout.',
              'Every decision is visible.',
              'Squad releases after review.',
              'The same flow scales beyond scholarships.',
            ].map((point) => (
              <div key={point} className="prova-panel-muted rounded-[22px] px-4 py-4">
                <p className="text-sm leading-7 text-[#efe2cf]">{point}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
