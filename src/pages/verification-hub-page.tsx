import { useState, useMemo } from 'react';
import { Filter, AlertTriangle, ShieldAlert, Fingerprint, ArrowLeftRight, Cpu, Braces, Info, Pause, Ban, CheckCircle, Clock } from 'lucide-react';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import type { Submission } from '@/contexts/SubmissionsContext';

const getFlagInfo = (submission: Submission) => {
  const score = submission.livenessScore ?? 0;
  if (score < 50) return {
    flag: 'Liveness Failed',
    scoreColor: 'text-[#ba1a1a]',
    badgeBg: 'bg-[#ffdad6]',
    badgeBorder: 'border-[#ba1a1a]/20',
    icon: AlertTriangle,
    iconColor: 'text-[#ba1a1a]',
  };
  if (score < 75) return {
    flag: 'Review Required',
    scoreColor: 'text-[#8f4a00]',
    badgeBg: 'bg-[#ffdcc4]',
    badgeBorder: 'border-[#8f4a00]/20',
    icon: ShieldAlert,
    iconColor: 'text-[#8f4a00]',
  };
  return {
    flag: 'Verification Pass',
    scoreColor: 'text-green-700',
    badgeBg: 'bg-green-50',
    badgeBorder: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-700',
  };
};

export function VerificationHubPage() {
  const { submissions, updateSubmissionStatus } = useSubmissions();
  const [activeItem, setActiveItem] = useState(0);
  const [mobileView, setMobileView] = useState<'queue' | 'detail'>('queue');
  const [acting, setActing] = useState(false);

  const queueItems = useMemo(() => {
    return submissions
      .filter(s => s.status === 'pending' || s.status === 'review')
      .map(s => ({
        ...s,
        ...getFlagInfo(s),
        time: s.createdAt ? new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      }));
  }, [submissions]);

  const selected = queueItems[activeItem];

  const handleStatusChange = async (newStatus: 'approved' | 'review' | 'rejected') => {
    if (!selected) return;
    setActing(true);
    try {
      await updateSubmissionStatus(selected.id, newStatus);
      // If we approved or rejected, it will disappear from the queue
      if (activeItem >= queueItems.length - 1 && activeItem > 0) {
        setActiveItem(activeItem - 1);
      }
    } finally {
      setActing(false);
    }
  };

  return (
    <>
      {/* Mobile: toggle between queue and detail */}
      <div className="md:hidden flex rounded-lg border border-[#c2c6d5] overflow-hidden">
        <button
          onClick={() => setMobileView('queue')}
          className={`flex-1 py-2.5 text-[13px] font-bold transition-colors ${mobileView === 'queue' ? 'bg-[#0058bd] text-white' : 'bg-white text-[#424753]'}`}
        >
          Queue ({queueItems.length})
        </button>
        <button
          onClick={() => setMobileView('detail')}
          className={`flex-1 py-2.5 text-[13px] font-bold transition-colors ${mobileView === 'detail' ? 'bg-[#0058bd] text-white' : 'bg-white text-[#424753]'}`}
        >
          Detail View
        </button>
      </div>

      {/* Desktop: side-by-side | Mobile: toggle */}
      <div className="flex flex-col md:flex-row gap-6 md:h-[calc(100vh-11rem)] md:overflow-hidden">

        {/* ── LEFT PANE: Queue ── */}
        <div className={`${mobileView === 'queue' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[300px] lg:w-[340px] bg-white rounded-xl border border-[#c2c6d5] shadow-[0_1px_3px_rgba(0,0,0,0.12)] overflow-hidden shrink-0`}>
          <div className="px-4 py-4 border-b border-[#c2c6d5] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-bold text-[#191b22]">Pending</h2>
              <span className="bg-[#ffdad6] text-[#ba1a1a] text-[11px] px-2 py-0.5 rounded-full font-bold">{queueItems.length}</span>
            </div>
            <button className="text-[#424753] hover:text-[#0058bd] transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {queueItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => { setActiveItem(idx); setMobileView('detail'); }}
                className={`text-left w-full rounded-lg p-4 transition-all border ${
                  idx === activeItem
                    ? 'bg-[#d8e2ff]/40 border-l-4 border-l-[#0058bd] border-t-transparent border-r-transparent border-b-transparent'
                    : 'bg-[#f9f9ff] border-[#c2c6d5] hover:border-[#0058bd]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className={`font-bold text-[14px] ${idx === activeItem ? 'text-[#191b22]' : 'text-[#191b22]/80'}`}>{item.fullName}</p>
                    <p className="font-mono text-[11px] text-[#424753] mt-0.5">ID: {item.applicationId || item.id.slice(0, 8)}</p>
                  </div>
                  <span className="text-[11px] text-[#424753] font-mono">{item.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${item.badgeBg} border ${item.badgeBorder}`}>
                    <item.icon className={`w-3 h-3 ${item.iconColor}`} />
                    <span className={item.scoreColor}>Score: {item.livenessScore ?? '??'}</span>
                  </span>
                  <span className={`ml-auto text-[11px] font-bold ${item.scoreColor}`}>{item.flag}</span>
                </div>
              </button>
            ))}
            {queueItems.length === 0 && (
              <div className="p-8 text-center text-[14px] text-[#424753]">
                No pending verifications.
              </div>
            )}
          </div>
        </div>

          <div className={`${mobileView === 'detail' ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-white rounded-xl border border-[#c2c6d5] shadow-[0_1px_3px_rgba(0,0,0,0.12)] overflow-hidden min-w-0`}>
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-[#424753]">
                Select an item from the queue to review
              </div>
            ) : (
              <>
                <div className="px-6 py-5 border-b border-[#c2c6d5] bg-[#f9f9ff] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded ${selected.badgeBg} ${selected.scoreColor} font-mono text-[10px] font-bold uppercase tracking-wider`}>
                        {selected.flag}
                      </span>
                      <span className="text-[#424753] font-mono text-[11px]">Session: #{selected.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <h2 className="text-[24px] font-bold tracking-tight text-[#191b22]">{selected.fullName}</h2>
                    <p className="text-[14px] text-[#424753] mt-0.5">Initiated: {new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                  {/* Trust score ring */}
                  <div className="text-center shrink-0">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="#e7e7f1" strokeWidth="8" />
                        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8"
                          strokeDasharray="289" strokeDashoffset={289 - (289 * (selected.livenessScore ?? 0)) / 100} 
                          className={`transition-all duration-700 ${selected.scoreColor}`} />
                      </svg>
                      <span className={`text-[18px] font-bold relative z-10 ${selected.scoreColor}`}>{selected.livenessScore ?? 0}</span>
                    </div>
                    <p className="text-[10px] font-bold text-[#424753] uppercase tracking-wider mt-1">Trust Score</p>
                  </div>
                </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-[#f9f9ff]">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Evidence comparison */}
              <div className="xl:col-span-2 bg-white rounded-xl border border-[#c2c6d5] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#c2c6d5] flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-[#8f4a00]" />
                  <h3 className="font-bold text-[14px] text-[#191b22]">Evidence Comparison</h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-5">
                  {/* ID Doc */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-[#424753] uppercase tracking-wider">Submitted ID</span>
                      <span className="px-2 py-0.5 bg-[#f2f3fd] text-[#191b22] text-[11px] font-mono rounded border border-[#c2c6d5]">Passport</span>
                    </div>
                    <div className="aspect-[4/3] rounded-lg border border-[#c2c6d5] overflow-hidden bg-[#f2f3fd] group">
                      <div className="w-full h-full bg-center bg-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2PqSs30MsjWUM873lWGr92_uJfpt7P8KgrizCrmg0jA4uMSDlKvLs3-1uQWu8wNfU6s8C2ReznIiYcRyV0tGLGqbl6V69OJeO5UJ2gDAZ9ljCx0xWX8wn8e-0B4l4JA2AH7PHMDPEHTVnZdYwYFp4fU-z--pe9ethspw9bRf7XquYPPyrRExYrZTxxQrEmVCCyJ-2XlyYToaACTTBN5VTC_lFmgwTyw0ltW4izDzRlxqFws1Aa_w_a8HyATo5V9fHUG2zeB394Ms')" }}
                      />
                    </div>
                  </div>
                  {/* Liveness */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider">Liveness</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold rounded border border-[#ba1a1a]/20">
                        <AlertTriangle className="w-3 h-3" /> Flagged
                      </span>
                    </div>
                    <div className="aspect-[4/3] rounded-lg border-2 border-[#ba1a1a] overflow-hidden bg-[#f2f3fd] relative group">
                      <div className="w-full h-full bg-center bg-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcgXKEnr_r12NvNfLg_T5ikRenvuTG1dd64XMxdT_StLQtK12iKy6fL7h9p5F39DDZ4NOriiRf4xETzoUDZO0y27AuglqtaxSLDGpSddVtmxgE69morPIoZQKpEle2O4wPvZ0F89ODtAKyDaUmQyj9e2zwYVJseJAUlYHvJnIQsJ2fioQuCITqQnpPORrtAv8CMNy23fQeoNO_LSMFmFgKWoSy1eY0wsvQMupdJUjcfxkunKRSvhzfzZpOWymjRygW9MWxu3l0IAU')" }}
                      />
                      <div className="absolute left-0 right-0 h-0.5 bg-[#ba1a1a]/80 top-1/2 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis + Extracted Data */}
              <div className="xl:col-span-1 flex flex-col gap-5">
                {/* Provider Analysis */}
                <div className="bg-white rounded-xl border border-[#c2c6d5] p-5">
                  <h3 className="font-bold text-[14px] text-[#191b22] border-b border-[#c2c6d5] pb-3 mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#0058bd]" /> Provider Analysis
                  </h3>
                  {[
                    { label: 'Face Match', val: 85, color: 'bg-[#0058bd]', textColor: 'text-[#0058bd]' },
                    { label: 'Document Authenticity', val: 92, color: 'bg-[#8f4a00]', textColor: 'text-[#8f4a00]' },
                  ].map(({ label, val, color, textColor }) => (
                    <div key={label} className="mb-3">
                      <div className="flex justify-between text-[13px] mb-1">
                        <span className="text-[#424753]">{label}</span>
                        <span className={`font-mono font-bold ${textColor}`}>{val}%</span>
                      </div>
                      <div className="h-2 bg-[#e7e7f1] rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-tertiary/10 border border-tertiary/20 rounded-lg mt-1">
                    <div className="flex justify-between text-[13px] mb-1">
                      <span className="font-bold text-tertiary">Liveness Detection</span>
                      <span className="font-mono font-bold text-tertiary">{selected.livenessScore ?? 0}%</span>
                    </div>
                    <div className="h-2 bg-[#e7e7f1] rounded-full overflow-hidden mb-2">
                      <div className={`h-full bg-tertiary rounded-full`} style={{ width: `${selected.livenessScore ?? 0}%` }} />
                    </div>
                    <p className="text-[12px] text-[#424753] leading-relaxed">
                      {selected.livenessScore && selected.livenessScore < 50 
                        ? "AI detected irregular micro-movements inconsistent with live presence."
                        : "AI analysis confirms biological signature matches live capture."}
                    </p>
                  </div>
                </div>

                {/* Extracted Data */}
                <div className="bg-white rounded-xl border border-[#c2c6d5] p-5">
                  <h3 className="font-bold text-[14px] text-[#191b22] border-b border-[#c2c6d5] pb-3 mb-4 flex items-center gap-2">
                    <Braces className="w-4 h-4 text-[#8f4a00]" /> Extracted Data
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', val: selected.fullName },
                      { label: 'Bank Code', val: selected.bank || 'N/A' },
                      { label: 'Account No.', val: selected.accountMasked || 'N/A', span: true },
                    ].map(({ label, val, span }) => (
                      <div key={label} className={span ? 'col-span-2' : ''}>
                        <p className="text-[10px] font-bold text-[#424753] uppercase tracking-wider">{label}</p>
                        <p className="font-mono text-[13px] font-bold text-[#191b22] mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky action footer */}
          <div className="p-5 md:p-6 bg-white border-t border-[#c2c6d5]">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <label className="sr-only" htmlFor="review_notes">Reviewer Notes</label>
                <textarea
                  id="review_notes"
                  rows={2}
                  className="w-full bg-[#f9f9ff] border border-[#c2c6d5] rounded-lg p-3 text-[14px] text-[#191b22] placeholder:text-[#424753]/50 focus:outline-none focus:border-[#0058bd] focus:ring-2 focus:ring-[#0058bd]/20 resize-none"
                  placeholder="Enter mandatory audit notes before taking action..."
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[#ba1a1a]">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Required</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <button 
                  onClick={() => handleStatusChange('review')}
                  disabled={acting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#c2c6d5] text-[#191b22] font-bold text-[12px] hover:bg-[#f2f3fd] transition-colors disabled:opacity-50"
                >
                  <Pause className="w-4 h-4" /> HOLD FOR REVIEW
                </button>
                <button 
                  onClick={() => handleStatusChange('rejected')}
                  disabled={acting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ba1a1a] text-white font-bold text-[12px] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Ban className="w-4 h-4" /> REJECT
                </button>
                <button 
                  onClick={() => handleStatusChange('approved')}
                  disabled={acting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0058bd] text-white font-bold text-[12px] hover:opacity-90 transition-opacity disabled:opacity-50"
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
