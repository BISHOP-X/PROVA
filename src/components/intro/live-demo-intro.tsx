import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Building2, Users } from 'lucide-react'
import { useCallback } from 'react'

interface IntroDeckProps {
  onComplete: () => void
}

type SlideAccentItem = {
  label: string
  sub?: string
  tone?: string
  isCode?: boolean
  progress?: number
  iconType?: 'building' | 'users'
}

type Slide = {
  id: string
  eyebrow: string
  title: string
  description: string
  orbColor: string
  accent: SlideAccentItem[]
}

const slides: Slide[] = [
  {
    id: 'problem',
    eyebrow: '01 \u00b7 The Problem',
    title: 'Institutions release money before they can verify who should receive it.',
    description: 'That creates a two-sided risk \u2014 financial leakage for the institution, and an unfair delay for the real beneficiary.',
    orbColor: 'bg-[#ff9d2f]/18',
    accent: [
      { label: 'Duplicate IDs', sub: '14 flagged', tone: 'border-[#ffb86b]/28 bg-[#ff9d2f]/12 text-[#ffe2b4]' },
      { label: 'Bank Mismatches', sub: '09 active', tone: 'border-[#ffd28d]/24 bg-white/5 text-[#f4e4ca]' },
      { label: 'Review Delays', sub: '27 open', tone: 'border-white/12 bg-white/5 text-[#f4e4ca]' },
    ],
  },
  {
    id: 'users',
    eyebrow: '02 \u00b7 Who It Serves',
    title: 'Two groups are caught in the middle.',
    description: 'The finance team needs confidence before they can approve a payment. The student needs a process that is fast, visible, and fair.',
    orbColor: 'bg-[#ffb357]/16',
    accent: [
      { label: 'Institution', sub: 'Bursars & finance teams', tone: 'border-[#ffbf73]/28 bg-[#ff9d2f]/12 text-[#ffe2b4]', iconType: 'building' },
      { label: 'Beneficiary', sub: 'Students & fellows', tone: 'border-white/12 bg-white/5 text-[#f4e4ca]', iconType: 'users' },
    ],
  },
  {
    id: 'solution',
    eyebrow: '03 \u00b7 The Solution',
    title: 'PROVA verifies the beneficiary before the payout is approved.',
    description: 'It collects the details, checks the signals, and gives one clear decision. Nothing moves until trust is established.',
    orbColor: 'bg-[#ffb357]/16',
    accent: [
      { label: 'Approved', sub: 'Payment is released', tone: 'border-[#92f0bb]/24 bg-[#136e39]/16 text-[#bff6d5]' },
      { label: 'Review', sub: 'Routed to the team', tone: 'border-[#ffbf73]/28 bg-[#ff9d2f]/12 text-[#ffe2b4]' },
      { label: 'Rejected', sub: 'Payout is blocked', tone: 'border-[#ff8b8b]/24 bg-[#4c1717]/72 text-[#ffb4ab]' },
    ],
  },
  {
    id: 'squad',
    eyebrow: '04 \u00b7 Squad Integration',
    title: 'When a beneficiary is cleared, Squad handles the rest.',
    description: 'We use Squad to confirm the destination account, trigger the transfer, and track the payout after release. Squad is the payment rail, not an afterthought.',
    orbColor: 'bg-[#ffb357]/16',
    accent: [
      { label: 'account/lookup', sub: 'Confirm destination', tone: 'border-[#ffbf73]/28 bg-[#ff9d2f]/12 text-[#ffe2b4]', isCode: true },
      { label: 'payout/transfer', sub: 'Release approved funds', tone: 'border-[#ffd28d]/24 bg-white/5 text-[#f4e4ca]', isCode: true },
      { label: 'payout/requery', sub: 'Track completion', tone: 'border-white/12 bg-white/5 text-[#f4e4ca]', isCode: true },
      { label: 'merchant/balance', sub: 'Check balance state', tone: 'border-white/10 bg-white/4 text-[#cabaa3]', isCode: true },
    ],
  },
  {
    id: 'ai',
    eyebrow: '05 \u00b7 AI Intelligence',
    title: 'The trust decision is explainable, not a black box.',
    description: 'Liveness, face match, document verification, and payout risk are scored together and combined into one trust score \u2014 with the reason shown on screen.',
    orbColor: 'bg-[#ffb357]/16',
    accent: [
      { label: 'Liveness check', sub: '82', tone: 'border-white/12 bg-white/5 text-[#f4e4ca]', progress: 82 },
      { label: 'Face match', sub: '91', tone: 'border-[#92f0bb]/24 bg-[#136e39]/16 text-[#bff6d5]', progress: 91 },
      { label: 'Document scan', sub: '87', tone: 'border-[#ffd28d]/24 bg-white/5 text-[#f4e4ca]', progress: 87 },
      { label: 'Payout risk', sub: '72', tone: 'border-[#ffbf73]/28 bg-[#ff9d2f]/12 text-[#ffe2b4]', progress: 72 },
    ],
  },
  {
    id: 'handoff',
    eyebrow: '06 \u00b7 Live Demo',
    title: 'The full product is running right now.',
    description: 'You are about to see the dashboard, a live beneficiary submission, the trust decision, and the Squad payout state \u2014 end to end.',
    orbColor: 'bg-[#ffb357]/16',
    accent: [],
  },
]

function ProblemVisual() {
  return (
    <div className="intro-scene-panel relative h-[360px] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#ffb357]/12 blur-3xl" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/30">Payout leaves first</p>

      {/* "TRUST PENDING" badge — top-right, fixed position */}
      <div className="intro-scene-alert absolute right-6 top-14 rounded-full border border-rose-300/30 bg-rose-300/14 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200">
        Trust Pending
      </div>

      {/* Institution card — bottom-left */}
      <div className="intro-scene-card absolute bottom-8 left-6 w-[168px] rounded-[22px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.32)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ffb357]/14 text-[#ffd59f]">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">Institution</p>
            <p className="mt-0.5 truncate text-[13px] font-semibold text-white/90">Funds scheduled</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/8 bg-white/5 px-2 py-1.5 text-center text-[11px] text-white/55">Batch A</div>
          <div className="rounded-xl border border-white/8 bg-white/5 px-2 py-1.5 text-center text-[11px] text-white/55">9:00 AM</div>
        </div>
      </div>

      {/* Straight horizontal flow rail between the two cards */}
      {/* Rail sits at y=248 (bottom card center), from x=174 to x=254 */}
      <div className="absolute left-[174px] top-[236px] h-px w-[68px] overflow-hidden bg-white/10">
        <div className="intro-scene-flow h-full w-12 bg-linear-to-r from-transparent via-amber-300/80 to-transparent" />
      </div>
      {/* Animated coin along the rail */}
      {[0, 0.9, 1.8].map((delay, i) => (
        <span
          key={i}
          className="intro-scene-coin absolute left-[174px] top-[229px] h-3 w-3 rounded-full border border-amber-100/70 bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.55)]"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}

      {/* Payout Queue card — bottom-right */}
      <div className="intro-scene-card intro-scene-float-delayed absolute bottom-8 right-6 w-[148px] rounded-[22px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.32)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">Payout Queue</p>
        <p className="mt-2 text-[12px] font-semibold leading-5 text-white/88">Release is already in motion.</p>
        <div className="mt-3 h-1 rounded-full bg-white/10">
          <div className="h-full w-[60%] rounded-full bg-linear-to-r from-[#ffb357] to-[#ffd59f]" />
        </div>
      </div>
    </div>
  )
}

function UsersVisual() {
  return (
    <div className="intro-scene-panel relative h-[360px] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
      <div className="absolute -left-8 top-6 h-40 w-40 rounded-full bg-[#ffb357]/12 blur-3xl" />
      <div className="absolute -right-8 bottom-6 h-40 w-40 rounded-full bg-[#ffd59f]/10 blur-3xl" />

      {/* Institution card — top-left */}
      <div className="intro-scene-card absolute left-6 top-14 w-[168px] rounded-[22px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.32)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ffb357]/14 text-[#ffd59f]">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">Institution</p>
            <p className="mt-0.5 truncate text-[13px] font-semibold text-white/90">Needs certainty</p>
          </div>
        </div>
      </div>

      {/* Beneficiary card — bottom-right */}
      <div className="intro-scene-card absolute bottom-14 right-6 w-[168px] rounded-[22px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.32)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0d6]/10 text-[#f6dfb6]">
            <Users className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">Beneficiary</p>
            <p className="mt-0.5 truncate text-[13px] font-semibold text-white/90">Needs clarity</p>
          </div>
        </div>
      </div>

      {/* "Trust Gap" badge centred between the two cards */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-full border border-white/10 bg-white/7 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 shadow-[0_8px_28px_rgba(0,0,0,0.22)]">
          Trust Gap
        </div>
      </div>

      {/* Straight diagonal line from institution card to trust-gap badge */}
      {/* Using SVG for exact straight diagonals */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {/* Institution card bottom-center  → badge top */}
        <line x1="110" y1="142" x2="210" y2="174" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* Badge bottom → Beneficiary card top-center */}
        <line x1="210" y1="192" x2="310" y2="224" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* Animated flow on top */}
        <line x1="110" y1="142" x2="210" y2="174" stroke="rgba(255,191,115,0.0)" strokeWidth="1">
          <animate attributeName="stroke-opacity" values="0;0.5;0" dur="2.4s" repeatCount="indefinite" />
        </line>
        <line x1="210" y1="192" x2="310" y2="224" stroke="rgba(255,213,159,0.0)" strokeWidth="1">
          <animate attributeName="stroke-opacity" values="0;0.5;0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  )
}

function SolutionVisual() {
  const steps = [
    { label: 'Submit', note: 'Details captured', active: true },
    { label: 'Verify', note: 'Signals checked', active: false },
    { label: 'Release', note: 'Only approved funds move', active: false },
  ]

  return (
    <div className="intro-scene-panel relative h-[360px] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
      <div className="absolute -left-6 top-0 h-40 w-40 rounded-full bg-[#ffb357]/12 blur-3xl" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/30">One clear trust path</p>

      {/* "Trusted Case" badge — top-right, fixed */}
      <div className="absolute right-6 top-14">
        <div className="rounded-[20px] border border-emerald-300/26 bg-emerald-300/14 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200 shadow-[0_8px_28px_rgba(16,185,129,0.14)]">
          Trusted Case
        </div>
        <div className="mt-1.5 ml-1 rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[10px] text-white/42">
          Details captured
        </div>
      </div>

      {/* Vertical timeline rail */}
      <div className="absolute left-10 top-[106px] h-[184px] w-px bg-white/10" />
      {/* Animated dot travelling down the rail */}
      <span className="intro-scene-dot absolute left-[36px] top-[106px] h-3.5 w-3.5 rounded-full border border-emerald-200/60 bg-emerald-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]" />

      {/* Step cards — left-aligned after the timeline */}
      <div className="absolute top-[100px] left-[58px] right-6 flex flex-col gap-3">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="intro-scene-step intro-scene-card flex items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-slate-950/60 px-4 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
            style={{ animationDelay: `${index * 0.7}s` }}
          >
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/36">Step 0{index + 1}</p>
              <p className="mt-0.5 text-[13px] font-semibold text-white/90">{step.label}</p>
            </div>
            <div className="shrink-0 rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] text-white/45">
              {step.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SquadVisual() {
  // Rail node positions — evenly spaced at x=60, 186, 312 on a 360px wide card (24px padding each side = 312px usable)
  const nodes = [
    { label: 'Lookup', x: 60 },
    { label: 'Transfer', x: 186 },
    { label: 'Requery', x: 312 },
  ]
  const railY = 232 // pixel y of the rail line
  const dotY = railY - 9 // center dot on rail

  return (
    <div className="intro-scene-panel relative h-[360px] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#ffb357]/12 blur-3xl" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/30">Squad payment rail</p>

      {/* account/lookup card — top-left */}
      <div className="intro-scene-card absolute left-6 top-14 w-[152px] rounded-[22px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.32)]">
        <p className="font-mono text-[11px] font-semibold text-[#ffd59f]">account/lookup</p>
        <p className="mt-2 text-[11px] leading-[18px] text-white/45">Confirm the destination before money moves.</p>
      </div>

      {/* payout/requery card — bottom-right */}
      <div className="intro-scene-card absolute bottom-8 right-6 w-[152px] rounded-[22px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.32)]">
        <p className="font-mono text-[11px] font-semibold text-[#f7e1bc]">payout/requery</p>
        <p className="mt-2 text-[11px] leading-[18px] text-white/45">Track the final payout state after transfer.</p>
      </div>

      {/* Rail — perfectly horizontal, pixel-exact */}
      <div
        className="absolute h-px bg-white/10"
        style={{ top: railY, left: nodes[0].x, width: nodes[2].x - nodes[0].x }}
      />

      {/* Nodes */}
      {nodes.map((node, i) => (
        <div key={node.label} className="absolute" style={{ top: dotY, left: node.x - 9 }}>
          <span
            className="intro-scene-node block h-[18px] w-[18px] rounded-full border border-white/18 bg-slate-950/80"
            style={{ animationDelay: `${i * 0.8}s` }}
          />
          <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40" style={{ marginLeft: -14, width: 46 }}>
            {node.label}
          </p>
        </div>
      ))}

      {/* Animated rail token */}
      <span
        className="intro-scene-rail-token absolute h-[18px] w-[18px] rounded-full border border-[#ffd59f]/70 bg-[#ffb357] shadow-[0_0_20px_rgba(255,179,87,0.5)]"
        style={{ top: dotY, left: nodes[0].x - 9 }}
      />
    </div>
  )
}

function AiVisual() {
  const signals = [
    { label: 'Liveness', width: '78%', delay: '0s', tone: 'bg-[#ffd59f]/85' },
    { label: 'Face Match', width: '91%', delay: '0.25s', tone: 'bg-[#bff6d5]/85' },
    { label: 'Document', width: '85%', delay: '0.5s', tone: 'bg-[#ffbf73]/82' },
    { label: 'Risk', width: '70%', delay: '0.75s', tone: 'bg-[#ff9d2f]/82' },
  ]

  return (
    <div className="intro-scene-panel relative h-[360px] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 p-5 shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
      {/* Centre glow */}
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb357]/10 blur-3xl" />

      {/* 2×2 signal grid — fills the whole card */}
      <div className="grid h-full grid-cols-2 gap-3">
        {signals.map((signal) => (
          <div
            key={signal.label}
            className="intro-scene-card flex flex-col justify-between rounded-[22px] border border-white/10 bg-slate-950/60 p-4 shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">{signal.label}</p>
            <div className="mt-auto h-1 rounded-full bg-white/10">
              <div
                className={`intro-scene-meter-fill h-full rounded-full ${signal.tone}`}
                style={{ width: signal.width, animationDelay: signal.delay }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Central trust score — sits on top of the grid */}
      <div className="intro-scene-score pointer-events-none absolute left-1/2 top-1/2 flex h-[126px] w-[126px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/12 bg-slate-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.44)] backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Trust</p>
        <p className="mt-1 text-[38px] font-semibold leading-none tracking-[-0.03em] text-white">84</p>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">Approved</p>
      </div>
    </div>
  )
}

function HandoffVisual() {
  const lines = [
    { width: '64%', delay: '0s' },
    { width: '80%', delay: '0.5s' },
    { width: '52%', delay: '1.0s' },
  ]

  return (
    <div className="intro-scene-panel relative h-[360px] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 p-5 shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
      {/* Inner app window */}
      <div className="h-full rounded-[24px] border border-white/10 bg-slate-950/60 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.32)]">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>

        {/* Typing lines */}
        <div className="mt-6 space-y-2.5">
          {lines.map((line, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className="h-3 overflow-hidden rounded-full bg-white/6" style={{ width: line.width }}>
                <div
                  className="intro-scene-type-line h-full rounded-full bg-linear-to-r from-[#ffd59f] to-[#ffb357]"
                  style={{ animationDelay: line.delay }}
                />
              </div>
              {index === lines.length - 1 && (
                <span className="intro-scene-caret h-3 w-0.5 rounded-full bg-[#ffd59f]" />
              )}
            </div>
          ))}
        </div>

        {/* Status cards */}
        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-white/8 bg-white/5 p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/38">Dashboard</p>
            <p className="mt-1.5 text-[12px] leading-[18px] text-white/82">Queue and program view loaded.</p>
          </div>
          <div className="relative rounded-[18px] border border-white/8 bg-white/5 p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/38">Payout State</p>
            <p className="mt-1.5 text-[12px] leading-[18px] text-white/82">Live Squad status ready.</p>
            <div className="intro-scene-ready absolute bottom-3 right-3 rounded-full border border-emerald-300/26 bg-emerald-300/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">
              Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderVisual(id: Slide['id']) {
  switch (id) {
    case 'problem':
      return <ProblemVisual />
    case 'users':
      return <UsersVisual />
    case 'solution':
      return <SolutionVisual />
    case 'squad':
      return <SquadVisual />
    case 'ai':
      return <AiVisual />
    case 'handoff':
      return <HandoffVisual />
    default:
      return null
  }
}

export function IntroDeck({ onComplete }: IntroDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [transitioning, setTransitioning] = useState(false)
  const [closing, setClosing] = useState(false)
  const t1 = useRef<number | null>(null)
  const t2 = useRef<number | null>(null)
  const t3 = useRef<number | null>(null)
  const keyFns = useRef({ advance: () => {}, retreat: () => {}, complete: () => {} })

  const slide = slides[activeIndex]
  const isLast = activeIndex === slides.length - 1

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      document.documentElement.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName ?? ''
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); keyFns.current.advance() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); keyFns.current.retreat() }
      if (e.key === 'Escape') { e.preventDefault(); keyFns.current.complete() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => () => { [t1, t2, t3].forEach(r => r.current !== null && clearTimeout(r.current)) }, [])

  const complete = useCallback(() => {
    if (closing) return
    setClosing(true)
    t3.current = window.setTimeout(onComplete, 480)
  }, [closing, onComplete])

  const go = useCallback((next: number) => {
    if (transitioning || closing || next === activeIndex || next < 0 || next >= slides.length) return
    setDirection(next > activeIndex ? 1 : -1)
    setTransitioning(true)
    setVisible(false)
    t1.current = window.setTimeout(() => {
      setActiveIndex(next)
      t2.current = window.setTimeout(() => { setVisible(true); setTransitioning(false) }, 30)
    }, 200)
  }, [activeIndex, closing, transitioning])

  const advance = useCallback(() => {
    if (isLast) {
      complete()
      return
    }

    go(activeIndex + 1)
  }, [activeIndex, complete, go, isLast])

  const retreat = useCallback(() => { go(activeIndex - 1) }, [activeIndex, go])

  useEffect(() => {
    keyFns.current = { advance, retreat, complete }
  }, [activeIndex, advance, closing, complete, isLast, onComplete, retreat, transitioning])

  const tx = visible
    ? 'translate-x-0 opacity-100'
    : direction === 1 ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0'

  function renderAccent() {
    if (slide.id === 'handoff') {
      return (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-[#92f0bb]/24 bg-[#136e39]/16 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-semibold text-[#bff6d5]">Live and connected</span>
          </div>
          <button
            className="prova-button-primary flex items-center gap-2 px-7 py-3.5 text-sm font-bold transition hover:scale-105 active:scale-100"
            onClick={complete}
            type="button"
          >
            Enter the live app
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )
    }

    if (slide.id === 'ai') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {slide.accent.map(item => (
            <div key={item.label} className={`rounded-2xl border px-4 py-3 ${item.tone}`}>
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold leading-tight">{item.label}</span>
                <span className="font-mono text-[11px] opacity-70">{item.sub}%</span>
              </div>
              <div className="mt-2.5 h-[3px] rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white/55 transition-all duration-700"
                  style={{ width: `${item.progress ?? 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (slide.id === 'squad') {
      return (
        <div className="grid grid-cols-2 gap-2">
          {slide.accent.map(item => (
            <div key={item.label} className={`rounded-2xl border px-3 py-3 ${item.tone}`}>
              <p className="font-mono text-[11px] font-semibold leading-tight">{item.label}</p>
              {item.sub && <p className="mt-1.5 text-[11px] leading-snug opacity-50">{item.sub}</p>}
            </div>
          ))}
        </div>
      )
    }

    if (slide.id === 'users') {
      return (
        <div className="flex flex-wrap gap-3">
          {slide.accent.map(item => (
            <div key={item.label} className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 ${item.tone}`}>
              <div className="rounded-xl bg-white/10 p-2">
                {item.iconType === 'building'
                  ? <Building2 className="h-4 w-4" />
                  : <Users className="h-4 w-4" />
                }
              </div>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                {item.sub && <p className="mt-0.5 text-xs opacity-60">{item.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="flex flex-wrap gap-3">
        {slide.accent.map(item => (
          <div key={item.label} className={`rounded-2xl border px-5 py-3 ${item.tone}`}>
            <p className="text-sm font-semibold">{item.label}</p>
            {item.sub && <p className="mt-0.5 text-xs opacity-60">{item.sub}</p>}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      aria-label="PROVA intro"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex flex-col overflow-hidden text-white transition-opacity duration-500 ${closing ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
    >
      <div className="absolute inset-0 bg-[#090807]" />
      <div
        className={`pointer-events-none absolute -left-32 -top-16 h-[500px] w-[500px] rounded-full blur-[140px] transition-all duration-700 ${slide.orbColor}`}
      />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#ff9d2f]/10 blur-3xl" />

      <div className="absolute top-0 left-0 z-20 h-px w-full bg-white/6">
        <div
          className="h-full bg-[#ffb357] transition-all duration-500"
          style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
        />
      </div>

      <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 px-6 pb-4 pt-6 md:px-12">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#ffbf73]/28 bg-[#ff9d2f]/12 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffd59f]">
            PROVA
          </span>
          <span className="hidden text-[10px] uppercase tracking-widest text-white/25 sm:block">Demo flow</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] tabular-nums text-white/25">{activeIndex + 1} / {slides.length}</span>
          <button
            className="rounded-full border border-white/8 bg-white/5 px-4 py-1.5 text-[11px] font-medium text-white/40 transition hover:bg-white/10 hover:text-white/70"
            onClick={complete}
            type="button"
          >
            Skip
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center overflow-hidden px-6 pb-6 md:px-12">
        <div className={`mx-auto grid w-full max-w-7xl items-center gap-10 overflow-hidden transition-all duration-200 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:gap-16 ${tx}`}>
          <div className="min-w-0 max-w-2xl lg:pr-4 xl:max-w-[620px]">
            <div className="flex flex-col gap-7">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a06a]/70">
                {slide.eyebrow}
              </span>

              <h1 className="font-display text-[1.9rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white md:text-[3.45rem]">
                {slide.title}
              </h1>

              <p className="max-w-xl text-[0.98rem] leading-[1.9] text-[#d5c7b1]">
                {slide.description}
              </p>

              {renderAccent()}
            </div>
          </div>

          <aside aria-hidden="true" className="pointer-events-none hidden lg:flex lg:justify-end">
            {renderVisual(slide.id)}
          </aside>
        </div>
      </main>

      <footer className="relative z-20 flex shrink-0 items-center justify-between gap-4 border-t border-white/5 px-6 py-4 md:px-12">
        <div className="flex items-center gap-2.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'h-1.5 w-7 bg-white'
                  : i < activeIndex
                    ? 'h-1.5 w-1.5 bg-white/35'
                    : 'h-1.5 w-1.5 bg-white/12'
              }`}
              onClick={() => go(i)}
              type="button"
            />
          ))}
          <span className="ml-2 hidden items-center gap-1.5 text-[10px] text-white/20 sm:flex">
            <kbd className="rounded border border-white/8 bg-white/5 px-1.5 py-0.5 font-sans text-[10px] text-white/30">
              &#8629;
            </kbd>
            advance
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
            disabled={activeIndex === 0 || transitioning}
            onClick={retreat}
            type="button"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <button
            className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-[#fff1db] active:scale-95 disabled:opacity-50"
            disabled={transitioning || closing}
            onClick={advance}
            type="button"
          >
            {isLast ? 'Enter app' : 'Next'}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>
    </div>
  )
}
