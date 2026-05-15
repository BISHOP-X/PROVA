import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Bot,
  Braces,
  Building2,
  CheckCircle2,
  Clock3,
  Fingerprint,
  History,
  Lock,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'

interface IntroDeckProps {
  onComplete: () => void
}

type Slide = {
  id: string
  eyebrow: string
  title: string
  description: string
  spotlight: string
  bullets: string[]
}

const slides: Slide[] = [
  {
    id: 'problem',
    eyebrow: 'Challenge 01 · Proof of Life',
    title: 'Scholarship money still moves before trust is established.',
    description:
      'Institutions often release stipends and scholarships before they have a defensible answer to one basic question: is this really the right beneficiary?',
    spotlight: 'Fraud is not only a verification problem. It is a payout design problem.',
    bullets: [
      'Duplicate identities, fake beneficiaries, and weak manual review create payout leakage.',
      'Wrong bank details and rushed approvals turn operational mistakes into real financial loss.',
      'Teams need a clear trust decision before money touches the payout rail.',
    ],
  },
  {
    id: 'users',
    eyebrow: 'Target Users',
    title: 'Built for the teams carrying the risk and the people waiting on the money.',
    description:
      'PROVA is designed for bursars, scholarship boards, finance operations teams, and program administrators, while keeping the beneficiary experience simple enough for students and trainees.',
    spotlight: 'The product has to protect institutions without punishing legitimate recipients.',
    bullets: [
      'Institutional operators need confidence, speed, and an audit trail.',
      'Beneficiaries need a clean submission flow and transparent status visibility.',
      'Both sides lose when trust decisions are delayed, inconsistent, or invisible.',
    ],
  },
  {
    id: 'solution',
    eyebrow: 'Solution Overview',
    title: 'PROVA verifies first, decides clearly, and only then lets funds move.',
    description:
      'Instead of paying first and investigating later, PROVA evaluates the beneficiary, produces an interpretable trust outcome, and routes the payout accordingly.',
    spotlight: 'One workflow. Three clear outcomes: approved, review, rejected.',
    bullets: [
      'Beneficiaries submit identity and payout details once.',
      'PROVA turns verification signals into a trust decision the operator can actually act on.',
      'Approved cases continue to payout while risky cases stay controlled.',
    ],
  },
  {
    id: 'ai',
    eyebrow: 'AI / Data Intelligence',
    title: 'The intelligence layer is interpretable, multi-signal, and built for action.',
    description:
      'PROVA does not rely on vague AI theatre. It combines liveness, face match, document signals, and payout-risk indicators into a trust score, reason codes, and a decision that can be defended.',
    spotlight: 'Judges should see explainability, not mystery.',
    bullets: [
      'Liveness checks help separate a real person from replay or spoof attempts.',
      'Face and document signals strengthen identity confidence before payout.',
      'Reason codes make manual review faster and far easier to justify.',
    ],
  },
  {
    id: 'squad',
    eyebrow: 'Squad API Integration',
    title: 'Squad is the execution rail that turns a verified decision into a real payout.',
    description:
      'The money movement layer is not decorative in PROVA. Account lookup, transfer, requery, and balance visibility are part of the live story we are about to show.',
    spotlight: 'No verified decision, no payout. No payout without Squad in the loop.',
    bullets: [
      'Account lookup confirms that the destination details are valid before release.',
      'Transfer sends approved payouts through a real payment rail.',
      'Requery and balance visibility keep the operator informed after execution.',
    ],
  },
  {
    id: 'handoff',
    eyebrow: 'Live Demo Handoff',
    title: 'Now we show the product in motion.',
    description:
      'You have seen the problem, the trust engine, and the payout rail. The live app now takes over so we can walk through the beneficiary flow, the dashboard, the decisions, and the payout state changes.',
    spotlight: 'Press Enter and move straight into the live dashboard.',
    bullets: [
      'Create and review live beneficiary records.',
      'See approved, review, and rejected outcomes on-screen.',
      'Show how PROVA hands trusted cases into the payout workflow.',
    ],
  },
]

function ProblemVisual() {
  return (
    <div className="grid h-full gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[28px] border border-white/12 bg-white/8 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/80">Payout Risk Snapshot</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Funds scheduled, trust unresolved</h3>
          </div>
          <span className="rounded-full border border-amber-300/30 bg-amber-300/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100">
            manual review strain
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: AlertTriangle,
              label: 'Duplicate Records',
              value: '14',
              tone: 'from-rose-500/30 to-rose-300/10',
            },
            {
              icon: Lock,
              label: 'Bank Detail Mismatch',
              value: '09',
              tone: 'from-amber-400/30 to-amber-200/10',
            },
            {
              icon: History,
              label: 'Delayed Review Cases',
              value: '27',
              tone: 'from-sky-400/30 to-sky-200/10',
            },
          ].map(({ icon: Icon, label, value, tone }) => (
            <div key={label} className={`rounded-3xl border border-white/10 bg-linear-to-br ${tone} p-4`}>
              <div className="flex items-center justify-between text-white/80">
                <Icon className="h-5 w-5" />
                <span className="font-mono text-xs">LIVE</span>
              </div>
              <p className="mt-6 text-4xl font-semibold tracking-tight text-white">{value}</p>
              <p className="mt-2 text-sm text-slate-200">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-3xl border border-rose-300/20 bg-rose-300/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-100/80">Why This Matters</p>
              <p className="mt-2 text-lg font-medium text-white">Every weak verification step becomes a payout liability.</p>
            </div>
            <AlertTriangle className="h-9 w-9 text-rose-200" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {[
          'Fake beneficiaries pass through manual spreadsheets.',
          'Incorrect payout routing is only discovered after the transfer stage.',
          'Operators lack one clear trust signal before they pay.',
        ].map((item, index) => (
          <div key={item} className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100/70">Leak Point 0{index + 1}</p>
            <p className="mt-3 text-lg leading-7 text-white">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsersVisual() {
  return (
    <div className="grid h-full gap-4 lg:grid-cols-[1fr_0.92fr]">
      <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100/80">Institutional Operator</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Bursars, scholarship boards, and finance operations</h3>
          </div>
          <div className="rounded-2xl bg-blue-300/16 p-3 text-blue-100">
            <Building2 className="h-8 w-8" />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {['Need a defensible approval path', 'Need faster review on risky cases', 'Need a reliable audit trail after payout'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/28 px-4 py-3 text-sm text-slate-100">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100/80">Beneficiary</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Students, fellows, and trainees waiting on disbursement</h3>
            </div>
            <div className="rounded-2xl bg-emerald-300/12 p-3 text-emerald-100">
              <Users className="h-8 w-8" />
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {['Need a smooth submission flow', 'Need visibility into status, not silence', 'Need payouts to arrive without avoidable delays'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/28 px-4 py-3 text-sm text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/80">Product Principle</p>
          <p className="mt-3 text-lg leading-8 text-white">
            Protect the institution without creating a hostile experience for the legitimate beneficiary.
          </p>
        </div>
      </div>
    </div>
  )
}

function SolutionVisual() {
  return (
    <div className="grid h-full gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Decision Outcomes</p>
        <div className="mt-5 space-y-3">
          {[
            {
              icon: CheckCircle2,
              label: 'approved',
              tone: 'border-emerald-300/30 bg-emerald-300/12 text-emerald-100',
              note: 'Safe to continue to payout',
            },
            {
              icon: Clock3,
              label: 'review',
              tone: 'border-amber-300/30 bg-amber-300/12 text-amber-100',
              note: 'Needs a human decision',
            },
            {
              icon: AlertTriangle,
              label: 'rejected',
              tone: 'border-rose-300/30 bg-rose-300/12 text-rose-100',
              note: 'Stop the payout flow',
            },
          ].map(({ icon: Icon, label, tone, note }) => (
            <div key={label} className={`rounded-[22px] border px-4 py-4 ${tone}`}>
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="text-base font-semibold uppercase tracking-[0.14em]">{label}</span>
              </div>
              <p className="mt-2 text-sm opacity-90">{note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/12 bg-linear-to-br from-white/10 via-white/6 to-white/4 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Verify Before Funds Move</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">One clean system path from submission to payout</h3>
          </div>
          <div className="rounded-2xl bg-blue-300/14 p-3 text-blue-100">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            'Beneficiary submits details',
            'PROVA checks trust signals',
            'Decision is made and logged',
            'Only approved cases continue',
          ].map((item, index) => (
            <div key={item} className="relative rounded-[22px] border border-white/10 bg-slate-950/22 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/60">0{index + 1}</span>
              <p className="mt-8 text-base leading-7 text-white">{item}</p>
              {index < 3 ? <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-blue-100/60 md:block" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AiVisual() {
  const signals = [
    { label: 'Liveness', value: 82, icon: Bot, tone: 'from-sky-500/35 to-sky-300/10' },
    { label: 'Face Match', value: 91, icon: Fingerprint, tone: 'from-emerald-500/30 to-emerald-300/10' },
    { label: 'Document / OCR', value: 87, icon: Braces, tone: 'from-violet-500/24 to-violet-300/10' },
    { label: 'Payout Risk', value: 72, icon: AlertTriangle, tone: 'from-amber-500/28 to-amber-300/10' },
  ]

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Trust Engine Inputs</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Signals combine into a score the operator can explain</h3>
          </div>
          <div className="rounded-2xl bg-indigo-300/12 p-3 text-indigo-100">
            <Bot className="h-8 w-8" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {signals.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className={`rounded-[22px] border border-white/10 bg-linear-to-r ${tone} p-4`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-950/24 p-2 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-[0.14em] text-white/90">{label}</span>
                </div>
                <span className="font-mono text-sm text-white/90">{value}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-950/30">
                <div className="h-full rounded-full bg-white/85" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-[28px] border border-white/12 bg-linear-to-br from-blue-400/18 to-cyan-300/10 p-6 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Composite Output</p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-blue-100/80">Trust Score</p>
              <p className="mt-2 text-6xl font-semibold tracking-tight text-white">84</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-emerald-100">approved</p>
            </div>
            <div className="rounded-3xl border border-emerald-300/30 bg-emerald-300/12 px-4 py-3 text-emerald-100">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Reason Codes</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {['Face match above threshold', 'Document details consistent', 'No payout anomaly detected'].map((item) => (
              <span key={item} className="rounded-full border border-white/12 bg-slate-950/24 px-4 py-2 text-sm text-slate-100">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SquadVisual() {
  return (
    <div className="grid h-full gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Execution Rail</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Meaningful Squad integration at the point where money moves</h3>

        <div className="mt-6 space-y-3">
          {[
            'payout/account/lookup',
            'payout/transfer',
            'payout/requery',
            'merchant/balance',
          ].map((item) => (
            <div key={item} className="rounded-[20px] border border-white/10 bg-slate-950/22 px-4 py-3 font-mono text-sm text-slate-100">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/12 bg-linear-to-br from-white/10 via-white/6 to-white/4 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">Payout Flow</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Trust decision first. Squad execution second.</h3>
          </div>
          <div className="rounded-2xl bg-blue-300/14 p-3 text-blue-100">
            <Wallet className="h-8 w-8" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { icon: ShieldCheck, label: 'Verify', note: 'PROVA decides trust' },
            { icon: ArrowLeftRight, label: 'Lookup', note: 'Confirm destination details' },
            { icon: Wallet, label: 'Transfer', note: 'Release approved payout' },
            { icon: TrendingUp, label: 'Requery', note: 'Track completion state' },
          ].map(({ icon: Icon, label, note }, index) => (
            <div key={label} className="relative rounded-[22px] border border-white/10 bg-slate-950/24 p-4 text-white">
              <Icon className="h-6 w-6 text-blue-100" />
              <p className="mt-6 text-lg font-semibold">{label}</p>
              <p className="mt-2 text-sm text-slate-200">{note}</p>
              {index < 3 ? <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-blue-100/60 md:block" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HandoffVisual() {
  return (
    <div className="grid h-full gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/80">What We Will Show Next</p>
        <div className="mt-5 space-y-3">
          {[
            'Dashboard overview with live metrics and recent verification queue',
            'Beneficiary onboarding and live decision creation',
            'Status tracking and payout-state visibility',
          ].map((item, index) => (
            <div key={item} className="rounded-[22px] border border-white/10 bg-slate-950/24 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/60">Live Step 0{index + 1}</p>
              <p className="mt-3 text-base leading-7 text-white">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-4xl border border-white/14 bg-linear-to-br from-white/10 to-white/4 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.32)] backdrop-blur-sm">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/34 p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/70">Live App Preview</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">PROVA dashboard is already loaded behind this scene</h3>
            </div>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
              ready for handoff
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Beneficiaries', value: '128' },
                  { label: 'Pending Review', value: '12' },
                  { label: 'Trust Score', value: '84%' },
                  { label: 'Active Programs', value: '04' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-[18px] border border-white/10 bg-slate-950/24 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-blue-100/60">{label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Beneficiaries', icon: Users },
                { label: 'Verification', icon: ShieldCheck },
                { label: 'Disbursements', icon: Wallet },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-[22px] border border-white/10 bg-slate-950/24 px-4 py-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-300/14 p-2 text-blue-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-base font-semibold">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderVisual(id: string) {
  switch (id) {
    case 'problem':
      return <ProblemVisual />
    case 'users':
      return <UsersVisual />
    case 'solution':
      return <SolutionVisual />
    case 'ai':
      return <AiVisual />
    case 'squad':
      return <SquadVisual />
    case 'handoff':
      return <HandoffVisual />
    default:
      return null
  }
}

export function IntroDeck({ onComplete }: IntroDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isContentVisible, setIsContentVisible] = useState(true)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const switchTimeoutRef = useRef<number | null>(null)
  const revealTimeoutRef = useRef<number | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  const currentSlide = slides[activeIndex]
  const isLastSlide = activeIndex === slides.length - 1

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const tagName = target?.tagName ?? ''

      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
        return
      }

      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') {
        event.preventDefault()
        handleAdvance()
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handleRetreat()
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        handleComplete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current !== null) {
        window.clearTimeout(switchTimeoutRef.current)
      }

      if (revealTimeoutRef.current !== null) {
        window.clearTimeout(revealTimeoutRef.current)
      }

      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  function switchSlide(nextIndex: number) {
    if (isTransitioning || nextIndex === activeIndex || nextIndex < 0 || nextIndex >= slides.length || isClosing) {
      return
    }

    setDirection(nextIndex > activeIndex ? 1 : -1)
    setIsTransitioning(true)
    setIsContentVisible(false)

    switchTimeoutRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex)
      revealTimeoutRef.current = window.setTimeout(() => {
        setIsContentVisible(true)
        setIsTransitioning(false)
      }, 30)
    }, 220)
  }

  function handleAdvance() {
    if (isLastSlide) {
      handleComplete()
      return
    }

    switchSlide(activeIndex + 1)
  }

  function handleRetreat() {
    switchSlide(activeIndex - 1)
  }

  function handleComplete() {
    if (isClosing) {
      return
    }

    setIsClosing(true)
    closeTimeoutRef.current = window.setTimeout(() => {
      onComplete()
    }, 520)
  }

  const contentStateClass = isContentVisible
    ? 'translate-x-0 translate-y-0 scale-100 opacity-100'
    : direction === 1
      ? '-translate-x-4 translate-y-5 scale-[0.985] opacity-0'
      : 'translate-x-4 translate-y-5 scale-[0.985] opacity-0'

  return (
    <div
      aria-label="PROVA intro presentation"
      aria-modal="true"
      className={`fixed inset-0 z-140 overflow-hidden transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      role="dialog"
    >
      <div className={`intro-deck-shell absolute inset-0 ${isLastSlide ? 'opacity-90' : 'opacity-100'}`} />
      <div className="intro-grid absolute inset-0 opacity-40" />
      <div className="intro-orb intro-orb-a absolute -left-20 top-24 h-80 w-80 rounded-full bg-cyan-300/22 blur-3xl" />
      <div className="intro-orb intro-orb-b absolute right-8 top-16 h-96 w-96 rounded-full bg-blue-500/24 blur-3xl" />
      <div className="intro-orb intro-orb-c absolute bottom-[-10%] left-[35%] h-96 w-96 rounded-full bg-emerald-300/14 blur-3xl" />

      <div className="relative flex min-h-screen flex-col text-white">
        <header className="px-4 pb-2 pt-4 md:px-10 md:pt-8">
          <div className="mx-auto flex w-full max-w-375 items-center justify-between gap-4 rounded-full border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-xl md:px-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-blue-200/20 bg-blue-200/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                PROVA
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.12em] text-white/88">Live Demo Prelude</p>
                <p className="text-xs text-slate-300">Enter to advance, Escape to skip straight into the app</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-white/10 bg-slate-950/24 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100 md:inline-flex">
                {activeIndex + 1} / {slides.length}
              </span>
              <button
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100 transition hover:bg-white/14"
                onClick={handleComplete}
                type="button"
              >
                Skip intro
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-4 md:px-10 md:pb-8">
          <div
            className={`mx-auto grid h-full max-w-375 grid-cols-1 gap-8 rounded-[36px] border border-white/10 bg-[rgba(6,13,30,0.56)] p-5 shadow-[0_40px_140px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-all duration-300 md:p-8 lg:grid-cols-[0.92fr_1.08fr] lg:p-10 ${isLastSlide ? 'bg-[rgba(6,13,30,0.42)]' : ''} ${contentStateClass}`}
          >
            <section className="flex flex-col justify-between gap-8">
              <div>
                <div className="inline-flex rounded-full border border-blue-100/16 bg-blue-100/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/90">
                  {currentSlide.eyebrow}
                </div>

                <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-5xl xl:text-6xl">
                  {currentSlide.title}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
                  {currentSlide.description}
                </p>

                <div className="mt-6 rounded-[28px] border border-white/10 bg-white/7 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/70">What judges should understand here</p>
                  <p className="mt-3 text-xl leading-8 text-white">{currentSlide.spotlight}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {currentSlide.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-3xl border border-white/10 bg-slate-950/20 p-4 text-sm leading-7 text-slate-100">
                      {bullet}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/6 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2 text-xs text-slate-200">
                    {['Problem relevance', 'AI depth', 'Squad integration', 'Live demo handoff'].map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-slate-950/24 px-3 py-2 uppercase tracking-[0.14em]">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white transition hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={activeIndex === 0 || isTransitioning}
                      onClick={handleRetreat}
                      type="button"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>

                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isTransitioning || isClosing}
                      onClick={handleAdvance}
                      type="button"
                    >
                      {isLastSlide ? 'Enter live app' : 'Next'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="min-h-104 lg:min-h-168">{renderVisual(currentSlide.id)}</section>
          </div>
        </main>

        <footer className="px-4 pb-4 md:px-10 md:pb-8">
          <div className="mx-auto flex w-full max-w-375 items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-white' : index < activeIndex ? 'bg-blue-200/60' : 'bg-white/14'}`}
                onClick={() => switchSlide(index)}
                type="button"
              />
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}