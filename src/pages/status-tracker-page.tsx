import { useQuery } from '@tanstack/react-query'
import {
  Check,
  Circle,
  CircleDot,
  Headset,
  Hourglass,
  Landmark,
  Receipt,
  SearchCode,
} from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBeneficiaryStatus } from '@/lib/api'

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Awaiting update'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'NGN',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

function statusTitle(status: 'draft' | 'pending' | 'submitted' | 'approved' | 'review' | 'rejected') {
  const labels = {
    approved: 'Approved for payout',
    draft: 'Draft application',
    pending: 'Queued for verification',
    rejected: 'Action required',
    review: 'Manual review',
    submitted: 'Verification in progress',
  }

  return labels[status]
}

function statusBadge(status: 'draft' | 'pending' | 'submitted' | 'approved' | 'review' | 'rejected') {
  const labels = {
    approved: 'Ready for disbursement',
    draft: 'Incomplete submission',
    pending: 'Waiting in queue',
    rejected: 'Needs correction',
    review: 'Under compliance review',
    submitted: 'Automated checks running',
  }

  return labels[status]
}

function statusTone(status: 'draft' | 'pending' | 'submitted' | 'approved' | 'review' | 'rejected') {
  if (status === 'approved') {
    return 'prova-chip-success'
  }

  if (status === 'review' || status === 'submitted' || status === 'pending') {
    return 'prova-chip-warm'
  }

  if (status === 'rejected') {
    return 'prova-chip-danger'
  }

  return 'prova-chip'
}

export function StatusTrackerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const applicationId = searchParams.get('applicationId')?.trim() ?? ''
  const [draftLookupValue, setDraftLookupValue] = useState<string | null>(null)
  const lookupValue = draftLookupValue ?? applicationId

  const { data, error, isError, isLoading } = useQuery({
    enabled: Boolean(applicationId),
    queryKey: ['beneficiary-status', applicationId],
    queryFn: () => getBeneficiaryStatus(applicationId),
  })

  function handleLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!lookupValue.trim()) {
      return
    }

    setSearchParams({ applicationId: lookupValue.trim() })
    setDraftLookupValue(null)
  }

  const currentStatus = data?.beneficiary.currentStatus ?? 'submitted'

  return (
    <main className="grid w-full max-w-[1600px] grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
      <div className="flex flex-col gap-6">
        <section className="prova-panel prova-hero-panel rounded-[32px] p-6 md:p-8">
          <div className="relative z-10 max-w-[760px]">
            <div className="prova-kicker w-fit">Live application tracking</div>
            <h1 className="font-display prova-metric-value mt-5 text-[2.6rem] leading-[0.94] tracking-[-0.06em] text-white md:text-[4rem]">
              Application Status
            </h1>
            <p className="mt-4 max-w-[560px] text-sm text-[#d9ccb8]">
              Track verification, review, and payout progress from a single beneficiary view.
            </p>
            {applicationId ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <span className={statusTone(currentStatus)}>{statusBadge(currentStatus)}</span>
                <span className="prova-chip">Application {applicationId.slice(0, 8)}</span>
              </div>
            ) : null}
          </div>
        </section>

        <section className="prova-panel rounded-[28px] p-5">
          <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleLookup}>
            <input
              className="prova-input min-w-0 flex-1 px-4 py-3 text-sm"
              onChange={(event) => setDraftLookupValue(event.target.value)}
              placeholder="Paste the live application ID"
              type="text"
              value={lookupValue}
            />
            <button className="prova-button-primary px-5 py-3 text-sm font-bold" type="submit">
              Track application
            </button>
          </form>
        </section>

        {isError ? (
          <section className="rounded-[24px] border border-[#ba1a1a]/30 bg-[#311311]/70 px-4 py-3 text-sm text-[#ffb4ab]">
            Status lookup failed: {error.message}
          </section>
        ) : null}

        {!applicationId ? (
          <section className="prova-panel rounded-[28px] px-6 py-8 text-sm text-[#d9ccb8]">
            Enter an application ID above to load the live verification and payout timeline.
          </section>
        ) : null}

        <section className="prova-panel rounded-[32px] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#ffbf73]/22 bg-[#ffb357]/10 text-[#ffd59f]">
                <SearchCode className="h-8 w-8" />
              </div>
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Current status</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {applicationId ? (isLoading ? 'Loading application...' : statusTitle(currentStatus)) : 'Awaiting lookup'}
                </h2>
              </div>
            </div>

            <span className={`${statusTone(currentStatus)} text-sm`}>
              <Hourglass className="h-4 w-4" />
              {applicationId ? (isLoading ? 'Syncing live record' : statusBadge(currentStatus)) : 'Enter an application ID'}
            </span>
          </div>
        </section>

        <section className="prova-panel rounded-[32px] p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Timeline</p>
              <h3 className="mt-2 font-display text-[2rem] tracking-[-0.05em] text-white">Verification path</h3>
            </div>
            {data?.timeline?.length ? <span className="prova-chip">{data.timeline.length} steps</span> : null}
          </div>

          {isLoading && applicationId ? (
            <div className="rounded-[22px] border border-white/8 bg-white/[0.025] px-4 py-8 text-center text-sm text-[#d9ccb8]">
              Loading your live verification timeline...
            </div>
          ) : data?.timeline?.length ? (
            <div className="relative">
              <div className="absolute bottom-4 left-[15px] top-[18px] w-px bg-white/8" />
              <div className="flex flex-col gap-6">
                {data.timeline.map((step, index) => {
                  const icon = step.status === 'completed'
                    ? <Check className="h-4 w-4 text-[#09110c]" />
                    : step.status === 'active'
                      ? <CircleDot className="h-4 w-4 text-[#ffd59f]" />
                      : <Circle className="h-4 w-4 text-[#998a76]" />

                  const wrapperClassName = step.status === 'completed'
                    ? 'border-[#92f0bb]/26 bg-[#92f0bb]'
                    : step.status === 'active'
                      ? 'border-[#ffbf73]/26 bg-[#ffb357]/12'
                      : 'border-white/8 bg-white/[0.03]'

                  return (
                    <div className="relative flex gap-4" key={step.key}>
                      <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${wrapperClassName}`}>
                        {icon}
                      </div>
                      <div className="min-w-0 flex-1 rounded-[22px] border border-white/8 bg-white/[0.025] px-4 py-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <h4 className={`text-lg font-semibold ${step.status === 'active' ? 'text-[#ffd59f]' : 'text-white'}`}>
                            {step.label}
                          </h4>
                          <span className={step.status === 'completed' ? 'prova-chip-success' : step.status === 'active' ? 'prova-chip-warm' : 'prova-chip'}>
                            {step.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#d9ccb8]">{step.description}</p>
                        <p className="mt-3 text-xs text-[#998a76]">{formatTimestamp(step.timestamp)}</p>
                      </div>
                      {index === data.timeline.length - 1 ? null : null}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-[22px] border border-white/8 bg-white/[0.025] px-4 py-8 text-center text-sm text-[#d9ccb8]">
              No timeline is available for this application yet.
            </div>
          )}
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <section className="prova-panel rounded-[32px] p-6 md:sticky md:top-24">
          <div className="mb-6 flex items-center gap-2 border-b border-white/8 pb-4">
            <Receipt className="h-5 w-5 text-[#ffd59f]" />
            <h3 className="text-xl font-semibold text-white">Submission Details</h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="prova-panel-muted rounded-[20px] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Application ID</p>
              <p className="mt-2 break-all font-mono text-[12px] text-[#f0e3cf]">{applicationId || 'Waiting for lookup'}</p>
            </div>

            <div className="prova-panel-muted rounded-[20px] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Applicant</p>
              <p className="mt-2 text-sm font-semibold text-white">{data?.beneficiary.fullName ?? 'Pending lookup'}</p>
            </div>

            <div className="prova-panel-muted rounded-[20px] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Institution</p>
              <p className="mt-2 text-sm text-white">{data?.beneficiary.organizationName ?? 'Pending lookup'}</p>
            </div>

            <div className="prova-panel-muted rounded-[20px] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Disbursement method</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-white">
                <Landmark className="h-4 w-4 text-[#ffd59f]" />
                {data?.beneficiary.programType ?? 'Direct deposit'}
              </div>
            </div>

            <div className="prova-panel-muted rounded-[20px] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Account number</p>
              <p className="mt-2 font-mono text-[12px] text-[#f0e3cf]">**** **** **** {data?.beneficiary.accountLast4 ?? '----'}</p>
            </div>

            {data?.verification ? (
              <div className="prova-panel-muted rounded-[20px] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Verification signals</p>
                <div className="mt-3 grid gap-2 text-sm text-[#d9ccb8]">
                  <div className="flex items-center justify-between gap-3">
                    <span>Liveness score</span>
                    <strong className="text-white">{data.verification.livenessScore}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Face match score</span>
                    <strong className="text-white">{data.verification.faceMatchScore}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Risk score</span>
                    <strong className="text-white">{data.verification.riskScore}</strong>
                  </div>
                </div>
              </div>
            ) : null}

            {data?.payout ? (
              <div className="prova-panel-muted rounded-[20px] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Payout status</p>
                <div className="mt-3 grid gap-2 text-sm text-[#d9ccb8]">
                  <div className="flex items-center justify-between gap-3">
                    <span>Amount</span>
                    <strong className="text-white">{formatCurrency(data.payout.amount)}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Rail state</span>
                    <strong className="capitalize text-white">{data.payout.squadStatus}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Released</span>
                    <strong className="text-white">{formatTimestamp(data.payout.releasedAt)}</strong>
                  </div>
                </div>
              </div>
            ) : null}

            {data?.verification?.reasonCodes?.length ? (
              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-[#998a76]">Decision reasons</p>
                <div className="flex flex-wrap gap-2">
                  {data.verification.reasonCodes.map((reasonCode) => (
                    <span className="prova-chip" key={reasonCode}>
                      {reasonCode.replaceAll('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <button className="prova-button-secondary mt-6 w-full px-4 py-3 text-sm font-semibold" type="button">
            <Headset className="h-4 w-4" />
            Contact support
          </button>
        </section>
      </div>
    </main>
  )
}
