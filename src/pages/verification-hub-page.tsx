import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Ban, Braces, CheckCircle, Cpu, Pause, Sparkles } from 'lucide-react'
import { getVerificationQueue, reviewBeneficiary, type ReviewAction } from '@/lib/api'

function statusTone(status: string) {
  if (status === 'approved') {
    return 'prova-chip-success'
  }

  if (status === 'review') {
    return 'prova-chip-warm'
  }

  if (status === 'rejected') {
    return 'prova-chip-danger'
  }

  if (status === 'pending' || status === 'submitted') {
    return 'prova-chip-info'
  }

  return 'prova-chip'
}

function formatRelativeTime(value: string) {
  const createdAt = new Date(value).getTime()
  const diffMinutes = Math.max(1, Math.round((Date.now() - createdAt) / (1000 * 60)))

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  return `${Math.round(diffHours / 24)}d ago`
}

function labelForReason(reasonCode: string) {
  return reasonCode.replaceAll('_', ' ')
}

const signalRows = [
  { key: 'faceMatchScore', label: 'Face' },
  { key: 'documentScore', label: 'Document' },
  { key: 'livenessScore', label: 'Liveness' },
] as const

export function VerificationHubPage() {
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = useState<string>('')
  const [noteById, setNoteById] = useState<Record<string, string>>({})
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['verification-queue'],
    queryFn: getVerificationQueue,
  })

  const reviewMutation = useMutation({
    mutationFn: (payload: { action: ReviewAction; beneficiaryId: string; notes: string }) => reviewBeneficiary(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['verification-queue'] }),
        queryClient.invalidateQueries({ queryKey: ['beneficiaries'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['disbursement-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['audit-events'] }),
      ])
    },
  })

  const queue = data?.queue ?? []
  const effectiveSelectedId = selectedId || queue[0]?.id || ''
  const selected = queue.find((item) => item.id === effectiveSelectedId) ?? null
  const notes = selected ? (noteById[selected.id] ?? selected.reviewNotes ?? '') : ''
  const trustScore = selected?.riskScore === null || selected?.riskScore === undefined ? 0 : Math.max(0, 100 - selected.riskScore)

  function handleAction(action: ReviewAction) {
    if (!selected || !notes.trim()) {
      return
    }

    reviewMutation.mutate({
      action,
      beneficiaryId: selected.id,
      notes: notes.trim(),
    })
  }

  return (
    <>
      <section className="prova-panel prova-hero-panel rounded-[32px] p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_300px]">
          <div className="relative z-10">
            <div className="prova-kicker w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              Review console
            </div>
            <h1 className="font-display prova-metric-value mt-5 text-[2.5rem] leading-[0.94] tracking-[-0.06em] text-white md:text-[4rem]">
              Trust Review
            </h1>
            <p className="mt-4 max-w-[520px] text-sm text-[#d9ccb8]">Inspect the case. Write the note. Decide.</p>
          </div>

          <div className="prova-panel-soft relative z-10 rounded-[28px] p-5">
            <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Queue snapshot</p>
            <div className="mt-4 grid gap-3">
              <div className="prova-panel-muted rounded-[22px] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">Flagged</p>
                <p className="font-display prova-metric-value mt-2 text-[2.2rem] leading-none text-white">
                  {data?.summary.flaggedCount ?? 0}
                </p>
              </div>
              <div className="prova-panel-muted rounded-[22px] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">Pending</p>
                <p className="font-display prova-metric-value mt-2 text-[2.2rem] leading-none text-white">
                  {data?.summary.pendingCount ?? 0}
                </p>
              </div>
              <div className="prova-panel-muted rounded-[22px] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">Approved</p>
                <p className="font-display prova-metric-value mt-2 text-[2.2rem] leading-none text-white">
                  {data?.summary.approvedCount ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isError ? (
        <div className="rounded-[22px] border border-[#ba1a1a]/30 bg-[#311311]/70 px-4 py-3 text-sm text-[#ffb4ab]">
          Verification queue failed to load: {error.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="prova-panel overflow-hidden rounded-[32px]">
          <div className="border-b border-white/8 px-5 py-5">
            <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Review queue</p>
            <h2 className="mt-2 font-display text-[2rem] tracking-[-0.05em] text-white">Queue</h2>
          </div>

          {isLoading ? (
            <div className="px-5 py-10 text-sm text-[#d9ccb8]">Loading queue...</div>
          ) : !queue.length ? (
            <div className="px-5 py-10 text-sm text-[#d9ccb8]">No live cases.</div>
          ) : (
            <div className="flex flex-col gap-3 p-4">
              {queue.map((item) => (
                <button
                  key={item.id}
                  className={`rounded-[24px] border p-4 text-left transition-all ${
                    item.id === selected?.id
                      ? 'border-[#ffbf73]/26 bg-[linear-gradient(135deg,rgba(255,179,83,0.14),rgba(255,255,255,0.04))]'
                      : 'border-white/8 bg-white/[0.03] hover:bg-white/[0.045]'
                  }`}
                  onClick={() => setSelectedId(item.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{item.fullName}</p>
                      <p className="mt-1 truncate text-xs text-[#998a76]">Ref {item.referenceId}</p>
                    </div>
                    <span className="shrink-0 text-xs text-[#998a76]">{formatRelativeTime(item.submittedAt)}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={statusTone(item.status)}>{item.status}</span>
                    <span className="prova-chip">Risk {item.riskScore === null ? '--' : Math.round(item.riskScore)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="prova-panel overflow-hidden rounded-[32px]">
          {!selected ? (
            <div className="px-6 py-12 text-sm text-[#d9ccb8]">Select a case.</div>
          ) : (
            <>
              <div className="border-b border-white/8 px-6 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className={statusTone(selected.status)}>{selected.status}</span>
                      <span className="prova-chip">Provider {selected.providerMode}</span>
                      <span className="prova-chip">Ref {selected.referenceId}</span>
                    </div>
                    <h2 className="mt-4 font-display text-[2.4rem] tracking-[-0.05em] text-white">{selected.fullName}</h2>
                    <p className="mt-2 truncate text-sm text-[#d9ccb8]">{selected.programName} - {selected.organizationName}</p>
                  </div>
                  <div className="prova-panel-soft flex h-[150px] w-[150px] shrink-0 flex-col items-center justify-center rounded-full text-center">
                    <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Trust score</p>
                    <p className="font-display prova-metric-value mt-3 text-[3rem] leading-none text-white">{Math.round(trustScore)}</p>
                    <p className="mt-2 text-xs text-[#d9ccb8]">100 - risk</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="grid gap-6">
                  <div className="grid gap-6 xl:grid-cols-2">
                    <article className="prova-panel-soft rounded-[28px] p-5">
                      <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Document</p>
                      <div className="mt-4 grid gap-3 text-sm text-[#efe2cf]">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#998a76]">Type</span>
                          <span className="text-right text-white">{selected.programType}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#998a76]">Doc score</span>
                          <span className="text-right text-white">{selected.documentScore ?? '--'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#998a76]">Bank code</span>
                          <span className="text-right text-white">{selected.bankCode}</span>
                        </div>
                      </div>
                      <div className="mt-5">
                        <span className={selected.hasDocument ? 'prova-chip-success' : 'prova-chip-danger'}>
                          {selected.hasDocument ? 'Attached' : 'Missing'}
                        </span>
                      </div>
                    </article>

                    <article className="prova-panel-soft rounded-[28px] p-5">
                      <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Selfie and account</p>
                      <div className="mt-4 grid gap-3 text-sm text-[#efe2cf]">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#998a76]">Holder</span>
                          <span className="text-right text-white">{selected.accountName ?? 'Pending lookup'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#998a76]">Acct</span>
                          <span className="text-right text-white">**** {selected.accountNumberLast4}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[#998a76]">Liveness</span>
                          <span className="text-right text-white">{selected.livenessScore ?? '--'}</span>
                        </div>
                      </div>
                      <div className="mt-5">
                        <span className={selected.hasSelfie ? 'prova-chip-success' : 'prova-chip-danger'}>
                          {selected.hasSelfie ? 'Attached' : 'Missing'}
                        </span>
                      </div>
                    </article>
                  </div>

                  <article className="prova-panel-soft rounded-[28px] p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Cpu className="h-4.5 w-4.5 text-[#ffd59f]" />
                      <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Signals</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {signalRows.map((metric) => {
                        const value = selected[metric.key] ?? 0

                        return (
                          <div key={metric.label} className="prova-panel-muted rounded-[22px] px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">{metric.label}</p>
                            <p className="font-display prova-metric-value mt-3 text-[2rem] leading-none text-white">{Math.round(value)}</p>
                            <div className="mt-4 h-2 rounded-full bg-white/8">
                              <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,#ffb357,#ffd59f)]"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </article>
                </div>

                <div className="grid gap-6">
                  <article className="prova-panel-soft rounded-[28px] p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Braces className="h-4.5 w-4.5 text-[#ffd59f]" />
                      <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Reason codes</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selected.reasonCodes.length ? (
                        selected.reasonCodes.map((reasonCode) => (
                          <span key={reasonCode} className="prova-chip">
                            {labelForReason(reasonCode)}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-[#d9ccb8]">No flags</p>
                      )}
                    </div>
                  </article>

                  <article className="prova-panel-soft rounded-[28px] p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-4.5 w-4.5 text-[#ffd59f]" />
                      <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Action</p>
                    </div>
                    <textarea
                      rows={5}
                      className="prova-input w-full resize-none px-4 py-3 text-sm"
                      onChange={(event) =>
                        selected
                          ? setNoteById((current) => ({ ...current, [selected.id]: event.target.value }))
                          : undefined
                      }
                      placeholder="Decision note"
                      value={notes}
                    />
                    <div className="mt-4 grid gap-3">
                      <button
                        className="prova-button-secondary px-5 py-3 text-sm font-bold disabled:opacity-50"
                        disabled={!selected || !notes.trim() || reviewMutation.isPending}
                        onClick={() => handleAction('review')}
                        type="button"
                      >
                        <Pause className="h-4 w-4" />
                        Hold
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ba1a1a]/28 bg-[#4c1717]/75 px-5 py-3 text-sm font-bold text-[#ffb4ab] disabled:opacity-50"
                        disabled={!selected || !notes.trim() || reviewMutation.isPending}
                        onClick={() => handleAction('reject')}
                        type="button"
                      >
                        <Ban className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        className="prova-button-primary px-5 py-3 text-sm font-bold disabled:opacity-50"
                        disabled={!selected || !notes.trim() || reviewMutation.isPending}
                        onClick={() => handleAction('approve')}
                        type="button"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                    </div>
                  </article>
                </div>
              </div>

              {reviewMutation.isError ? (
                <div className="border-t border-white/8 px-6 py-4 text-sm text-[#ffb4ab]">
                  Review action failed: {reviewMutation.error.message}
                </div>
              ) : null}

              {reviewMutation.isSuccess ? (
                <div className="border-t border-white/8 px-6 py-4 text-sm text-[#94f0bc]">Decision saved.</div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </>
  )
}
