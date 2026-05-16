import { useQuery } from '@tanstack/react-query'
import {
  CheckCircle2,
  Clock3,
  Download,
  Filter,
  Flag,
  MoreVertical,
  Search,
  ShieldAlert,
  UserPlus,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listBeneficiaries } from '@/lib/api'

const statusTone: Record<string, string> = {
  approved: 'prova-chip-success',
  draft: 'prova-chip',
  pending: 'prova-chip-info',
  rejected: 'prova-chip-danger',
  review: 'prova-chip-warm',
  submitted: 'prova-chip-info',
}

const statusIcon: Record<string, React.ReactNode> = {
  approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  draft: <Clock3 className="h-3.5 w-3.5" />,
  pending: <Clock3 className="h-3.5 w-3.5" />,
  rejected: <ShieldAlert className="h-3.5 w-3.5" />,
  review: <ShieldAlert className="h-3.5 w-3.5" />,
  submitted: <Clock3 className="h-3.5 w-3.5" />,
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return 'No history'
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'NGN',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

function formatDate(value: string | null) {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function statusLabel(status: 'draft' | 'pending' | 'submitted' | 'approved' | 'review' | 'rejected') {
  const labels = {
    approved: 'Approved',
    draft: 'Draft',
    pending: 'Queued',
    rejected: 'Action required',
    review: 'In review',
    submitted: 'Pending',
  }

  return labels[status]
}

export function BeneficiariesPage() {
  const [searchValue, setSearchValue] = useState('')
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['beneficiaries'],
    queryFn: listBeneficiaries,
  })

  const beneficiaries = data?.beneficiaries ?? []
  const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
    const searchTerm = searchValue.trim().toLowerCase()

    if (!searchTerm) {
      return true
    }

    return [beneficiary.fullName, beneficiary.referenceId, beneficiary.programName, beneficiary.organizationName]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm)
  })

  return (
    <>
      <section className="prova-panel prova-hero-panel rounded-[32px] p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <div className="relative z-10">
            <div className="prova-kicker w-fit">Live recipient ledger</div>
            <h1 className="font-display prova-metric-value mt-5 text-[2.6rem] leading-[0.94] tracking-[-0.06em] text-white md:text-[4rem]">
              Beneficiary Ledger
            </h1>
            <p className="mt-4 max-w-[560px] text-sm text-[#d9ccb8]">
              Review live beneficiaries, monitor queue state, and jump directly into status and payout evidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="prova-chip">Live roster {data?.summary.totalActive ?? 0}</span>
              <span className="prova-chip-warm">Pending review {data?.summary.pendingReview ?? 0}</span>
              <span className="prova-chip-danger">Flags {data?.summary.flagged ?? 0}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            <article className="prova-panel-soft rounded-[28px] p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Total active</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/4 text-[#ffd59f]">
                  <Users className="h-4.5 w-4.5" />
                </span>
              </div>
              <p className="font-display prova-metric-value text-[2.6rem] leading-none text-white">
                {isLoading ? '--' : new Intl.NumberFormat('en-US').format(data?.summary.totalActive ?? 0)}
              </p>
              <p className="mt-3 text-sm text-[#d9ccb8]">Live beneficiaries in the current demo workspace.</p>
            </article>

            <article className="prova-panel-soft rounded-[28px] p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Pending review</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ffbf73]/18 bg-[#ffb357]/10 text-[#ffd59f]">
                  <Clock3 className="h-4.5 w-4.5" />
                </span>
              </div>
              <p className="font-display prova-metric-value text-[2.6rem] leading-none text-white">
                {isLoading ? '--' : new Intl.NumberFormat('en-US').format(data?.summary.pendingReview ?? 0)}
              </p>
              <p className="mt-3 text-sm text-[#d9ccb8]">Cases still waiting for operator resolution.</p>
            </article>

            <article className="prova-panel-soft rounded-[28px] p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Compliance flags</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ff8a8a]/18 bg-[#ba1a1a]/12 text-[#ffb4ab]">
                  <Flag className="h-4.5 w-4.5" />
                </span>
              </div>
              <p className="font-display prova-metric-value text-[2.6rem] leading-none text-white">
                {isLoading ? '--' : new Intl.NumberFormat('en-US').format(data?.summary.flagged ?? 0)}
              </p>
              <p className="mt-3 text-sm text-[#d9ccb8]">Recipients currently holding risk or evidence concerns.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="prova-panel rounded-[32px] p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-[520px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#998a76]" />
            <input
              className="prova-input w-full py-3 pl-10 pr-4 text-sm"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search names, refs, or programs..."
              type="text"
              value={searchValue}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="prova-chip">
              <Filter className="h-3.5 w-3.5" />
              Verified view
            </span>
            <button className="prova-button-secondary px-4 py-2.5 text-xs font-bold" type="button">
              <Download className="h-4 w-4" />
              CSV
            </button>
            <Link className="prova-button-primary px-5 py-2.5 text-xs font-bold" to="/onboarding">
              <UserPlus className="h-4 w-4" />
              Invite beneficiary
            </Link>
          </div>
        </div>
      </section>

      {isError ? (
        <section className="rounded-[24px] border border-[#ba1a1a]/30 bg-[#311311]/70 px-4 py-3 text-sm text-[#ffb4ab]">
          Live beneficiary data could not be loaded: {error.message}
        </section>
      ) : null}

      {isLoading ? (
        <section className="prova-panel rounded-[28px] px-6 py-10 text-sm text-[#d9ccb8]">
          Loading beneficiary records from your live Supabase project...
        </section>
      ) : null}

      {!isLoading && !filteredBeneficiaries.length ? (
        <section className="prova-panel rounded-[28px] px-6 py-10 text-sm text-[#d9ccb8]">
          {beneficiaries.length
            ? 'No beneficiaries match the current search.'
            : 'No beneficiary records exist yet. Use the onboarding flow to create the first live application.'}
        </section>
      ) : null}

      {filteredBeneficiaries.length ? (
        <>
          <section className="hidden overflow-hidden rounded-[32px] md:block">
            <div className="prova-panel overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-5">
                <div>
                  <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Recipient table</p>
                  <h2 className="mt-2 font-display text-[2rem] tracking-[-0.05em] text-white">Live beneficiaries</h2>
                </div>
                <span className="prova-chip">{filteredBeneficiaries.length} shown</span>
              </div>

              <div className="overflow-x-auto">
                <table className="prova-table min-w-[980px] text-left">
                  <thead>
                    <tr>
                      <th className="px-6 py-4">Beneficiary</th>
                      <th className="px-6 py-4">Entity</th>
                      <th className="px-6 py-4">Reference</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Last payout</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBeneficiaries.map((beneficiary) => (
                      <tr key={beneficiary.id}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/4 text-sm font-bold text-[#ffd59f]">
                              {beneficiary.initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{beneficiary.fullName}</p>
                              <p className="mt-1 text-xs text-[#998a76]">{beneficiary.maskedContact}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-white">{beneficiary.entity}</p>
                          <p className="mt-1 text-xs text-[#998a76]">{beneficiary.programName}</p>
                        </td>
                        <td className="px-6 py-5 font-mono text-[12px] text-[#d9ccb8]">{beneficiary.referenceId}</td>
                        <td className="px-6 py-5">
                          <span className={statusTone[beneficiary.status]}>
                            {statusIcon[beneficiary.status]}
                            {statusLabel(beneficiary.status)}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-white">{formatDate(beneficiary.lastPayoutDate)}</p>
                          <p className="mt-1 text-xs text-[#998a76]">{formatCurrency(beneficiary.lastPayoutAmount)}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link
                            className="prova-button-secondary h-10 w-10 p-0"
                            to={`/status?applicationId=${beneficiary.id}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:hidden">
            {filteredBeneficiaries.map((beneficiary) => (
              <article key={beneficiary.id} className="prova-panel rounded-[28px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/4 text-sm font-bold text-[#ffd59f]">
                      {beneficiary.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{beneficiary.fullName}</p>
                      <p className="mt-1 text-xs text-[#998a76]">{beneficiary.entity}</p>
                    </div>
                  </div>
                  <span className={statusTone[beneficiary.status]}>
                    {statusIcon[beneficiary.status]}
                    {statusLabel(beneficiary.status)}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="prova-panel-muted rounded-[20px] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Reference</p>
                    <p className="mt-2 font-mono text-[12px] text-[#d9ccb8]">{beneficiary.referenceId}</p>
                  </div>
                  <div className="prova-panel-muted rounded-[20px] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Last payout</p>
                    <p className="mt-2 text-sm text-white">{formatCurrency(beneficiary.lastPayoutAmount)}</p>
                    <p className="mt-1 text-xs text-[#998a76]">{formatDate(beneficiary.lastPayoutDate)}</p>
                  </div>
                </div>

                <Link className="prova-button-secondary mt-4 w-full px-4 py-3 text-sm font-semibold" to={`/status?applicationId=${beneficiary.id}`}>
                  Open status
                </Link>
              </article>
            ))}
          </section>
        </>
      ) : null}
    </>
  )
}
