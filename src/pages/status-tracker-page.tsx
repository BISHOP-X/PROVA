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

export function StatusTrackerPage() {
  return (
    <main className="px-4 md:px-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Status & Timeline */}
      <div className="lg:col-span-8 flex flex-col gap-8 w-full">
        
        {/* Page Header */}
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-surface-on tracking-tight">Application Status</h1>
          <p className="font-body-lg text-lg text-surface-on-variant mt-1">Track the progress of your disbursement request.</p>
        </div>

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
                <h2 className="font-headline-md text-2xl font-bold text-surface-on">Verification in Progress</h2>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-variant text-surface-on border border-outline-variant shrink-0">
              <Hourglass className="w-4 h-4 text-secondary" />
              <span className="font-body-sm text-sm font-semibold">Action Required Internally</span>
            </div>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="bg-surface-container rounded-xl p-6 md:p-8 shadow-lg border border-outline-variant/30">
          <h3 className="font-title-lg text-xl font-medium text-surface-on mb-8">Timeline</h3>
          
          <div className="relative">
            {/* Continuous Vertical Line */}
            <div className="absolute left-[15px] top-[16px] bottom-[16px] w-[2px] bg-surface-variant z-0"></div>
            
            {/* Step 1: Submitted (Completed) */}
            <div className="relative z-10 flex gap-6 mb-12">
              <div className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-on relative shadow-sm">
                <Check className="w-5 h-5 text-white" />
                {/* Active Line Segment */}
                <div className="absolute top-8 left-[15px] w-[2px] h-[48px] bg-secondary -z-10"></div>
              </div>
              <div className="pt-1">
                <h4 className="font-title-lg text-lg font-semibold text-surface-on">Details Submitted</h4>
                <p className="font-body-sm text-sm text-surface-on-variant mt-1">Oct 24, 2023 at 10:45 AM</p>
              </div>
            </div>

            {/* Step 2: AI Verification (Active) */}
            <div className="relative z-10 flex gap-6 mb-12">
              <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-secondary flex items-center justify-center text-secondary relative animate-pulse shadow-sm">
                <CircleDot className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <h4 className="font-title-lg text-lg font-semibold text-secondary">AI Verification</h4>
                <p className="font-body-sm text-sm text-surface-on-variant mt-1">Automated security and compliance checks are currently running.</p>
              </div>
            </div>

            {/* Step 3: Reviewer Approval (Pending) */}
            <div className="relative z-10 flex gap-6 mb-12">
              <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-outline-variant/50 flex items-center justify-center text-surface-on-variant relative">
                <Circle className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <h4 className="font-title-lg text-lg font-semibold text-surface-on-variant">Reviewer Approval</h4>
                <p className="font-body-sm text-sm text-surface-on-variant/70 mt-1">Awaiting manual authorization from the compliance team.</p>
              </div>
            </div>

            {/* Step 4: Payout Disbursed (Pending) */}
            <div className="relative z-10 flex gap-6">
              <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-outline-variant/50 flex items-center justify-center text-surface-on-variant relative">
                <Circle className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <h4 className="font-title-lg text-lg font-semibold text-surface-on-variant">Payout Disbursed</h4>
                <p className="font-body-sm text-sm text-surface-on-variant/70 mt-1">Funds transferred to your designated account.</p>
              </div>
            </div>
          </div>
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
              <div className="font-mono text-sm text-surface-on bg-surface p-2 rounded border border-outline-variant/20 inline-block">PRV-882-X9Q</div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Applicant Name</div>
              <div className="font-body-md text-sm text-surface-on font-medium">Eleanor Shellstrop</div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Institution</div>
              <div className="font-body-md text-sm text-surface-on font-medium">Global Tech University</div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Disbursement Method</div>
              <div className="flex items-center gap-2 font-body-md text-sm text-surface-on font-medium mt-1">
                <Landmark className="w-4 h-4 text-surface-on-variant" />
                Direct Deposit
              </div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-surface-on-variant uppercase tracking-wider mb-1">Account Number</div>
              <div className="font-mono text-sm text-surface-on bg-surface p-2 rounded border border-outline-variant/20 inline-flex items-center gap-2">
                <span className="tracking-[0.2em]">•••• •••• ••••</span> 4092
              </div>
            </div>
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
