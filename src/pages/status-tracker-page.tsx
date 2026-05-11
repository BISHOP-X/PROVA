import { 
  SearchCode, 
  Hourglass, 
  Check, 
  CircleDot, 
  Circle, 
  Receipt, 
  Landmark, 
  Headset 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getBeneficiaryStatus } from '@/lib/api';
import { useSearchParams } from 'react-router-dom';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Awaiting update';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function statusTitle(status: 'draft' | 'submitted' | 'approved' | 'review' | 'rejected') {
  const labels = {
    approved: 'Approved for Payout',
    draft: 'Draft Application',
    rejected: 'Action Required',
    review: 'Manual Review Required',
    submitted: 'Verification in Progress',
  };

  return labels[status];
}

function statusBadge(status: 'draft' | 'submitted' | 'approved' | 'review' | 'rejected') {
  const labels = {
    approved: 'Ready for disbursement',
    draft: 'Incomplete submission',
    rejected: 'Needs correction',
    review: 'Under compliance review',
    submitted: 'Automated checks running',
  };

  return labels[status];
}

export function StatusTrackerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId')?.trim() ?? '';
  const [draftLookupValue, setDraftLookupValue] = useState<string | null>(null);
  const lookupValue = draftLookupValue ?? applicationId;

  const { data, error, isError, isLoading } = useQuery({
    enabled: Boolean(applicationId),
    queryKey: ['beneficiary-status', applicationId],
    queryFn: () => getBeneficiaryStatus(applicationId),
  });

  function handleLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lookupValue.trim()) {
      return;
    }

    setSearchParams({ applicationId: lookupValue.trim() });
    setDraftLookupValue(null);
  }

  return (
    <main className="px-4 md:px-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Status & Timeline */}
      <div className="lg:col-span-8 flex flex-col gap-8 w-full">
        
        {/* Page Header */}
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-surface-on tracking-tight">Application Status</h1>
          <p className="font-body-lg text-lg text-surface-on-variant mt-1">Track the progress of your disbursement request.</p>
        </div>

        <form className="rounded-xl border border-outline-variant/30 bg-surface-container p-4 flex flex-col sm:flex-row gap-3" onSubmit={handleLookup}>
          <input
            className="flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm text-surface-on focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            onChange={(event) => setDraftLookupValue(event.target.value)}
            placeholder="Paste the live application ID"
            type="text"
            value={lookupValue}
          />
          <button className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90" type="submit">
            Track application
          </button>
        </form>

        {isError ? (
          <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3 text-sm text-[#93000a]">
            Status lookup failed: {error.message}
          </div>
        ) : null}

        {!applicationId ? (
          <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container p-6 text-sm text-surface-on-variant">
            Enter an application ID above to load the live verification and payout timeline.
          </div>
        ) : null}

        {/* Hero Status Card */}
        <div className="relative bg-surface-container rounded-xl shadow-lg overflow-hidden border border-outline-variant/30">
          {/* Decorative Background Texture */}
          <div className="absolute inset-0 z-0 opacity-10 bg-gradient-to-br from-secondary to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Status Icon */}
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <SearchCode className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <div className="font-label-md text-xs font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Current Status</div>
                <h2 className="font-headline-md text-2xl font-bold text-surface-on">
                  {applicationId ? (isLoading ? 'Loading application...' : statusTitle(data?.beneficiary.currentStatus ?? 'submitted')) : 'Awaiting lookup'}
                </h2>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-variant text-surface-on border border-outline-variant shrink-0">
              <Hourglass className="w-4 h-4 text-secondary" />
              <span className="font-body-sm text-sm font-semibold">
                {applicationId ? (isLoading ? 'Syncing live record' : statusBadge(data?.beneficiary.currentStatus ?? 'submitted')) : 'Enter an application ID'}
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="bg-surface-container rounded-xl p-6 md:p-8 shadow-lg border border-outline-variant/30">
          <h3 className="font-title-lg text-xl font-medium text-surface-on mb-8">Timeline</h3>

          {isLoading && applicationId ? (
            <div className="rounded-lg border border-dashed border-outline-variant/30 bg-surface-container-high px-4 py-8 text-center text-sm text-surface-on-variant">
              Loading your live verification timeline...
            </div>
          ) : data?.timeline?.length ? (
            <div className="relative">
              <div className="absolute left-[15px] top-[16px] bottom-[16px] w-[2px] bg-surface-variant z-0"></div>
              {data.timeline.map((step, index) => {
                const icon = step.status === 'completed'
                  ? <Check className="w-5 h-5 text-white" />
                  : step.status === 'active'
                    ? <CircleDot className="w-4 h-4" />
                    : <Circle className="w-4 h-4" />;

                const wrapperClassName = step.status === 'completed'
                  ? 'bg-secondary text-secondary-on'
                  : step.status === 'active'
                    ? 'bg-surface-container-lowest border-2 border-secondary text-secondary animate-pulse'
                    : 'bg-surface-container-lowest border-2 border-outline-variant/50 text-surface-on-variant';

                return (
                  <div className={`relative z-10 flex gap-6 ${index === data.timeline.length - 1 ? '' : 'mb-12'}`} key={step.key}>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative shadow-sm ${wrapperClassName}`}>
                      {icon}
                      {index < data.timeline.length - 1 ? (
                        <div className={`absolute top-8 left-[15px] w-[2px] h-[48px] -z-10 ${step.status === 'completed' ? 'bg-secondary' : 'bg-surface-variant'}`}></div>
                      ) : null}
                    </div>
                    <div className="pt-1">
                      <h4 className={`font-title-lg text-lg font-semibold ${step.status === 'active' ? 'text-secondary' : 'text-surface-on'}`}>{step.label}</h4>
                      <p className="font-body-sm text-sm text-surface-on-variant mt-1">{step.description}</p>
                      <p className="font-body-sm text-xs text-surface-on-variant/70 mt-2">{formatTimestamp(step.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-outline-variant/30 bg-surface-container-high px-4 py-8 text-center text-sm text-surface-on-variant">
              No timeline is available for this application yet.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Summary Card */}
      <div className="lg:col-span-4 flex flex-col gap-8 w-full">
        <div className="bg-surface-container rounded-xl p-6 md:p-8 shadow-lg border border-outline-variant/30 sticky top-24">
          <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/20 pb-4">
            <Receipt className="w-6 h-6 text-secondary" />
            <h3 className="font-title-lg text-xl font-medium text-surface-on">Submission Details</h3>
          </div>
          
          <div className="flex flex-col gap-5">
            {/* Key Value Pair */}
            <div>
              <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Application ID</div>
              <div className="font-mono text-sm text-surface-on bg-surface p-2 rounded border border-outline-variant/20 inline-block">
                {applicationId || 'Waiting for lookup'}
              </div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Applicant Name</div>
              <div className="font-body-md text-sm text-surface-on font-medium">{data?.beneficiary.fullName ?? 'Pending lookup'}</div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Institution</div>
              <div className="font-body-md text-sm text-surface-on font-medium">{data?.beneficiary.organizationName ?? 'Pending lookup'}</div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Disbursement Method</div>
              <div className="flex items-center gap-2 font-body-md text-sm text-surface-on font-medium mt-1">
                <Landmark className="w-4 h-4 text-surface-on-variant" />
                {data?.beneficiary.programType ?? 'Direct Deposit'}
              </div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Account Number</div>
              <div className="font-mono text-sm text-surface-on bg-surface p-2 rounded border border-outline-variant/20 inline-flex items-center gap-2">
                <span className="tracking-[0.2em]">•••• •••• ••••</span> {data?.beneficiary.accountLast4 ?? '----'}
              </div>
            </div>
            {data?.verification ? (
              <div>
                <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Verification Signals</div>
                <div className="rounded-lg border border-outline-variant/20 bg-surface px-3 py-3 text-sm text-surface-on-variant flex flex-col gap-1">
                  <span>Liveness score: <strong className="text-surface-on">{data.verification.livenessScore}</strong></span>
                  <span>Face match score: <strong className="text-surface-on">{data.verification.faceMatchScore}</strong></span>
                  <span>Risk score: <strong className="text-surface-on">{data.verification.riskScore}</strong></span>
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="mt-8 pt-6 border-t border-outline-variant/20">
            <button className="w-full flex items-center justify-center gap-2 text-secondary hover:text-primary transition-colors font-body-sm text-sm font-semibold">
              <Headset className="w-5 h-5" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
