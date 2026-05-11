import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '@/lib/api';

const riskBadge: Record<string, string> = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-[#ffdad6] text-[#93000a]',
};

// ── Bar chart months ──────────────────────────────────────────────
const months = [
  { label: 'Jan', prev: '60%', curr: '85%' },
  { label: 'Feb', prev: '55%', curr: '70%' },
  { label: 'Mar', prev: '45%', curr: '90%' },
  { label: 'Apr', prev: '65%', curr: '75%' },
  { label: 'May', prev: '50%', curr: '95%' },
  { label: 'Jun', prev: '70%', curr: '88%' },
  { label: 'Jul', prev: '55%', curr: '65%', desktop: true },
  { label: 'Aug', prev: '40%', curr: '72%', desktop: true },
  { label: 'Sep', prev: '62%', curr: '80%', desktop: true },
  { label: 'Oct', prev: '58%', curr: '92%', desktop: true },
  { label: 'Nov', prev: '68%', curr: '85%', desktop: true },
  { label: 'Dec', prev: '75%', curr: '98%', desktop: true },
];

export function HomePage() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
  });

  const metrics = [
    {
      label: 'Total Beneficiaries',
      value: data ? new Intl.NumberFormat('en-US').format(data.metrics.totalBeneficiaries) : '--',
      sub: 'Live records in the PROVA ledger',
      subColor: 'text-[#0058bd]',
      icon: Users,
      iconColor: 'text-[#0058bd]',
    },
    {
      label: 'Pending Verifications',
      value: data ? new Intl.NumberFormat('en-US').format(data.metrics.pendingVerifications) : '--',
      badge: data ? `${data.recentQueue.filter((item) => item.risk === 'High').length} High Risk` : 'Syncing',
      badgeBg: 'bg-[#ffdad6] text-[#93000a]',
      icon: AlertTriangle,
      iconColor: 'text-[#ba1a1a]',
    },
    {
      label: 'System Trust Score',
      value: data ? `${data.metrics.trustScore}%` : '--',
      sub: data?.metrics.trustScore ? 'Derived from latest verification decisions' : 'No completed checks yet',
      subColor: 'text-[#0058bd] font-bold',
      icon: CheckCircle2,
      iconColor: 'text-[#0058bd]',
    },
    {
      label: 'Active Programs',
      value: data ? new Intl.NumberFormat('en-US').format(data.metrics.activePrograms) : '--',
      sub: data ? `${data.metrics.approvedBeneficiaries} beneficiaries approved` : 'Waiting for first program',
      subColor: 'text-[#0058bd]',
      icon: TrendingUp,
      iconColor: 'text-[#0058bd]',
    },
  ];

  const queue = data?.recentQueue ?? [];

  return (
    <>
      {isError ? (
        <section className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3 text-[14px] text-[#93000a]">
          Live dashboard data could not be loaded: {error.message}
        </section>
      ) : null}

      {/* ── MOBILE HERO GREETING (hidden on md+) ────────────────────── */}
      <div className="md:hidden -mx-4 -mt-4 mb-2 bg-[#0058bd] text-white px-6 pt-6 pb-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute top-4 right-16 w-20 h-20 rounded-full bg-white/5" />
        <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-white/70 mb-1 relative z-10">PROVA Admin</p>
        <h1 className="text-[24px] font-bold leading-8 tracking-[-0.01em] relative z-10">Good morning, Director</h1>
        <p className="text-[14px] text-white/80 mt-1 relative z-10">
          {isLoading ? 'Syncing live verification activity...' : 'Here is your live verification overview for today.'}
        </p>

        {/* Mobile summary chips */}
        <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
          <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Total Disbursed</p>
            <p className="text-[20px] font-bold text-white">{metrics[0].value}</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Pending</p>
            <p className="text-[20px] font-bold text-white">{metrics[1].value}</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Trust Score</p>
            <p className="text-[20px] font-bold text-white">{metrics[2].value}</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Programs</p>
            <p className="text-[20px] font-bold text-white">{metrics[3].value}</p>
          </div>
        </div>
      </div>

      {/* ── METRIC CARDS (desktop 4-col, hidden on mobile) ──────────── */}
      <section className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white p-3 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5] hover:border-[#0058bd] transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[12px] font-medium tracking-[0.05em] text-[#424753]">{m.label}</span>
              <m.icon className={`w-5 h-5 ${m.iconColor}`} />
            </div>
            <h3 className="text-[20px] font-medium leading-7 text-[#191b22]">{m.value}</h3>
            {m.badge ? (
              <span className={`text-[12px] px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${m.badgeBg}`}>
                {m.badge}
              </span>
            ) : (
              <p className={`text-[12px] font-medium tracking-[0.05em] mt-1 ${m.subColor}`}>{m.sub}</p>
            )}
          </div>
        ))}
      </section>

      {/* ── ANALYTICS BENTO ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Revenue Trends — 8 cols */}
        <section className="lg:col-span-8 bg-white p-6 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-[20px] font-medium leading-7 text-[#191b22]">Revenue Trends</h2>
              <p className="text-[14px] text-[#424753] mt-0.5">Financial growth trajectory over the past 6 months</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-[12px] font-bold bg-[#2771df] text-white rounded-lg">
                6 Months
              </button>
              <button className="px-3 py-1 text-[12px] text-[#424753] hover:bg-[#e7e7f1] rounded-lg transition-colors">
                1 Year
              </button>
            </div>
          </div>
          {/* Chart area */}
          <div className="h-52 border-b border-l border-[#c2c6d5] relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
              <span className="text-3xl font-bold uppercase tracking-widest">Financial Data</span>
            </div>
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              {/* Area fill */}
              <path
                d="M0,180 Q100,160 200,170 T400,120 T600,130 T800,60 T1000,40 L1000,200 L0,200 Z"
                fill="#0058bd"
                fillOpacity="0.06"
              />
              {/* Line */}
              <path
                d="M0,180 Q100,160 200,170 T400,120 T600,130 T800,60 T1000,40"
                fill="none"
                stroke="#0058bd"
                strokeLinecap="round"
                strokeWidth="3"
              />
              {[200, 400, 600, 800, 1000].map((cx, i) => {
                const cy = [170, 120, 130, 60, 40][i];
                return <circle key={cx} cx={cx} cy={cy} r="5" fill="#0058bd" />;
              })}
            </svg>
          </div>
          <div className="flex justify-between mt-3 text-[12px] text-[#424753] tracking-[0.05em] px-1">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </section>

        {/* Category Breakdown — 4 cols */}
        <section className="lg:col-span-4 bg-white p-6 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <h2 className="text-[20px] font-medium leading-7 text-[#191b22] mb-4">Category Breakdown</h2>
          <div className="flex flex-col items-center justify-center gap-6 py-2">
            {/* Fake donut ring */}
            <div className="relative w-36 h-36 rounded-full border-[14px] border-[#d8e2ff] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[14px] border-[#0058bd] border-t-transparent border-l-transparent rotate-45" />
              <div className="text-center">
                <p className="text-[20px] font-bold text-[#191b22]">82%</p>
                <p className="text-[12px] text-[#424753]">Top 3</p>
              </div>
            </div>
            <div className="w-full space-y-2">
              {[
                { label: 'Stipends', pct: '38%', color: 'bg-[#0058bd]' },
                { label: 'Scholarships', pct: '24%', color: 'bg-[#2771df]' },
                { label: 'Grants', pct: '20%', color: 'bg-[#e1e2eb]' },
                { label: 'Payroll', pct: '12%', color: 'bg-[#727785]' },
                { label: 'Vendor', pct: '6%', color: 'bg-[#c2c6d5]' },
              ].map(({ label, pct, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-[14px] text-[#191b22]">{label}</span>
                  </div>
                  <span className="text-[14px] font-bold text-[#191b22]">{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly Comparisons — full width */}
        <section className="lg:col-span-12 bg-white p-6 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[20px] font-medium leading-7 text-[#191b22]">Monthly Comparisons</h2>
              <p className="text-[14px] text-[#424753] mt-0.5">Institutional performance: Previous Year vs Current Year</p>
            </div>
            <div className="flex items-center gap-6 bg-[#f2f3fd] px-4 py-2 rounded-lg border border-[#c2c6d5]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#c2c6d5]" />
                <span className="text-[12px] font-medium text-[#424753]">Last Year</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#0058bd]" />
                <span className="text-[12px] font-medium text-[#424753]">This Year</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-3 items-end h-40 border-b border-[#c2c6d5]">
            {months.map((m) => (
              <div
                key={m.label}
                className={`flex flex-col items-center gap-1 ${m.desktop ? 'hidden md:flex' : 'flex'}`}
              >
                <div className="flex items-end gap-0.5 w-full h-28">
                  <div className="w-1/2 bg-[#c2c6d5] rounded-t-sm" style={{ height: m.prev }} />
                  <div className="w-1/2 bg-[#0058bd] rounded-t-sm" style={{ height: m.curr }} />
                </div>
                <span className="text-[12px] text-[#424753]">{m.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── VERIFICATION QUEUE ───────────────────────────────────────── */}
      <section className="bg-white p-6 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-[#c2c6d5]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-medium leading-7 text-[#191b22]">
            Recent Verification Queue
          </h2>
          <Link className="text-[#0058bd] font-bold text-[12px] tracking-[0.05em] hover:underline" to="/beneficiaries">
            View All Records
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-dashed border-[#c2c6d5] bg-[#f9f9ff] px-4 py-8 text-center text-[14px] text-[#424753]">
            Loading the latest verification queue from your live project...
          </div>
        ) : queue.length ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[12px] font-bold tracking-[0.05em] text-[#424753] border-b border-[#c2c6d5]">
                    <th className="pb-4">BENEFICIARY</th>
                    <th className="pb-4">TYPE</th>
                    <th className="pb-4">RISK LEVEL</th>
                    <th className="pb-4">SUBMITTED</th>
                    <th className="pb-4">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((row) => (
                    <tr key={row.id} className="border-b border-[#c2c6d5] hover:bg-[#f2f3fd] transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-[14px] text-[#191b22]">{row.name}</p>
                        <p className="text-[12px] text-[#424753] mt-0.5">Ref: {row.referenceId}</p>
                      </td>
                      <td className="py-4 text-[14px] text-[#424753]">{row.type}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${riskBadge[row.risk]}`}>
                          {row.risk} Risk
                        </span>
                      </td>
                      <td className="py-4 text-[14px] text-[#424753]">{row.time}</td>
                      <td className="py-4">
                        <Link
                          className="inline-flex px-3 py-1 bg-[#0058bd] text-white rounded-lg font-bold text-[11px] hover:opacity-90 transition-opacity"
                          to={`/status?applicationId=${row.id}`}
                        >
                          View Status
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col gap-3">
              {queue.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-[#c2c6d5] bg-[#f9f9ff]"
                >
                  <div>
                    <p className="font-bold text-[14px] text-[#191b22]">{row.name}</p>
                    <p className="text-[12px] text-[#424753] mt-0.5">{row.type} · {row.time}</p>
                    <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${riskBadge[row.risk]}`}>
                      {row.risk} Risk
                    </span>
                  </div>
                  <Link
                    className="px-4 py-2 bg-[#0058bd] text-white rounded-lg font-bold text-[12px] shrink-0 ml-3"
                    to={`/status?applicationId=${row.id}`}
                  >
                    Track
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-[#c2c6d5] bg-[#f9f9ff] px-4 py-8 text-center text-[14px] text-[#424753]">
            No beneficiary submissions exist yet. Use the onboarding flow to create the first live verification record.
          </div>
        )}
      </section>
    </>
  );
}