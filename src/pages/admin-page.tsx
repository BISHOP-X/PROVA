import { useNavigate } from 'react-router-dom';

export function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-6 px-8 pb-12 min-h-screen bg-surface text-on-surface">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-on-surface">PROVA System Overview</h1>
        <p className="text-sm text-on-surface-variant">Real-time status of verification engines and financial disbursements.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-10">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm border border-outline-variant p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  System Operational
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs text-on-surface-variant">Last pulse: 2s ago</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Disbursement Velocity</h3>
            <p className="text-on-surface-variant mb-6 max-w-md">Processing throughput has increased by 14% since the last epoch. AI verification clusters are operating at 99.8% precision.</p>
            <div className="flex gap-12">
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Total Verified</p>
                <p className="text-2xl font-black text-primary">$4,281,090</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1 font-bold">Pending Sync</p>
                <p className="text-2xl font-black text-tertiary">284 Items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-primary-container text-on-primary-container rounded-xl p-6 shadow-md relative overflow-hidden">
          <h3 className="text-xl font-bold mb-4">Verification Queue</h3>
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <span className="text-xs font-bold">Priority Tier 1</span>
              <span className="text-xs bg-white text-primary px-2 py-0.5 rounded font-bold">12 Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-xs">Identity Check</span>
              <span className="text-xs">94.2% Success</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-xs">AML Screening</span>
              <span className="text-xs text-error-container">3 Flags</span>
            </div>
          </div>
          <button className="mt-6 w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-surface transition-colors shadow-sm">Manage Queue</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6 bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">memory</span>
            </div>
            <span className="font-bold">System Metrics</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">24.8%</span>
            <div className="flex gap-1 h-8 items-end">
              <div className="w-2 h-4 bg-primary/20 rounded-t"></div>
              <div className="w-2 h-6 bg-primary/20 rounded-t"></div>
              <div className="w-2 h-3 bg-primary/20 rounded-t"></div>
              <div className="w-2 h-5 bg-primary/60 rounded-t"></div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">database</span>
            </div>
            <span className="font-bold">IO PS</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">1.2k/s</span>
            <span className="text-xs text-emerald-600 font-bold">Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
