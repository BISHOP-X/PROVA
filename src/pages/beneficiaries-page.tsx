import { UserPlus, Filter, Download, MoreVertical, CheckCircle2, Clock3, ShieldAlert, Search, Users, Flag } from 'lucide-react';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import type { SubmissionStatus } from '@/contexts/SubmissionsContext';

const statusBadge: Record<SubmissionStatus, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-[#ffdcc4] text-[#8f4a00]',
  review: 'bg-[#ffdad6] text-[#ba1a1a]',
  rejected: 'bg-[#ffdad6] text-[#ba1a1a]',
};

const statusIcon: Record<SubmissionStatus, React.ReactNode> = {
  approved: <CheckCircle2 className="w-3 h-3" />,
  pending: <Clock3 className="w-3 h-3" />,
  review: <ShieldAlert className="w-3 h-3" />,
  rejected: <ShieldAlert className="w-3 h-3" />,
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'NA';

const formatStatus = (status: SubmissionStatus) => status.replace('_', ' ').toUpperCase();

export function BeneficiariesPage() {
  const { submissions } = useSubmissions();
  const total = submissions.length;
  const pending = submissions.filter((submission) => submission.status === 'pending').length;
  const flagged = submissions.filter((submission) => submission.status === 'review' || submission.status === 'rejected').length;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-medium leading-7 text-[#191b22] hidden md:block">Beneficiaries Hub</h1>
        <h1 className="text-[20px] font-bold leading-7 text-[#0058bd] md:hidden">Beneficiaries</h1>
        <button className="flex items-center gap-2 bg-[#0058bd] text-white px-4 py-2 rounded-lg font-bold text-[12px] tracking-[0.05em] hover:opacity-90 transition-opacity">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Invite Beneficiary</span>
          <span className="sm:hidden">Invite</span>
        </button>
      </div>

      <div className="md:hidden relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424753] w-4 h-4" />
        <input
          className="w-full bg-white border border-[#c2c6d5] rounded-lg pl-9 pr-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#0058bd] focus:outline-none"
          placeholder="Search recipients by name or ID..."
          type="text"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-lg p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="p-2 rounded-lg bg-[#d8e2ff] w-fit">
            <Users className="w-5 h-5 text-[#0058bd]" />
          </div>
          <p className="text-[12px] text-[#424753] mt-3">Total Active</p>
          <h3 className="text-[24px] font-bold text-[#191b22] leading-8">{total}</h3>
        </div>
        <div className="bg-white rounded-lg p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="p-2 rounded-lg bg-[#ffdcc4] w-fit">
            <Clock3 className="w-5 h-5 text-[#8f4a00]" />
          </div>
          <p className="text-[12px] text-[#424753] mt-3">Pending Review</p>
          <h3 className="text-[24px] font-bold text-[#191b22] leading-8">{pending}</h3>
        </div>
        <div className="col-span-2 md:col-span-1 bg-white rounded-lg p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="p-2 rounded-lg bg-[#ffdad6] w-fit">
            <Flag className="w-5 h-5 text-[#ba1a1a]" />
          </div>
          <p className="text-[12px] text-[#424753] mt-3">Compliance Flags</p>
          <h3 className="text-[24px] font-bold text-[#191b22] leading-8">{flagged}</h3>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none md:overflow-visible">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f3fd] rounded-lg text-[12px] font-bold text-[#424753] hover:bg-[#e7e7f1] transition-colors shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </button>
        <button className="ml-auto flex items-center gap-1 px-3 py-1.5 text-[#0058bd] font-bold text-[12px] hover:underline shrink-0">
          <Download className="w-3.5 h-3.5" />
          CSV
        </button>
      </div>

      <div className="hidden md:block bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f3fd] border-b border-[#c2c6d5]">
                {['Name', 'Program', 'Reference ID', 'Status', 'Submitted', 'Actions'].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-[12px] font-bold tracking-[0.05em] text-[#424753] uppercase">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c2c6d5]">
              {submissions.map((beneficiary) => (
                <tr key={beneficiary.id} className="hover:bg-[#f9f9ff] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#d8e2ff] text-[#0058bd] flex items-center justify-center font-bold text-xs">
                        {getInitials(beneficiary.fullName)}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#191b22]">{beneficiary.fullName}</p>
                        <p className="text-[11px] text-[#424753]">{beneficiary.email || beneficiary.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#191b22]">{beneficiary.programName || 'Unassigned'}</td>
                  <td className="px-6 py-4 font-mono text-[12px] text-[#424753]">{beneficiary.scholarshipId || beneficiary.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge[beneficiary.status]}`}>
                      {statusIcon[beneficiary.status]}
                      {formatStatus(beneficiary.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#424753]">{new Date(beneficiary.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#e7e7f1] rounded-full transition-colors">
                      <MoreVertical className="w-4 h-4 text-[#424753]" />
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-[#424753]" colSpan={6}>
                    No beneficiaries have submitted onboarding details yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-white border-t border-[#c2c6d5]">
          <p className="text-[12px] text-[#424753]">Showing {submissions.length} beneficiaries</p>
        </div>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {submissions.map((beneficiary) => (
          <div key={beneficiary.id} className="bg-white rounded-xl border border-[#c2c6d5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d8e2ff] text-[#0058bd] flex items-center justify-center font-bold text-sm">
                  {getInitials(beneficiary.fullName)}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#191b22]">{beneficiary.fullName}</p>
                  <p className="text-[11px] text-[#424753]">{beneficiary.programName || 'Unassigned'}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge[beneficiary.status]}`}>
                {statusIcon[beneficiary.status]}
                {formatStatus(beneficiary.status)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#c2c6d5]">
              <div>
                <p className="text-[10px] font-bold text-[#424753] uppercase tracking-wider">Submitted</p>
                <p className="text-[12px] text-[#424753]">{new Date(beneficiary.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#424753] uppercase tracking-wider">ID</p>
                <p className="text-[12px] font-mono text-[#424753]">{beneficiary.id.slice(0, 8)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
