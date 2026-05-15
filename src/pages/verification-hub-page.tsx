import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ArrowLeftRight, Ban, Braces, CheckCircle, Cpu, Filter, Info, Pause } from 'lucide-react';
import { getVerificationQueue, reviewBeneficiary, type ReviewAction } from '@/lib/api';

function statusTone(status: string) {
  if (status === 'approved') {
    return 'bg-green-100 text-green-800 border-green-200';
  }

  if (status === 'review') {
    return 'bg-[#ffdcc4] text-[#8f4a00] border-[#8f4a00]/20';
  }

  if (status === 'rejected') {
    return 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20';
  }

  if (status === 'pending' || status === 'submitted') {
    return 'bg-[#d8e2ff] text-[#0058bd] border-[#0058bd]/20';
  }

  return 'bg-[#e7e7f1] text-[#424753] border-[#c2c6d5]';
}

function formatRelativeTime(value: string) {
  const createdAt = new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.round((Date.now() - createdAt) / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return `${Math.round(diffHours / 24)}d ago`;
}

function labelForReason(reasonCode: string) {
  return reasonCode.replaceAll('_', ' ');
}

export function VerificationHubPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string>('');
  const [noteById, setNoteById] = useState<Record<string, string>>({});
  const [mobileView, setMobileView] = useState<'queue' | 'detail'>('queue');
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['verification-queue'],
    queryFn: getVerificationQueue,
  });

  const reviewMutation = useMutation({
    mutationFn: (payload: { action: ReviewAction; beneficiaryId: string; notes: string }) => reviewBeneficiary(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['verification-queue'] }),
        queryClient.invalidateQueries({ queryKey: ['beneficiaries'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['disbursement-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['audit-events'] }),
      ]);
    },
  });

  const queue = data?.queue ?? [];
  const effectiveSelectedId = selectedId || queue[0]?.id || '';
  const selected = queue.find((item) => item.id === effectiveSelectedId) ?? null;
  const notes = selected ? (noteById[selected.id] ?? selected.reviewNotes ?? '') : '';
  const trustScore = selected?.riskScore === null || selected?.riskScore === undefined ? 0 : Math.max(0, 100 - selected.riskScore);
  const trustDashOffset = 289 - (Math.max(0, Math.min(trustScore, 100)) / 100) * 289;

  function handleAction(action: ReviewAction) {
    if (!selected || !notes.trim()) {
      return;
    }

    reviewMutation.mutate({
      action,
      beneficiaryId: selected.id,
      notes: notes.trim(),
    });
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-medium leading-7 text-[#191b22]">Verification Command Center</h1>
            <p className="text-[14px] text-[#424753] mt-1">Review live trust outcomes, override flagged cases, and prepare approved beneficiaries for payout release.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#ffdcc4] px-3 py-1 text-[11px] font-bold text-[#8f4a00]">Flagged: {data?.summary.flaggedCount ?? 0}</span>
            <span className="rounded-full bg-[#d8e2ff] px-3 py-1 text-[11px] font-bold text-[#0058bd]">Pending: {data?.summary.pendingCount ?? 0}</span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-800">Approved: {data?.summary.approvedCount ?? 0}</span>
          </div>
        </div>

        {isError ? (
          <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3 text-[14px] text-[#93000a]">
            Verification queue failed to load: {error.message}
          </div>
        ) : null}
      </div>

      <div className="md:hidden flex rounded-lg border border-[#c2c6d5] overflow-hidden">
        <button
          onClick={() => setMobileView('queue')}
          className={`flex-1 py-2.5 text-[13px] font-bold transition-colors ${mobileView === 'queue' ? 'bg-[#0058bd] text-white' : 'bg-white text-[#424753]'}`}
        >
          Queue ({queue.length})
        </button>
        <button
          onClick={() => setMobileView('detail')}
          className={`flex-1 py-2.5 text-[13px] font-bold transition-colors ${mobileView === 'detail' ? 'bg-[#0058bd] text-white' : 'bg-white text-[#424753]'}`}
        >
          Detail View
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:h-[calc(100vh-11rem)] md:overflow-hidden">
        <div className={`${mobileView === 'queue' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[320px] lg:w-[360px] bg-white rounded-xl border border-[#c2c6d5] shadow-[0_1px_3px_rgba(0,0,0,0.12)] overflow-hidden shrink-0`}>
          <div className="px-4 py-4 border-b border-[#c2c6d5] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-bold text-[#191b22]">Review Queue</h2>
              <span className="bg-[#ffdad6] text-[#ba1a1a] text-[11px] px-2 py-0.5 rounded-full font-bold">{data?.summary.flaggedCount ?? 0}</span>
            </div>
            <button className="text-[#424753] hover:text-[#0058bd] transition-colors" type="button">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex-1 grid place-items-center p-6 text-[14px] text-[#424753] bg-[#f9f9ff]">
              Loading live verification queue...
            </div>
          ) : null}

          {!isLoading && !queue.length ? (
            <div className="flex-1 grid place-items-center p-6 text-center text-[14px] text-[#424753] bg-[#f9f9ff]">
              No live verification cases exist yet. Create a beneficiary submission to populate the queue.
            </div>
          ) : null}

          {!isLoading && queue.length ? (
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {queue.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedId(item.id); setMobileView('detail'); }}
                  className={`text-left w-full rounded-lg p-4 transition-all border ${
                    item.id === selected?.id
                      ? 'bg-[#d8e2ff]/40 border-l-4 border-l-[#0058bd] border-t-transparent border-r-transparent border-b-transparent'
                      : 'bg-[#f9f9ff] border-[#c2c6d5] hover:border-[#0058bd]'
                  }`}
                  type="button"
                >
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <div>
                      <p className="font-bold text-[14px] text-[#191b22]">{item.fullName}</p>
                      <p className="font-mono text-[11px] text-[#424753] mt-0.5">REF: {item.referenceId}</p>
                    </div>
                    <span className="text-[11px] text-[#424753] font-mono shrink-0">{formatRelativeTime(item.submittedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${statusTone(item.status)}`}>
                      <AlertTriangle className="w-3 h-3" />
                      {item.status}
                    </span>
                    <span className="text-[11px] text-[#424753]">{item.programName}</span>
                    <span className="ml-auto text-[11px] font-bold text-[#191b22]">
                      {item.riskScore === null ? '--' : `Risk ${Math.round(item.riskScore)}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className={`${mobileView === 'detail' ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-white rounded-xl border border-[#c2c6d5] shadow-[0_1px_3px_rgba(0,0,0,0.12)] overflow-hidden min-w-0`}>
          {!selected ? (
            <div className="flex-1 grid place-items-center p-8 text-center bg-[#f9f9ff] text-[#424753]">
              Select a queue item to inspect its verification evidence and decision path.
            </div>
          ) : (
            <>
              <div className="px-6 py-5 border-b border-[#c2c6d5] bg-[#f9f9ff] flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider border ${statusTone(selected.status)}`}>
                      {selected.status}
                    </span>
                    <span className="text-[#424753] font-mono text-[11px]">Application: {selected.referenceId}</span>
                    <span className="text-[#424753] font-mono text-[11px]">Provider: {selected.providerMode}</span>
                  </div>
                  <h2 className="text-[24px] font-bold tracking-tight text-[#191b22]">{selected.fullName}</h2>
                  <p className="text-[14px] text-[#424753] mt-0.5">
                    {selected.programName} · {selected.organizationName}
                  </p>
                </div>
                <div className="text-center shrink-0">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="#e7e7f1" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke={trustScore >= 70 ? '#0f9d58' : trustScore >= 50 ? '#8f4a00' : '#ba1a1a'}
                        strokeWidth="8"
                        strokeDasharray="289"
                        strokeDashoffset={trustDashOffset}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <span className="text-[18px] font-bold text-[#191b22] relative z-10">{Math.round(trustScore)}</span>
                  </div>
                  <p className="text-[10px] font-bold text-[#424753] uppercase tracking-wider mt-1">Trust Score</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-[#f9f9ff]">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 bg-white rounded-xl border border-[#c2c6d5] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#c2c6d5] flex items-center gap-2">
                      <ArrowLeftRight className="w-5 h-5 text-[#8f4a00]" />
                      <h3 className="font-bold text-[14px] text-[#191b22]">Evidence Comparison</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="rounded-lg border border-[#c2c6d5] bg-[#f2f3fd] p-5">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-bold text-[#424753] uppercase tracking-wider">Document Evidence</span>
                          <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${selected.hasDocument ? 'bg-green-100 text-green-800 border-green-200' : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20'}`}>
                            {selected.hasDocument ? 'Attached' : 'Missing'}
                          </span>
                        </div>
                        <div className="rounded-lg bg-white border border-[#c2c6d5] p-4 text-[13px] text-[#424753] leading-relaxed">
                          Program type: <strong className="text-[#191b22]">{selected.programType}</strong><br />
                          Document score: <strong className="text-[#191b22]">{selected.documentScore ?? '--'}</strong><br />
                          Bank routing code: <strong className="text-[#191b22]">{selected.bankCode}</strong>
                        </div>
                      </div>

                      <div className="rounded-lg border border-[#c2c6d5] bg-[#f2f3fd] p-5">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-bold text-[#424753] uppercase tracking-wider">Selfie / Liveness</span>
                          <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${selected.hasSelfie ? 'bg-green-100 text-green-800 border-green-200' : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20'}`}>
                            {selected.hasSelfie ? 'Attached' : 'Missing'}
                          </span>
                        </div>
                        <div className="rounded-lg bg-white border border-[#c2c6d5] p-4 text-[13px] text-[#424753] leading-relaxed">
                          Account holder: <strong className="text-[#191b22]">{selected.accountName ?? 'Pending lookup'}</strong><br />
                          Account ending: <strong className="text-[#191b22]">•••• {selected.accountNumberLast4}</strong><br />
                          Liveness score: <strong className="text-[#191b22]">{selected.livenessScore ?? '--'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-1 flex flex-col gap-5">
                    <div className="bg-white rounded-xl border border-[#c2c6d5] p-5">
                      <h3 className="font-bold text-[14px] text-[#191b22] border-b border-[#c2c6d5] pb-3 mb-4 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#0058bd]" /> AI Analysis
                      </h3>
                      {[
                        { label: 'Face Match', value: selected.faceMatchScore ?? 0, tone: 'bg-[#0058bd]', textTone: 'text-[#0058bd]' },
                        { label: 'Document Scan', value: selected.documentScore ?? 0, tone: 'bg-[#8f4a00]', textTone: 'text-[#8f4a00]' },
                        { label: 'Liveness', value: selected.livenessScore ?? 0, tone: 'bg-[#0f9d58]', textTone: 'text-[#0f9d58]' },
                      ].map((metric) => (
                        <div key={metric.label} className="mb-3">
                          <div className="flex justify-between text-[13px] mb-1">
                            <span className="text-[#424753]">{metric.label}</span>
                            <span className={`font-mono font-bold ${metric.textTone}`}>{Math.round(metric.value)}%</span>
                          </div>
                          <div className="h-2 bg-[#e7e7f1] rounded-full overflow-hidden">
                            <div className={`h-full ${metric.tone} rounded-full`} style={{ width: `${metric.value}%` }} />
                          </div>
                        </div>
                      ))}
                      <div className="p-3 bg-[#f9f9ff] border border-[#c2c6d5] rounded-lg mt-1">
                        <p className="text-[12px] text-[#424753] leading-relaxed">
                          Latest decision: <strong className="text-[#191b22] capitalize">{selected.decision ?? selected.status}</strong>.<br />
                          Risk score: <strong className="text-[#191b22]">{selected.riskScore ?? '--'}</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-[#c2c6d5] p-5">
                      <h3 className="font-bold text-[14px] text-[#191b22] border-b border-[#c2c6d5] pb-3 mb-4 flex items-center gap-2">
                        <Braces className="w-4 h-4 text-[#8f4a00]" /> Reason Codes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selected.reasonCodes.length ? selected.reasonCodes.map((reasonCode) => (
                          <span className="rounded-full border border-[#c2c6d5] bg-[#f2f3fd] px-3 py-1 text-[11px] font-bold text-[#424753]" key={reasonCode}>
                            {labelForReason(reasonCode)}
                          </span>
                        )) : (
                          <span className="text-[13px] text-[#424753]">No reason codes were attached to the latest decision.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6 bg-white border-t border-[#c2c6d5]">
                {reviewMutation.isError ? (
                  <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3 text-[13px] text-[#93000a] mb-4">
                    Review action failed: {reviewMutation.error.message}
                  </div>
                ) : null}

                {reviewMutation.isSuccess ? (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-800 mb-4">
                    Review decision saved and the live queue has been refreshed.
                  </div>
                ) : null}

                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <label className="sr-only" htmlFor="review_notes">Reviewer Notes</label>
                    <textarea
                      id="review_notes"
                      rows={3}
                      className="w-full bg-[#f9f9ff] border border-[#c2c6d5] rounded-lg p-3 text-[14px] text-[#191b22] placeholder:text-[#424753]/50 focus:outline-none focus:border-[#0058bd] focus:ring-2 focus:ring-[#0058bd]/20 resize-none"
                      onChange={(event) => selected ? setNoteById((current) => ({ ...current, [selected.id]: event.target.value })) : undefined}
                      placeholder="Enter the reviewer note that justifies the action you are about to take..."
                      value={notes}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[#ba1a1a]">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Required</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#c2c6d5] text-[#191b22] font-bold text-[12px] hover:bg-[#f2f3fd] transition-colors disabled:opacity-50"
                      disabled={!selected || !notes.trim() || reviewMutation.isPending}
                      onClick={() => handleAction('review')}
                      type="button"
                    >
                      <Pause className="w-4 h-4" /> HOLD FOR REVIEW
                    </button>
                    <button
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ba1a1a] text-white font-bold text-[12px] hover:opacity-90 transition-opacity disabled:opacity-50"
                      disabled={!selected || !notes.trim() || reviewMutation.isPending}
                      onClick={() => handleAction('reject')}
                      type="button"
                    >
                      <Ban className="w-4 h-4" /> REJECT
                    </button>
                    <button
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0058bd] text-white font-bold text-[12px] hover:opacity-90 transition-opacity disabled:opacity-50"
                      disabled={!selected || !notes.trim() || reviewMutation.isPending}
                      onClick={() => handleAction('approve')}
                      type="button"
                    >
                      <CheckCircle className="w-4 h-4" /> APPROVE
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
