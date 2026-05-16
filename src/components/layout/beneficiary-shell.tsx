import type { ReactNode } from 'react'
import { ArrowLeft, LogOut, Shield } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface BeneficiaryShellProps {
  children: ReactNode
}

export function BeneficiaryShell({ children }: BeneficiaryShellProps) {
  const location = useLocation()
  const isOnboarding = location.pathname.includes('/onboarding')

  return (
    <div className="prova-shell min-h-screen text-[#f7efe2]">
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6">
        <div className="prova-panel mx-auto flex h-16 max-w-[1600px] items-center justify-between rounded-[24px] px-4 md:px-6">
          <Link className="flex items-center gap-3" to="/status">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ffbf73]/22 bg-[#ffb357]/10 text-[#ffd59f]">
              <Shield className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-display text-[1.8rem] font-semibold leading-none tracking-[-0.08em] text-white">PROVA</p>
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-[#998a76]">Beneficiary portal</p>
            </div>
          </Link>

          {isOnboarding ? (
            <Link className="prova-button-secondary px-4 py-2.5 text-xs font-bold" to="/status">
              <ArrowLeft className="h-4 w-4" />
              Cancel onboarding
            </Link>
          ) : (
            <Link className="prova-button-secondary px-4 py-2.5 text-xs font-bold" to="/">
              <LogOut className="h-4 w-4" />
              Exit portal
            </Link>
          )}
        </div>
      </header>

      <main className="relative min-h-screen pt-24">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 pb-12 md:px-6">
          {children}
        </div>
      </main>
    </div>
  )
}
