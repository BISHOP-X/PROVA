import { LayoutDashboard, Users, CircleDollarSign, ShieldCheck, History } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/beneficiaries', icon: Users, label: 'Recipients' },
  { to: '/disbursements', icon: CircleDollarSign, label: 'Payouts' },
  { to: '/verification-hub', icon: ShieldCheck, label: 'Verify' },
  { to: '/audit-logs', icon: History, label: 'Audit' },
];

export function BottomNav() {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
      isActive ? 'text-[#0058bd]' : 'text-[#424753]'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#c2c6d5] md:hidden flex justify-around pt-2 pb-safe">
      {navItems.map(({ to, icon: Icon, label, end }) => (
        <NavLink key={to} to={to} className={getNavClass} end={end}>
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-bold leading-3">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
