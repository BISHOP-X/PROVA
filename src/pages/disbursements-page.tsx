import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowUpRight, CheckCircle2, Download, Filter, Plus, RefreshCw } from 'lucide-react'
import { getDisbursementDashboard, releaseApprovedPayouts } from '@/lib/api'

function formatCurrency(value: number, currency = 'NGN') {
  return new Intl.NumberFormat('en-US', {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Awaiting update'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
  }).format(new Date(value))
}

function statusTone(status: string) {
  if (status === 'successful' || status === 'completed') {
    return 'prova-chip-success'
  }

  if (status === 'failed') {
    return 'prova-chip-danger'
  }

  if (status === 'processing' || status === 'queued') {
    return 'prova-chip-info'
  }

  return 'prova-chip-warm'
}

export function DisbursementsPage() {
  const queryClient = useQueryClient()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['disbursement-dashboard'],
    queryFn: getDisbursementDashboard,
  })

  const releaseMutation = useMutation({
    mutationFn: (beneficiaryIds?: string[]) => releaseApprovedPayouts({ beneficiaryIds }),
    onSuccess: async () => {
      setSelectedIds([])
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['disbursement-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['beneficiaries'] }),
        queryClient.invalidateQueries({ queryKey: ['beneficiary-status'] }),
        queryClient.invalidateQueries({ queryKey: ['audit-events'] }),
      ])
    },
  })

  const readyItems = data?.readyItems ?? []
  const allSelected = readyItems.length > 0 && selectedIds.length === readyItems.length

  function toggleSelection(beneficiaryId: string) {
    setSelectedIds((current) =>
      current.includes(beneficiaryId)
        ? current.filter((id) => id !== beneficiaryId)
        : [...current, beneficiaryId],
    )
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : readyItems.map((item) => item.beneficiaryId))
  }

  function handleRelease() {
    const idsToRelease = selectedIds.length ? selectedIds : readyItems.map((item) => item.beneficiaryId)

    if (!idsToRelease.length) {
      return
    }

    releaseMutation.mutate(idsToRelease)
  }

  return (
    <>
      <section className="prova-panel prova-hero-panel rounded-[32px] p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
          <div className="relative z-10">
            <div className="prova-kicker w-fit">Squad payout rail</div>
            <h1 className="font-display prova-metric-value mt-5 text-[2.5rem] leading-[0.94] tracking-[-0.06em] text-white md:text-[4rem]">
              Payout Rail
            </h1>
            <p className="mt-4 max-w-[520px] text-sm text-[#d9ccb8]">Release approved cases and track live rail status.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="prova-chip-info">Provider {data?.providerMode ?? 'mock'}</span>
              <span className="prova-chip">Ready now {data?.summary.readyCount ?? 0}</span>
              <span className="prova-chip-success">Completed {data?.summary.completedCount ?? 0}</span>
            </div>
          </div>

          <div className="prova-panel-soft relative z-10 rounded-[28px] p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Live balance</p>
                <p className="mt-2 font-display prova-metric-value text-[2.7rem] leading-none text-white">
                  {formatCurrency(data?.balance.amount ?? 0, data?.balance.currency ?? 'NGN')}
                </p>
              </div>
              <span className="prova-chip-warm capitalize">
                <RefreshCw className="h-3.5 w-3.5" />
                {data?.balance.mode ?? 'mock'}
              </span>
            </div>
            <div className="space-y-3">
              <div className="prova-panel-muted rounded-[20px] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">Updated</p>
                <p className="mt-1 text-sm text-[#efe2cf]">{formatTimestamp(data?.balance.lastUpdatedAt ?? null)}</p>
              </div>
              <div className="prova-panel-muted rounded-[20px] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">Rail note</p>
                <p className="mt-1 text-sm text-[#efe2cf]">{data?.balance.message ?? 'No balance update yet.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <span className="prova-chip">Ready amount {formatCurrency(data?.summary.totalReadyAmount ?? 0)}</span>
            <span className="prova-chip-warm">Processing {data?.summary.processingCount ?? 0}</span>
          </div>
          <button
            className="prova-button-primary self-start px-5 py-3 text-sm font-bold disabled:opacity-50"
            disabled={!readyItems.length || releaseMutation.isPending}
            onClick={handleRelease}
            type="button"
          >
            <Plus className="h-4 w-4" />
            {releaseMutation.isPending ? 'Releasing...' : selectedIds.length ? `Release selected (${selectedIds.length})` : 'Release approved'}
          </button>
        </div>

        {isError ? (
          <div className="rounded-[22px] border border-[#ba1a1a]/30 bg-[#311311]/70 px-4 py-3 text-sm text-[#ffb4ab]">
            Disbursement dashboard failed to load: {error.message}
          </div>
        ) : null}

        {releaseMutation.isError ? (
          <div className="rounded-[22px] border border-[#ba1a1a]/30 bg-[#311311]/70 px-4 py-3 text-sm text-[#ffb4ab]">
            Payout release failed: {releaseMutation.error.message}
          </div>
        ) : null}

        {releaseMutation.isSuccess ? (
          <div className="rounded-[22px] border border-[#136e39]/30 bg-[#11251a]/80 px-4 py-3 text-sm text-[#94f0bc]">
            Released {releaseMutation.data.summary.processedCount} payout(s). Successful: {releaseMutation.data.summary.successfulCount}, processing: {releaseMutation.data.summary.processingCount + releaseMutation.data.summary.queuedCount}, failed: {releaseMutation.data.summary.failedCount}.
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="prova-panel rounded-[32px] overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/8 px-6 py-5">
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Ready for release</p>
              <h2 className="mt-2 font-display text-[2rem] tracking-[-0.05em] text-white">Ready cases</h2>
            </div>
            <label className="prova-chip text-xs">
              <input checked={allSelected} className="accent-[#ffb357]" onChange={toggleAll} type="checkbox" />
              Select all
            </label>
          </div>

          {!readyItems.length ? (
            <div className="px-6 py-10 text-sm text-[#d9ccb8]">
              No approved beneficiaries are waiting for release right now.
            </div>
          ) : (
            <div className="divide-y divide-white/8">
              {readyItems.map((item) => (
                <label key={item.beneficiaryId} className="flex cursor-pointer gap-4 px-6 py-5 hover:bg-white/[0.025]">
                  <input
                    checked={selectedIds.includes(item.beneficiaryId)}
                    className="mt-1 accent-[#ffb357]"
                    onChange={() => toggleSelection(item.beneficiaryId)}
                    type="checkbox"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.fullName}</p>
                        <p className="text-xs text-[#998a76]">{item.programName} - {item.organizationName}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-display prova-metric-value text-[1.8rem] leading-none text-white">
                          {formatCurrency(item.amount ?? 0)}
                        </p>
                        <p className="mt-1 text-xs text-[#998a76]">Acct **** {item.accountNumberLast4}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="prova-chip-info">Ref {item.referenceId}</span>
                      <span className="prova-chip">Bank {item.bankCode}</span>
                      <span className="prova-chip-warm">Risk {Math.round(item.riskScore ?? 0)}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="prova-panel rounded-[32px] overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/8 px-6 py-5">
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Payout evidence</p>
              <h2 className="mt-2 font-display text-[2rem] tracking-[-0.05em] text-white">Recent activity</h2>
            </div>
            <div className="flex gap-2">
              <button className="prova-button-secondary h-10 w-10 p-0" type="button">
                <Filter className="h-4 w-4" />
              </button>
              <button className="prova-button-secondary h-10 w-10 p-0" type="button">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!data?.recentPayouts.length ? (
            <div className="px-6 py-10 text-sm text-[#d9ccb8]">
              No payout history exists yet. Release approved beneficiaries to start the ledger.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="prova-table min-w-[760px] text-left">
                <thead>
                  <tr>
                    <th className="px-6 py-4">Beneficiary</th>
                    <th className="px-6 py-4">Updated</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentPayouts.map((payout) => (
                    <tr key={payout.id}>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-white">{payout.fullName}</p>
                        <p className="mt-1 text-xs text-[#998a76]">{payout.batchName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#d9ccb8]">{formatTimestamp(payout.updatedAt)}</td>
                      <td className="px-6 py-4 font-display prova-metric-value text-[1.5rem] text-white">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={statusTone(payout.squadStatus)}>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {payout.squadStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="prova-panel-muted flex items-center justify-between gap-3 rounded-[18px] px-3 py-2">
                          <span className="truncate font-mono text-[11px] text-[#d9ccb8]">
                            {payout.transactionReference ?? 'Pending reference'}
                          </span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#ffd59f]" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <section className="prova-panel rounded-[32px] overflow-hidden">
        <div className="border-b border-white/8 px-6 py-5">
          <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Active payout batches</p>
          <h2 className="mt-2 font-display text-[2rem] tracking-[-0.05em] text-white">Active batches</h2>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-sm text-[#d9ccb8]">Loading payout batches from Supabase...</div>
        ) : !data?.activeBatches.length ? (
          <div className="px-6 py-10 text-sm text-[#d9ccb8]">No active payout batches exist yet.</div>
        ) : (
          <div className="grid gap-4 p-6 md:grid-cols-2">
            {data.activeBatches.map((batch) => (
              <article key={batch.id} className="prova-panel-soft rounded-[28px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">
                      Batch {batch.id.slice(0, 8)}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">{batch.batchName}</p>
                  </div>
                  <span className={statusTone(batch.status)}>{batch.status}</span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display prova-metric-value text-[2.2rem] leading-none text-white">
                      {formatCurrency(batch.totalAmount)}
                    </p>
                    <p className="mt-2 text-sm text-[#d9ccb8]">{batch.beneficiaryCount} beneficiaries - {batch.releasedCount} successful</p>
                  </div>
                  <p className="text-xs text-[#998a76]">Updated {formatTimestamp(batch.updatedAt)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
