import { LayoutDashboard, Users, CircleDollarSign, ShieldCheck, History } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/beneficiaries', icon: Users, label: 'Beneficiaries' },
  { to: '/admin/disbursements', icon: CircleDollarSign, label: 'Disbursements' },
  { to: '/verification-hub', icon: ShieldCheck, label: 'Verification Hub' },
  { to: '/admin/audit', icon: History, label: 'Audit Logs' },
];

export function Sidebar() {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
      isActive
        ? 'bg-[#2771df] text-white font-bold'
        : 'text-[#454748] hover:bg-[#e1e2eb]'
    }`;

  return (
    /* Desktop sidebar — hidden on mobile */
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-[#f9f9ff] border-r border-[#c2c6d5] hidden md:flex flex-col pt-16">
      <nav className="flex flex-col gap-1 px-4 py-4">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} className={getNavClass} end={end}>
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-[12px] tracking-[0.05em] font-medium leading-4">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* System Status card at bottom */}
      <div className="mt-auto px-4 pb-8">
        <div className="p-4 bg-[#f2f3fd] rounded-xl border border-[#c2c6d5]">
          <p className="text-[12px] font-bold text-[#0058bd] mb-1 tracking-wide">System Status</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[14px] text-[#424753]">All Engines Operational</span>
          </div>
          <button className="w-full py-2 bg-[#0058bd] text-white text-[12px] rounded-lg font-bold tracking-wide hover:opacity-90 transition-opacity">
            Support Hub
          </button>
        </div>
      </div>
    </aside>
  );
}
