import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock3, Download, Filter, Flag, MoreVertical, Search, ShieldAlert, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { listBeneficiaries } from '@/lib/api';

const statusBadge: Record<string, string> = {
  approved: 'bg-green-100 text-green-800',
  draft: 'bg-[#e1e2eb] text-[#424753]',
  rejected: 'bg-[#ffdad6] text-[#ba1a1a]',
  review: 'bg-[#ffdcc4] text-[#8f4a00]',
  submitted: 'bg-[#d8e2ff] text-[#0058bd]',
};

const statusIcon: Record<string, React.ReactNode> = {
  approved: <CheckCircle2 className="w-3 h-3" />,
  draft: <Clock3 className="w-3 h-3" />,
  rejected: <ShieldAlert className="w-3 h-3" />,
  review: <ShieldAlert className="w-3 h-3" />,
  submitted: <Clock3 className="w-3 h-3" />,
};

function formatCurrency(value: number | null) {
  if (value === null) {
    return 'No history';
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return '--';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function statusLabel(status: 'draft' | 'submitted' | 'approved' | 'review' | 'rejected') {
  const labels = {
    approved: 'Approved',
    draft: 'Draft',
    rejected: 'Action Required',
    review: 'In Review',
    submitted: 'Pending',
  };

  return labels[status];
}

export function BeneficiariesPage() {
  const [searchValue, setSearchValue] = useState('');
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['beneficiaries'],
    queryFn: listBeneficiaries,
  });

  const beneficiaries = data?.beneficiaries ?? [];
  const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
    const searchTerm = searchValue.trim().toLowerCase();

    if (!searchTerm) {
      return true;
    }

    return [beneficiary.fullName, beneficiary.referenceId, beneficiary.programName, beneficiary.organizationName]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm);
  });

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-medium leading-7 text-[#191b22] hidden md:block">Beneficiaries Hub</h1>
        <h1 className="text-[20px] font-bold leading-7 text-[#0058bd] md:hidden">Beneficiaries</h1>
        <Link className="flex items-center gap-2 bg-[#0058bd] text-white px-4 py-2 rounded-lg font-bold text-[12px] tracking-[0.05em] hover:opacity-90 transition-opacity" to="/onboarding">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Invite Beneficiary</span>
          <span className="sm:hidden">Invite</span>
        </Link>
      </div>

      {isError ? (
        <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3 text-[14px] text-[#93000a]">
          Live beneficiary data could not be loaded: {error.message}
        </div>
      ) : null}

      {/* Mobile: search bar */}
      <div className="md:hidden relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424753] w-4 h-4" />
        <input
          className="w-full bg-white border border-[#c2c6d5] rounded-lg pl-9 pr-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#0058bd] focus:outline-none"
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search recipients by name or ID..."
          type="text"
          value={searchValue}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-lg p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-[#d8e2ff]">
              <Users className="w-5 h-5 text-[#0058bd]" />
            </div>
            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">+12%</span>
          </div>
          <p className="text-[12px] text-[#424753] mt-3">Total Active</p>
          <h3 className="text-[24px] font-bold text-[#191b22] leading-8">
            {isLoading ? '--' : new Intl.NumberFormat('en-US').format(data?.summary.totalActive ?? 0)}
          </h3>
        </div>
        <div className="bg-white rounded-lg p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-[#ffdcc4]">
              <Clock3 className="w-5 h-5 text-[#8f4a00]" />
            </div>
            <span className="text-[10px] font-bold text-[#8f4a00] bg-[#ffdcc4] px-2 py-0.5 rounded">4 Pending</span>
          </div>
          <p className="text-[12px] text-[#424753] mt-3">Pending Review</p>
          <h3 className="text-[24px] font-bold text-[#191b22] leading-8">
            {isLoading ? '--' : new Intl.NumberFormat('en-US').format(data?.summary.pendingReview ?? 0)}
          </h3>
        </div>
        <div className="col-span-2 md:col-span-1 bg-white rounded-lg p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-[#ffdad6]">
              <Flag className="w-5 h-5 text-[#ba1a1a]" />
            </div>
            <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded">Urgent</span>
          </div>
          <p className="text-[12px] text-[#424753] mt-3">Compliance Flags</p>
          <h3 className="text-[24px] font-bold text-[#191b22] leading-8">
            {isLoading ? '--' : new Intl.NumberFormat('en-US').format(data?.summary.flagged ?? 0)}
          </h3>
        </div>
      </div>

      {/* Filter chips — mobile horizontal scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none md:overflow-visible">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f3fd] rounded-lg text-[12px] font-bold text-[#424753] hover:bg-[#e7e7f1] transition-colors shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </button>
        <div className="h-5 w-px bg-[#c2c6d5]" />
        <span className="text-[12px] text-[#424753] shrink-0">Active:</span>
        <span className="bg-[#2771df] text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-1 font-bold shrink-0">
          Status: Verified
          <span className="ml-1 cursor-pointer">×</span>
        </span>
        <button className="ml-auto flex items-center gap-1 px-3 py-1.5 text-[#0058bd] font-bold text-[12px] hover:underline shrink-0">
          <Download className="w-3.5 h-3.5" />
          CSV
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-[#c2c6d5] bg-[#f9f9ff] px-4 py-8 text-center text-[14px] text-[#424753]">
          Loading beneficiary records from your live Supabase project...
        </div>
      ) : null}

      {!isLoading && !filteredBeneficiaries.length ? (
        <div className="rounded-lg border border-dashed border-[#c2c6d5] bg-[#f9f9ff] px-4 py-8 text-center text-[14px] text-[#424753]">
          {beneficiaries.length
            ? 'No beneficiaries match the current search. Try a different name or reference ID.'
            : 'No beneficiary records exist yet. Use the onboarding flow to create the first live application.'}
        </div>
      ) : null}

      {/* Data Table — desktop */}
      <div className={`hidden md:block bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5] overflow-hidden ${filteredBeneficiaries.length ? '' : 'hidden'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f3fd] border-b border-[#c2c6d5]">
                {['Name', 'Entity', 'Reference ID', 'Status', 'Last Payout', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-[12px] font-bold tracking-[0.05em] text-[#424753] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c2c6d5]">
              {filteredBeneficiaries.map((b) => (
                <tr key={b.id} className="hover:bg-[#f9f9ff] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#d8e2ff] text-[#0058bd] flex items-center justify-center font-bold text-xs">
                        {b.initials}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#191b22]">{b.fullName}</p>
                        <p className="text-[11px] text-[#424753]">{b.maskedContact}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#191b22]">
                    <p>{b.entity}</p>
                    <p className="text-[11px] text-[#424753]">{b.programName}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-[12px] text-[#424753]">{b.referenceId}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge[b.status]}`}>
                      {statusIcon[b.status]}
                      {statusLabel(b.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] text-[#191b22]">{formatDate(b.lastPayoutDate)}</p>
                    <p className="text-[11px] text-[#424753]">{formatCurrency(b.lastPayoutAmount)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link className="inline-flex p-2 hover:bg-[#e7e7f1] rounded-full transition-colors" to={`/status?applicationId=${b.id}`}>
                      <MoreVertical className="w-4 h-4 text-[#424753]" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination footer */}
        <div className="px-6 py-4 bg-white border-t border-[#c2c6d5] flex items-center justify-between">
          <p className="text-[12px] text-[#424753]">
            Showing {filteredBeneficiaries.length} of {beneficiaries.length} live recipients
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#c2c6d5] rounded-lg text-[14px] font-medium hover:bg-[#f2f3fd] transition-colors disabled:opacity-50 text-[#191b22]" disabled>
              Previous
            </button>
            <button className="px-4 py-2 bg-[#0058bd] text-white rounded-lg text-[14px] font-medium hover:opacity-90">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Beneficiary Card list — mobile only */}
      <div className={`md:hidden flex flex-col gap-3 ${filteredBeneficiaries.length ? '' : 'hidden'}`}>
        {filteredBeneficiaries.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-[#c2c6d5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d8e2ff] text-[#0058bd] flex items-center justify-center font-bold text-sm">
                  {b.initials}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#191b22]">{b.fullName}</p>
                  <p className="text-[11px] text-[#424753]">{b.entity}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge[b.status]}`}>
                {statusIcon[b.status]}
                {statusLabel(b.status)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#c2c6d5]">
              <div>
                <p className="text-[10px] font-bold text-[#424753] uppercase tracking-wider">Last Payout</p>
                <p className="text-[13px] font-bold text-[#191b22]">{formatCurrency(b.lastPayoutAmount)}</p>
                <p className="text-[11px] text-[#424753]">{formatDate(b.lastPayoutDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#424753] uppercase tracking-wider">ID</p>
                <p className="text-[12px] font-mono text-[#424753]">{b.referenceId}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
