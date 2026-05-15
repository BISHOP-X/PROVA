import {
  SearchCode,
  Hourglass,
  Check,
  CircleDot,
  Circle,
  Receipt,
  Landmark,
  Headset,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';

export function StatusTrackerPage() {
  const { user } = useAuth();
  const { getByUser } = useSubmissions();
  const submission = user ? getByUser(user.id) : undefined;
  const currentStatus = submission ? submission.status : 'pending';

  return (
    <main className="px-4 md:px-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 flex flex-col gap-8 w-full">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight">Application Status</h1>
          <p className="font-body-lg text-lg text-on-surface-variant mt-1">Track the progress of your disbursement request.</p>
        </div>

        <div className="relative bg-surface-container rounded-xl shadow-lg overflow-hidden border border-outline-variant/30">
          <div className="absolute inset-0 z-0 opacity-10 bg-gradient-to-br from-secondary to-transparent pointer-events-none" />

          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <SearchCode className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <div className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Current Status</div>
                <h2 className="font-headline-md text-2xl font-bold text-on-surface">{submission ? submission.status.toUpperCase() : 'Not Submitted'}</h2>
                {submission?.livenessScore != null && (
                  <div className="text-sm text-on-surface-variant mt-1">Liveness score: {submission.livenessScore}%</div>
                )}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-variant text-on-surface border border-outline-variant shrink-0">
              <Hourglass className="w-4 h-4 text-secondary" />
              <span className="font-body-sm text-sm font-semibold">
                {submission ? 'Verification in progress' : 'Awaiting submission'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container rounded-xl p-6 md:p-8 shadow-lg border border-outline-variant/30">
          <h3 className="font-title-lg text-xl font-medium text-on-surface mb-8">Timeline</h3>

          <div className="relative">
            <div className="absolute left-[15px] top-[16px] bottom-[16px] w-[2px] bg-surface-variant z-0" />

            <div className="relative z-10 flex gap-6 mb-12">
              <div className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center relative shadow-sm">
                <Check className="w-5 h-5 text-white" />
                <div className="absolute top-8 left-[15px] w-[2px] h-[48px] bg-secondary -z-10" />
              </div>
              <div className="pt-1">
                <h4 className="font-title-lg text-lg font-semibold text-on-surface">Details Submitted</h4>
                <p className="font-body-sm text-sm text-on-surface-variant mt-1">
                  {submission ? new Date(submission.createdAt).toLocaleString() : 'Not submitted yet'}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex gap-6 mb-12">
              <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-secondary flex items-center justify-center text-secondary relative animate-pulse shadow-sm">
                <CircleDot className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <h4 className="font-title-lg text-lg font-semibold text-secondary">AI Verification</h4>
                <p className="font-body-sm text-sm text-on-surface-variant mt-1">{submission ? 'Automated checks queued' : 'Awaiting submission'}</p>
              </div>
            </div>

            <div className="relative z-10 flex gap-6 mb-12">
              <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-outline-variant/50 flex items-center justify-center text-on-surface-variant relative">
                <Circle className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <h4 className="font-title-lg text-lg font-semibold text-on-surface-variant">Reviewer Approval</h4>
                <p className="font-body-sm text-sm text-on-surface-variant/70 mt-1">{currentStatus === 'review' ? 'Awaiting manual review' : 'Not required yet'}</p>
              </div>
            </div>

            <div className="relative z-10 flex gap-6">
              <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-outline-variant/50 flex items-center justify-center text-on-surface-variant relative">
                <Circle className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <h4 className="font-title-lg text-lg font-semibold text-on-surface-variant">Payout Disbursed</h4>
                <p className="font-body-sm text-sm text-on-surface-variant/70 mt-1">{currentStatus === 'approved' ? 'Ready for payout' : 'Pending approval'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-8 w-full">
        <div className="bg-surface-container rounded-xl p-6 md:p-8 shadow-lg border border-outline-variant/30 sticky top-24">
          <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/20 pb-4">
            <Receipt className="w-6 h-6 text-secondary" />
            <h3 className="font-title-lg text-xl font-medium text-on-surface">Submission Details</h3>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <div className="font-label-md text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Application ID</div>
              <div className="font-mono text-sm text-on-surface bg-surface p-2 rounded border border-outline-variant/20 inline-block">
                {submission ? `PRV-${submission.id.slice(0, 8).toUpperCase()}` : 'Not submitted'}
              </div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Applicant Name</div>
              <div className="font-body-md text-sm text-on-surface font-medium">{submission?.fullName || user?.fullName || 'Not submitted'}</div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Institution</div>
              <div className="font-body-md text-sm text-on-surface font-medium">{submission?.organizationName || submission?.programName || 'Not selected'}</div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Disbursement Method</div>
              <div className="flex items-center gap-2 font-body-md text-sm text-on-surface font-medium mt-1">
                <Landmark className="w-4 h-4 text-on-surface-variant" />
                Direct Deposit
              </div>
            </div>
            <div>
              <div className="font-label-md text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Account Number</div>
              <div className="font-mono text-sm text-on-surface bg-surface p-2 rounded border border-outline-variant/20 inline-flex items-center gap-2">
                {submission?.accountMasked || 'Not submitted'}
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
