import { CircleDollarSign, History, LayoutDashboard, ShieldCheck, Users, Zap } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/beneficiaries', icon: Users, label: 'Ledger' },
  { to: '/verification-hub', icon: ShieldCheck, label: 'Review' },
  { to: '/disbursements', icon: CircleDollarSign, label: 'Payouts' },
  { to: '/audit-logs', icon: History, label: 'Audit' },
]

export function Sidebar() {
  return (
    <aside className="prova-panel fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-[260px] flex-col overflow-hidden rounded-[28px] md:flex">
      <div className="border-b border-white/8 px-5 py-5">
        <div className="prova-kicker mb-4 w-fit">
          <span className="h-2 w-2 rounded-full bg-[#ffb357]" />
          Live Demo
        </div>
        <div>
          <p className="font-display text-[2rem] font-semibold leading-none tracking-[-0.06em] text-white">PROVA</p>
          <p className="mt-2 text-sm text-[#d4c2a8]">Scholarship rail</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-5">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all ${
                isActive
                  ? 'border border-[#ffbf73]/30 bg-[linear-gradient(135deg,rgba(255,179,83,0.18),rgba(255,255,255,0.05))] text-white shadow-[0_12px_28px_rgba(255,153,0,0.12)]'
                  : 'border border-transparent text-[#cdbda6] hover:border-white/8 hover:bg-white/4 hover:text-white'
              }`
            }
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
              <Icon className="h-4.5 w-4.5" />
            </span>
            <p className="truncate text-sm font-semibold">{label}</p>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/8 px-4 py-5">
        <div className="prova-panel-muted rounded-[24px] px-4 py-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#ffbf73]/22 bg-[#ffb357]/10 text-[#ffd59f]">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.14em] text-[#998a76]">Rail Health</p>
              <p className="text-sm font-semibold text-white">Sandbox live</p>
            </div>
          </div>
          <p className="text-xs text-[#cdbda6]">Balance, transfer, requery</p>
        </div>
      </div>
    </aside>
  )
}
