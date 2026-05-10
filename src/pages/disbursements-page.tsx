import { Plus, Wallet, RefreshCw, Building2, Users2, Filter, Download, CheckCircle2 } from 'lucide-react';

const batches = [
  {
    id: 'B-8942-A',
    name: 'Q3 Vendor Settlements',
    icon: Building2,
    iconBg: 'bg-[#d8e2ff]',
    iconColor: 'text-[#0058bd]',
    amount: '$1,200,500.00',
    count: 1200,
    verified: 450,
    progress: 37.5,
    status: 'Processing',
    statusColor: 'text-[#0058bd]',
  },
  {
    id: 'B-8943-X',
    name: 'Contractor Payouts (Region 2)',
    icon: Users2,
    iconBg: 'bg-[#ffdcc4]',
    iconColor: 'text-[#8f4a00]',
    amount: '$345,000.00',
    count: 85,
    verified: 85,
    progress: 100,
    status: 'Awaiting Authorization',
    statusColor: 'text-[#8f4a00]',
  },
];

const completedPayouts = [
  { id: 'B-8901-C', name: 'Monthly Retainers', date: 'Oct 12, 2023 14:30', recipients: 24, amount: '$120,000.00' },
  { id: 'B-8890-H', name: 'Hardware Reimbursements', date: 'Oct 10, 2023 09:15', recipients: 8, amount: '$14,550.00' },
  { id: 'B-8755-A', name: 'Q2 Affiliate Commissions', date: 'Oct 01, 2023 16:45', recipients: 340, amount: '$89,400.00' },
];

export function DisbursementsPage() {
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-medium leading-7 text-[#191b22]">Disbursement Management</h1>
          <p className="text-[14px] text-[#424753] mt-1">Monitor and execute high-volume institutional payouts.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0058bd] text-white px-5 py-2.5 rounded-lg font-bold text-[12px] tracking-[0.05em] hover:opacity-90 transition-opacity self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New Batch
        </button>
      </div>

      {/* Bento top row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-4 bg-[#0058bd] text-white rounded-xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10" />
          <div className="flex justify-between items-start mb-8 md:mb-12 relative z-10">
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-[0.08em]">
              <Wallet className="w-5 h-5" />
              SQUAD POOL BALANCE
            </div>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/20 rounded text-[11px] font-bold">
              <RefreshCw className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-[12px] text-white/70 mb-1 font-mono">USD (Equivalent)</p>
            <p className="text-[32px] font-bold leading-10 tracking-tight">$4,250,000.00</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="px-2 py-1 bg-white/20 rounded text-[11px] font-mono font-bold">API: OK</span>
              <span className="text-[12px] text-white/70">Last updated: Just now</span>
            </div>
          </div>
        </div>

        {/* Active Batches */}
        <div className="lg:col-span-8 bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <h2 className="text-[20px] font-medium leading-7 text-[#191b22] mb-5">Active Batches</h2>
          <div className="flex flex-col gap-4">
            {batches.map((b) => (
              <div key={b.id} className="bg-[#f9f9ff] rounded-lg border border-[#c2c6d5] p-5 hover:border-[#0058bd] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-lg ${b.iconBg} flex items-center justify-center shrink-0`}>
                      <b.icon className={`w-5 h-5 ${b.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#424753] tracking-wider">BATCH ID: {b.id}</p>
                      <p className="text-[16px] font-bold text-[#191b22] leading-6">{b.name}</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-mono text-[18px] font-bold text-[#191b22]">{b.amount}</p>
                    <p className="text-[12px] text-[#424753]">{b.count} Beneficiaries</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className={`font-bold ${b.statusColor}`}>{b.status}</span>
                      <span className="text-[#424753]">{b.verified} / {b.count} Verified</span>
                    </div>
                    <div className="h-2 w-full bg-[#e7e7f1] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0058bd] rounded-full" style={{ width: `${b.progress}%` }} />
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-[#e7e7f1] text-[#191b22] rounded-lg font-bold text-[12px] hover:bg-[#c2c6d5] transition-colors shrink-0">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completed Payouts Table */}
      <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#c2c6d5] flex items-center justify-between">
          <h2 className="text-[20px] font-medium leading-7 text-[#191b22]">Recent Completed Payouts</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-[#c2c6d5] hover:bg-[#f2f3fd] transition-colors">
              <Filter className="w-4 h-4 text-[#424753]" />
            </button>
            <button className="p-2 rounded-lg border border-[#c2c6d5] hover:bg-[#f2f3fd] transition-colors">
              <Download className="w-4 h-4 text-[#424753]" />
            </button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f2f3fd] border-b border-[#c2c6d5]">
                {['Batch ID / Name', 'Completed Date', 'Recipients', 'Total Amount', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-4 text-[12px] font-bold tracking-[0.05em] text-[#424753] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c2c6d5]">
              {completedPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-[#f9f9ff] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[14px] text-[#191b22]">{p.name}</p>
                    <p className="font-mono text-[12px] text-[#424753]">{p.id}</p>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#424753]">{p.date}</td>
                  <td className="px-6 py-4 font-bold text-[14px] text-[#191b22]">{p.recipients}</td>
                  <td className="px-6 py-4 font-mono font-bold text-[14px] text-[#191b22]">{p.amount}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#c2c6d5]">
          {completedPayouts.map((p) => (
            <div key={p.id} className="px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-[14px] text-[#191b22]">{p.name}</p>
                  <p className="font-mono text-[11px] text-[#424753] mt-0.5">{p.id}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold shrink-0 ml-3">
                  <CheckCircle2 className="w-3 h-3" /> Settled
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[12px] text-[#424753]">{p.date}</span>
                <span className="font-mono font-bold text-[14px] text-[#191b22]">{p.amount}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-[#c2c6d5] text-center">
          <button className="text-[#0058bd] font-bold text-[12px] tracking-[0.05em] hover:underline">
            Load More History
          </button>
        </div>
      </div>
    </>
  );
}
