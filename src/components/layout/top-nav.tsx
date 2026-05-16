import { Bell, Search, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

interface TopNavProps {
  title?: string
}

export function TopNav({ title }: TopNavProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-4">
      <div className="prova-panel mx-auto flex h-16 max-w-[1600px] items-center justify-between rounded-[24px] px-4 md:ml-[280px] md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link to="/" className="md:hidden">
            <span className="font-display text-2xl font-semibold tracking-[-0.08em] text-white">PROVA</span>
          </Link>

          <div className="hidden min-w-0 md:block">
            <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">
              {title ?? 'Operator Console'}
            </p>
          </div>

          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#998a76]" />
            <input
              className="prova-input w-[320px] py-2.5 pl-10 pr-4 text-sm"
              placeholder="Search cases, refs, or payouts..."
              type="text"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <div className="prova-chip-warm hidden md:inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            Live demo
          </div>

          <button
            aria-label="Notifications"
            className="prova-button-secondary h-11 w-11 p-0"
            type="button"
          >
            <Bell className="h-4.5 w-4.5" />
          </button>

          <div className="flex items-center gap-3 rounded-full border border-white/8 bg-white/4 px-2 py-1.5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">Operator</p>
              <p className="font-label text-[10px] uppercase tracking-[0.14em] text-[#998a76]">Admin</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffbf73]/26 bg-[linear-gradient(135deg,rgba(255,191,115,0.22),rgba(255,255,255,0.02))] text-sm font-bold text-[#fff2dc]">
              PX
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
