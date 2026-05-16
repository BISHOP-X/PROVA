import type { PropsWithChildren } from 'react'
import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { BottomNav } from './bottom-nav'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="prova-shell min-h-screen text-[#f7efe2]">
      <TopNav />
      <Sidebar />
      <main className="relative min-h-screen pt-20 md:ml-[280px]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 pb-24 md:px-6 md:pb-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
