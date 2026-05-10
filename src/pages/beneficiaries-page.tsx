import { UserPlus, Filter, Download, MoreVertical, CheckCircle2, Clock3, ShieldAlert, Search, Users, Flag } from 'lucide-react';

const beneficiaries = [
  {
    initials: 'AM',
    color: 'bg-[#d8e2ff] text-[#0058bd]',
    name: 'Arjun Mehta',
    email: 'arjun.m@fintech-inc.com',
    entity: 'Individual Contractor',
    refId: 'PP-49210-XC',
    status: 'Verified',
    date: 'Oct 24, 2023',
    amount: '$4,200.00',
  },
  {
    initials: 'SL',
    color: 'bg-[#d8e2ff] text-[#0058bd]',
    name: 'Starlight Logistics',
    email: 'billing@starlight.io',
    entity: 'Corporate Entity',
    refId: 'PP-99023-LL',
    status: 'Pending',
    date: '--',
    amount: 'No history',
  },
  {
    initials: 'JD',
    color: 'bg-[#ffdad6] text-[#ba1a1a]',
    name: "Julianna D'Arcy",
    email: 'j.darcy@global.net',
    entity: 'Individual Contractor',
    refId: 'PP-11204-AQ',
    status: 'Action Required',
    date: 'Sep 12, 2023',
    amount: '$1,850.00',
  },
  {
    initials: 'VC',
    color: 'bg-[#e1e2eb] text-[#424753]',
    name: 'Vertex Creative',
    email: 'contact@vertex.com',
    entity: 'Corporate Entity',
    refId: 'PP-55231-RT',
    status: 'Verified',
    date: 'Oct 20, 2023',
    amount: '$12,400.00',
  },
];

const statusBadge: Record<string, string> = {
  Verified: 'bg-green-100 text-green-800',
  Pending: 'bg-[#ffdcc4] text-[#8f4a00]',
  'Action Required': 'bg-[#ffdad6] text-[#ba1a1a]',
};

const statusIcon: Record<string, React.ReactNode> = {
  Verified: <CheckCircle2 className="w-3 h-3" />,
  Pending: <Clock3 className="w-3 h-3" />,
  'Action Required': <ShieldAlert className="w-3 h-3" />,
};

export function BeneficiariesPage() {
  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-medium leading-7 text-[#191b22] hidden md:block">Beneficiaries Hub</h1>
        <h1 className="text-[20px] font-bold leading-7 text-[#0058bd] md:hidden">Beneficiaries</h1>
        <button className="flex items-center gap-2 bg-[#0058bd] text-white px-4 py-2 rounded-lg font-bold text-[12px] tracking-[0.05em] hover:opacity-90 transition-opacity">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Invite Beneficiary</span>
          <span className="sm:hidden">Invite</span>
        </button>
      </div>

      {/* Mobile: search bar */}
      <div className="md:hidden relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424753] w-4 h-4" />
        <input
          className="w-full bg-white border border-[#c2c6d5] rounded-lg pl-9 pr-4 py-2.5 text-[14px] focus:ring-2 focus:ring-[#0058bd] focus:outline-none"
          placeholder="Search recipients by name or ID..."
          type="text"
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
          <h3 className="text-[24px] font-bold text-[#191b22] leading-8">1,284</h3>
        </div>
        <div className="bg-white rounded-lg p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-[#ffdcc4]">
              <Clock3 className="w-5 h-5 text-[#8f4a00]" />
            </div>
            <span className="text-[10px] font-bold text-[#8f4a00] bg-[#ffdcc4] px-2 py-0.5 rounded">4 Pending</span>
          </div>
          <p className="text-[12px] text-[#424753] mt-3">Pending Review</p>
          <h3 className="text-[24px] font-bold text-[#191b22] leading-8">42</h3>
        </div>
        <div className="col-span-2 md:col-span-1 bg-white rounded-lg p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-[#ffdad6]">
              <Flag className="w-5 h-5 text-[#ba1a1a]" />
            </div>
            <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded">Urgent</span>
          </div>
          <p className="text-[12px] text-[#424753] mt-3">Compliance Flags</p>
          <h3 className="text-[24px] font-bold text-[#191b22] leading-8">7</h3>
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

      {/* Data Table — desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5] overflow-hidden">
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
              {beneficiaries.map((b) => (
                <tr key={b.refId} className="hover:bg-[#f9f9ff] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${b.color} flex items-center justify-center font-bold text-xs`}>
                        {b.initials}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#191b22]">{b.name}</p>
                        <p className="text-[11px] text-[#424753]">{b.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#191b22]">{b.entity}</td>
                  <td className="px-6 py-4 font-mono text-[12px] text-[#424753]">{b.refId}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge[b.status]}`}>
                      {statusIcon[b.status]}
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[14px] text-[#191b22]">{b.date}</p>
                    <p className="text-[11px] text-[#424753]">{b.amount}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#e7e7f1] rounded-full transition-colors">
                      <MoreVertical className="w-4 h-4 text-[#424753]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination footer */}
        <div className="px-6 py-4 bg-white border-t border-[#c2c6d5] flex items-center justify-between">
          <p className="text-[12px] text-[#424753]">Showing 1 to 4 of 1,284 recipients</p>
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
      <div className="md:hidden flex flex-col gap-3">
        {beneficiaries.map((b) => (
          <div key={b.refId} className="bg-white rounded-xl border border-[#c2c6d5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${b.color} flex items-center justify-center font-bold text-sm`}>
                  {b.initials}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#191b22]">{b.name}</p>
                  <p className="text-[11px] text-[#424753]">{b.entity}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge[b.status]}`}>
                {statusIcon[b.status]}
                {b.status}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#c2c6d5]">
              <div>
                <p className="text-[10px] font-bold text-[#424753] uppercase tracking-wider">Last Payout</p>
                <p className="text-[13px] font-bold text-[#191b22]">{b.amount}</p>
                <p className="text-[11px] text-[#424753]">{b.date}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#424753] uppercase tracking-wider">ID</p>
                <p className="text-[12px] font-mono text-[#424753]">{b.refId}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
