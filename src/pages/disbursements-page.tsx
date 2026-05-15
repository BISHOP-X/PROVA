import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, CheckCircle2, Download, Filter, Plus, RefreshCw, Wallet } from 'lucide-react';
import { getDisbursementDashboard, releaseApprovedPayouts } from '@/lib/api';

function formatCurrency(value: number, currency = 'NGN') {
  return new Intl.NumberFormat('en-US', {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Awaiting update';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

function statusTone(status: string) {
  if (status === 'successful' || status === 'completed') {
    return 'bg-green-100 text-green-800';
  }

  if (status === 'failed') {
    return 'bg-[#ffdad6] text-[#ba1a1a]';
  }

  if (status === 'processing' || status === 'queued') {
    return 'bg-[#d8e2ff] text-[#0058bd]';
  }

  return 'bg-[#ffdcc4] text-[#8f4a00]';
}

export function DisbursementsPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['disbursement-dashboard'],
    queryFn: getDisbursementDashboard,
  });

  const releaseMutation = useMutation({
    mutationFn: (beneficiaryIds?: string[]) => releaseApprovedPayouts({ beneficiaryIds }),
    onSuccess: async () => {
      setSelectedIds([]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['disbursement-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['beneficiaries'] }),
        queryClient.invalidateQueries({ queryKey: ['beneficiary-status'] }),
        queryClient.invalidateQueries({ queryKey: ['audit-events'] }),
      ]);
    },
  });

  const readyItems = data?.readyItems ?? [];
  const allSelected = readyItems.length > 0 && selectedIds.length === readyItems.length;

  function toggleSelection(beneficiaryId: string) {
    setSelectedIds((current) =>
      current.includes(beneficiaryId)
        ? current.filter((id) => id !== beneficiaryId)
        : [...current, beneficiaryId],
    );
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : readyItems.map((item) => item.beneficiaryId));
  }

  function handleRelease() {
    const idsToRelease = selectedIds.length ? selectedIds : readyItems.map((item) => item.beneficiaryId);

    if (!idsToRelease.length) {
      return;
    }

    releaseMutation.mutate(idsToRelease);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-medium leading-7 text-[#191b22]">Disbursement Management</h1>
            <p className="text-[14px] text-[#424753] mt-1">Release approved beneficiaries through Squad-compatible rails and monitor settlement states.</p>
          </div>
          <button
            className="flex items-center gap-2 bg-[#0058bd] text-white px-5 py-2.5 rounded-lg font-bold text-[12px] tracking-[0.05em] hover:opacity-90 transition-opacity self-start sm:self-auto disabled:opacity-50"
            disabled={!readyItems.length || releaseMutation.isPending}
            onClick={handleRelease}
            type="button"
          >
            <Plus className="w-4 h-4" />
            {releaseMutation.isPending ? 'Releasing...' : selectedIds.length ? `Release Selected (${selectedIds.length})` : 'Release Approved'}
          </button>
        </div>

        {isError ? (
          <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3 text-[14px] text-[#93000a]">
            Disbursement dashboard failed to load: {error.message}
          </div>
        ) : null}

        {releaseMutation.isError ? (
          <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3 text-[14px] text-[#93000a]">
            Payout release failed: {releaseMutation.error.message}
          </div>
        ) : null}

        {releaseMutation.isSuccess ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-800">
            Released {releaseMutation.data.summary.processedCount} payout(s). Successful: {releaseMutation.data.summary.successfulCount}, processing: {releaseMutation.data.summary.processingCount + releaseMutation.data.summary.queuedCount}, failed: {releaseMutation.data.summary.failedCount}.
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-[#0058bd] text-white rounded-xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10" />
          <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-[0.08em]">
              <Wallet className="w-5 h-5" />
              SQUAD POOL BALANCE
            </div>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/20 rounded text-[11px] font-bold capitalize">
              <RefreshCw className="w-3 h-3" /> {data?.providerMode ?? 'mock'}
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-[12px] text-white/70 mb-1 font-mono">{data?.balance.currency ?? 'NGN'}</p>
            <p className="text-[32px] font-bold leading-10 tracking-tight">{formatCurrency(data?.balance.amount ?? 0, data?.balance.currency ?? 'NGN')}</p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="px-2 py-1 bg-white/20 rounded text-[11px] font-mono font-bold">Rail: {data?.balance.mode ?? 'mock'}</span>
              <span className="text-[12px] text-white/70">Updated: {formatTimestamp(data?.balance.lastUpdatedAt ?? null)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <h2 className="text-[20px] font-medium leading-7 text-[#191b22] mb-5">Active Batches</h2>
          {isLoading ? (
            <div className="rounded-lg border border-dashed border-[#c2c6d5] bg-[#f9f9ff] px-4 py-8 text-center text-[14px] text-[#424753]">
              Loading payout batches from Supabase...
            </div>
          ) : null}

          {!isLoading && !(data?.activeBatches.length) ? (
            <div className="rounded-lg border border-dashed border-[#c2c6d5] bg-[#f9f9ff] px-4 py-8 text-center text-[14px] text-[#424753]">
              No active payout batches exist yet. Release approved beneficiaries to create the first live batch.
            </div>
          ) : null}

          <div className="flex flex-col gap-4">
            {data?.activeBatches.map((batch) => (
              <div key={batch.id} className="bg-[#f9f9ff] rounded-lg border border-[#c2c6d5] p-5 hover:border-[#0058bd] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-[#d8e2ff] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-[#0058bd]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#424753] tracking-wider">BATCH ID: {batch.id.slice(0, 8)}</p>
                      <p className="text-[16px] font-bold text-[#191b22] leading-6">{batch.batchName}</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-mono text-[18px] font-bold text-[#191b22]">{formatCurrency(batch.totalAmount)}</p>
                    <p className="text-[12px] text-[#424753]">{batch.beneficiaryCount} Beneficiaries</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className={`font-bold capitalize ${batch.status === 'failed' ? 'text-[#ba1a1a]' : batch.status === 'processing' ? 'text-[#0058bd]' : 'text-[#8f4a00]'}`}>{batch.status}</span>
                      <span className="text-[#424753]">{batch.releasedCount} successful · {batch.failedCount} failed</span>
                    </div>
                    <div className="h-2 w-full bg-[#e7e7f1] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0058bd] rounded-full" style={{ width: `${batch.beneficiaryCount ? (batch.releasedCount / batch.beneficiaryCount) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <span className="text-[12px] text-[#424753] shrink-0">Updated {formatTimestamp(batch.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#c2c6d5] flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-medium leading-7 text-[#191b22]">Ready for Release</h2>
            <p className="text-[13px] text-[#424753] mt-1">{data?.summary.readyCount ?? 0} approved beneficiaries are eligible for payout release.</p>
          </div>
          <label className="inline-flex items-center gap-2 text-[12px] font-bold text-[#191b22]">
            <input checked={allSelected} className="h-4 w-4 accent-[#0058bd]" onChange={toggleAll} type="checkbox" />
            Select all
          </label>
        </div>

        {!readyItems.length ? (
          <div className="px-6 py-8 text-center text-[14px] text-[#424753] bg-[#f9f9ff]">
            No approved beneficiaries are waiting for release right now.
          </div>
        ) : (
          <div className="divide-y divide-[#c2c6d5]">
            {readyItems.map((item) => (
              <label className="flex items-center gap-4 px-6 py-4 hover:bg-[#f9f9ff]" key={item.beneficiaryId}>
                <input checked={selectedIds.includes(item.beneficiaryId)} className="h-4 w-4 accent-[#0058bd]" onChange={() => toggleSelection(item.beneficiaryId)} type="checkbox" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-bold text-[14px] text-[#191b22]">{item.fullName}</p>
                      <p className="text-[12px] text-[#424753]">{item.programName} · {item.organizationName}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-mono font-bold text-[14px] text-[#191b22]">{formatCurrency(item.amount ?? 0)}</p>
                      <p className="text-[12px] text-[#424753]">Acct •••• {item.accountNumberLast4}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="rounded-full bg-[#d8e2ff] px-2.5 py-1 text-[11px] font-bold text-[#0058bd]">REF {item.referenceId}</span>
                    <span className="rounded-full bg-[#f2f3fd] px-2.5 py-1 text-[11px] font-bold text-[#424753]">Bank {item.bankCode}</span>
                    <span className="rounded-full bg-[#ffdcc4] px-2.5 py-1 text-[11px] font-bold text-[#8f4a00]">Risk {Math.round(item.riskScore ?? 0)}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#c2c6d5] flex items-center justify-between">
          <h2 className="text-[20px] font-medium leading-7 text-[#191b22]">Recent Payout Activity</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-[#c2c6d5] hover:bg-[#f2f3fd] transition-colors" type="button">
              <Filter className="w-4 h-4 text-[#424753]" />
            </button>
            <button className="p-2 rounded-lg border border-[#c2c6d5] hover:bg-[#f2f3fd] transition-colors" type="button">
              <Download className="w-4 h-4 text-[#424753]" />
            </button>
          </div>
        </div>

        {!data?.recentPayouts.length ? (
          <div className="px-6 py-8 text-center text-[14px] text-[#424753] bg-[#f9f9ff]">
            No payout history exists yet. Release approved beneficiaries to start the ledger.
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f2f3fd] border-b border-[#c2c6d5]">
                    {['Batch / Beneficiary', 'Updated', 'Amount', 'Rail Status', 'Reference'].map((heading) => (
                      <th className="px-6 py-4 text-[12px] font-bold tracking-[0.05em] text-[#424753] uppercase" key={heading}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c2c6d5]">
                  {data.recentPayouts.map((payout) => (
                    <tr className="hover:bg-[#f9f9ff] transition-colors" key={payout.id}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[14px] text-[#191b22]">{payout.fullName}</p>
                        <p className="text-[11px] text-[#424753]">{payout.batchName}</p>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#424753]">{formatTimestamp(payout.updatedAt)}</td>
                      <td className="px-6 py-4 font-mono font-bold text-[14px] text-[#191b22]">{formatCurrency(payout.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold capitalize ${statusTone(payout.squadStatus)}`}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> {payout.squadStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-[#424753]">{payout.transactionReference ?? 'Pending reference'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-[#c2c6d5]">
              {data.recentPayouts.map((payout) => (
                <div className="px-4 py-4" key={payout.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[14px] text-[#191b22]">{payout.fullName}</p>
                      <p className="text-[11px] text-[#424753] mt-0.5">{payout.batchName}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize shrink-0 ${statusTone(payout.squadStatus)}`}>
                      <CheckCircle2 className="w-3 h-3" /> {payout.squadStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[12px] text-[#424753]">{formatTimestamp(payout.updatedAt)}</span>
                    <span className="font-mono font-bold text-[14px] text-[#191b22]">{formatCurrency(payout.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
