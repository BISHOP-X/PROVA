import { CircleDollarSign, History, LayoutDashboard, ShieldCheck, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/beneficiaries', icon: Users, label: 'Ledger' },
  { to: '/verification-hub', icon: ShieldCheck, label: 'Review' },
  { to: '/disbursements', icon: CircleDollarSign, label: 'Rail' },
  { to: '/audit-logs', icon: History, label: 'Audit' },
]

export function BottomNav() {
  return (
    <nav className="prova-panel fixed bottom-3 left-3 right-3 z-50 flex justify-around rounded-[24px] px-2 py-2 md:hidden">
      {navItems.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex min-w-[60px] flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-all ${
              isActive
                ? 'bg-[linear-gradient(135deg,rgba(255,179,83,0.18),rgba(255,255,255,0.04))] text-white'
                : 'text-[#998a76]'
            }`
          }
        >
          <Icon className="h-4.5 w-4.5" />
          <span className="font-label text-[10px] uppercase tracking-[0.12em]">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
