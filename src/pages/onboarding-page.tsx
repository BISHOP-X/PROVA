import { useMutation } from '@tanstack/react-query'
import { ArrowRight, ChevronDown, Lock, Scale, ShieldCheck, UserSquare } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitBeneficiaryVerification, type SubmitBeneficiaryResponse } from '@/lib/api'

const banks = [
  { code: '000014', name: 'Access Bank' },
  { code: '000016', name: 'First Bank of Nigeria' },
  { code: '000013', name: 'GTBank Plc' },
  { code: '000004', name: 'United Bank for Africa' },
  { code: '000015', name: 'Zenith Bank Plc' },
  { code: '090267', name: 'Kuda Microfinance Bank' },
]

function FieldLabel({ children, htmlFor }: { children: string; htmlFor: string }) {
  return (
    <label className="font-label text-[11px] uppercase tracking-[0.14em] text-[#998a76]" htmlFor={htmlFor}>
      {children}
    </label>
  )
}

export function OnboardingPage() {
  const [latestSubmission, setLatestSubmission] = useState<SubmitBeneficiaryResponse | null>(null)
  const submissionMutation = useMutation({
    mutationFn: submitBeneficiaryVerification,
    onSuccess: (response) => {
      setLatestSubmission(response)
    },
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const bankCode = String(formData.get('bankCode') ?? '')
    const selectedBank = banks.find((bank) => bank.code === bankCode)
    const includeDocument = formData.get('includeDocument') === 'on'
    const includeSelfie = formData.get('includeSelfie') === 'on'

    submissionMutation.mutate({
      accountNumber: String(formData.get('accountNumber') ?? ''),
      bankCode,
      bankName: selectedBank?.name ?? '',
      documentFilePath: includeDocument ? `demo-documents/${Date.now()}-${String(formData.get('referenceId') ?? 'beneficiary')}.pdf` : undefined,
      email: String(formData.get('email') ?? ''),
      fullName: String(formData.get('fullName') ?? ''),
      organizationName: String(formData.get('organizationName') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      programName: String(formData.get('programName') ?? ''),
      programType: String(formData.get('programType') ?? ''),
      referenceId: String(formData.get('referenceId') ?? ''),
      selfieFilePath: includeSelfie ? `demo-selfies/${Date.now()}-${String(formData.get('referenceId') ?? 'beneficiary')}.jpg` : undefined,
    })
  }

  return (
    <main className="grid w-full max-w-[1600px] grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_380px]">
      <div className="flex flex-col gap-6">
        <section className="prova-panel prova-hero-panel rounded-[32px] p-6 md:p-8">
          <div className="relative z-10 max-w-[760px]">
            <div className="prova-kicker w-fit">New beneficiary intake</div>
            <h1 className="font-display prova-metric-value mt-5 text-[2.6rem] leading-[0.94] tracking-[-0.06em] text-white md:text-[4rem]">
              Identity &amp; Bank Details
            </h1>
            <p className="mt-4 max-w-[560px] text-sm text-[#d9ccb8]">
              Capture the core identity, program, and routing details that feed the verification engine and payout rail.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="prova-chip">Step 1 of 3</span>
              <span className="prova-chip-warm">Demo-safe evidence pack</span>
            </div>
          </div>
        </section>

        {submissionMutation.isError ? (
          <section className="rounded-[24px] border border-[#ba1a1a]/30 bg-[#311311]/70 px-4 py-3 text-sm text-[#ffb4ab]">
            Submission failed: {submissionMutation.error.message}
          </section>
        ) : null}

        {latestSubmission ? (
          <section className="rounded-[24px] border border-[#136e39]/30 bg-[#11251a]/80 px-5 py-4 text-sm text-[#94f0bc]">
            <p className="font-semibold text-white">Application created successfully.</p>
            <p className="mt-2 text-[#cfe6d8]">
              Decision: <span className="font-semibold capitalize text-white">{latestSubmission.decision}</span>. Reference:{' '}
              <span className="font-mono text-white">{latestSubmission.applicationId}</span>
            </p>
            <p className="mt-1 text-[#cfe6d8]">
              Squad account lookup mode: <span className="font-semibold capitalize text-white">{latestSubmission.providerMode}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="prova-button-primary px-4 py-2.5 text-xs font-bold" to={`/status?applicationId=${latestSubmission.applicationId}`}>
                View live status
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="prova-button-secondary px-4 py-2.5 text-xs font-bold" onClick={() => setLatestSubmission(null)} type="button">
                Create another submission
              </button>
            </div>
          </section>
        ) : null}

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <section className="prova-panel rounded-[32px] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Personal information</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Primary identity</h2>
              </div>
              <span className="prova-chip-info">Required</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="fullName">Full legal name</FieldLabel>
                <input className="prova-input px-4 py-3 text-sm" id="fullName" name="fullName" placeholder="As it appears on your ID" required type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="referenceId">Institution / reference ID</FieldLabel>
                <input className="prova-input px-4 py-3 font-mono text-sm" id="referenceId" name="referenceId" placeholder="REF-2026-0001" required type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <input className="prova-input px-4 py-3 text-sm" id="email" name="email" placeholder="name@example.org" type="email" />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                <input className="prova-input px-4 py-3 text-sm" id="phone" name="phone" placeholder="08012345678" type="tel" />
              </div>
            </div>
          </section>

          <section className="prova-panel rounded-[32px] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Program context</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Disbursement context</h2>
              </div>
              <span className="prova-chip">Program metadata</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="programName">Program name</FieldLabel>
                <input className="prova-input px-4 py-3 text-sm" id="programName" name="programName" placeholder="2026 Merit Scholarship" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="organizationName">Institution / organisation</FieldLabel>
                <input className="prova-input px-4 py-3 text-sm" id="organizationName" name="organizationName" placeholder="PROVA Demo University" type="text" />
              </div>
              <div className="flex flex-col gap-2 md:max-w-sm">
                <FieldLabel htmlFor="programType">Program type</FieldLabel>
                <div className="relative">
                  <select className="prova-input w-full appearance-none px-4 py-3 text-sm" defaultValue="Scholarship" id="programType" name="programType">
                    <option value="Scholarship">Scholarship</option>
                    <option value="Stipend">Stipend</option>
                    <option value="Grant">Grant</option>
                    <option value="Bursary">Bursary</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#998a76]" />
                </div>
              </div>
            </div>
          </section>

          <section className="prova-panel rounded-[32px] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Financial routing</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Bank destination</h2>
              </div>
              <span className="prova-chip-warm">Squad lookup ready</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="bankCode">Financial institution</FieldLabel>
                <div className="relative">
                  <select className="prova-input w-full appearance-none px-4 py-3 text-sm" defaultValue="" id="bankCode" name="bankCode" required>
                    <option disabled value="">
                      Select institution
                    </option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#998a76]" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="accountNumber">Account number</FieldLabel>
                <input className="prova-input px-4 py-3 font-mono text-sm" id="accountNumber" name="accountNumber" placeholder="**** **** ****" required type="password" />
              </div>
            </div>
          </section>

          <section className="prova-panel rounded-[32px] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Demo evidence pack</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Verification inputs</h2>
              </div>
              <span className="prova-chip-success">Recommended</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="prova-panel-muted flex items-start gap-3 rounded-[24px] px-4 py-4">
                <input className="mt-1 h-4 w-4 accent-[#ffb357]" defaultChecked name="includeDocument" type="checkbox" />
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-white">Attach demo program document</span>
                  <span className="text-sm leading-6 text-[#d9ccb8]">Improves the document verification path and keeps the demo on the approved track.</span>
                </span>
              </label>
              <label className="prova-panel-muted flex items-start gap-3 rounded-[24px] px-4 py-4">
                <input className="mt-1 h-4 w-4 accent-[#ffb357]" defaultChecked name="includeSelfie" type="checkbox" />
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-white">Attach demo selfie capture</span>
                  <span className="text-sm leading-6 text-[#d9ccb8]">Feeds the liveness and face-match steps even before real storage is connected.</span>
                </span>
              </label>
            </div>
          </section>

          <div className="flex justify-end">
            <button className="prova-button-primary px-6 py-3.5 text-sm font-bold disabled:opacity-60" disabled={submissionMutation.isPending} type="submit">
              {submissionMutation.isPending ? 'Submitting live application...' : 'Submit to PROVA'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      <aside className="flex flex-col gap-6">
        <section className="prova-panel-soft rounded-[32px] p-6 md:sticky md:top-24">
          <div className="mb-6 flex items-center gap-3 border-b border-white/8 pb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ffbf73]/22 bg-[#ffb357]/10 text-[#ffd59f]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-white">Secured by PROVA</h3>
              <p className="font-label text-[10px] uppercase tracking-[0.14em] text-[#998a76]">Institutional grade protocol</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
              <Lock className="mt-1 h-5 w-5 shrink-0 text-[#ffd59f]" />
              <div>
                <p className="text-sm font-semibold text-white">End-to-end encryption</p>
                <p className="mt-1 text-sm leading-6 text-[#d9ccb8]">Financial data stays encrypted in transit and at rest.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <UserSquare className="mt-1 h-5 w-5 shrink-0 text-[#ffd59f]" />
              <div>
                <p className="text-sm font-semibold text-white">Biometric liveness</p>
                <p className="mt-1 text-sm leading-6 text-[#d9ccb8]">Step two is prepared for liveness and face-match scoring.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Scale className="mt-1 h-5 w-5 shrink-0 text-[#ffd59f]" />
              <div>
                <p className="text-sm font-semibold text-white">Compliance gate</p>
                <p className="mt-1 text-sm leading-6 text-[#d9ccb8]">Every payout stays behind a reviewable KYC and risk decision.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/8 pt-5">
            <span className="prova-chip">SOC2 Type II</span>
            <span className="prova-chip">PCI-DSS</span>
            <span className="prova-chip-warm">Squad rail</span>
          </div>
        </section>
      </aside>
    </main>
  )
}
