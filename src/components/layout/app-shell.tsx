import type { PropsWithChildren } from 'react'
import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { BottomNav } from './bottom-nav'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="bg-[#f9f9ff] text-[#191b22] min-h-screen">
      {/* Sticky top navigation */}
      <TopNav />

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      {/* pt-16: clear the 64px topnav; md:ml-64: clear the 256px sidebar on desktop */}
      {/* pb-20: clear the 80px bottom nav on mobile */}
      <main className="pt-16 md:ml-64 min-h-screen">
        <div className="p-4 md:p-6 flex flex-col gap-6 pb-24 md:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  )
}