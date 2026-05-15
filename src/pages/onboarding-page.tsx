import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  UserSquare, 
  Scale, 
  ChevronDown 
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitBeneficiaryVerification, type SubmitBeneficiaryResponse } from '@/lib/api';

const banks = [
  { code: '000014', name: 'Access Bank' },
  { code: '000016', name: 'First Bank of Nigeria' },
  { code: '000013', name: 'GTBank Plc' },
  { code: '000004', name: 'United Bank for Africa' },
  { code: '000015', name: 'Zenith Bank Plc' },
  { code: '090267', name: 'Kuda Microfinance Bank' },
];

export function OnboardingPage() {
  const [latestSubmission, setLatestSubmission] = useState<SubmitBeneficiaryResponse | null>(null);
  const submissionMutation = useMutation({
    mutationFn: submitBeneficiaryVerification,
    onSuccess: (response) => {
      setLatestSubmission(response);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const bankCode = String(formData.get('bankCode') ?? '');
    const selectedBank = banks.find((bank) => bank.code === bankCode);
    const includeDocument = formData.get('includeDocument') === 'on';
    const includeSelfie = formData.get('includeSelfie') === 'on';

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
    });
  }

  return (
    <main className="px-4 md:px-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Onboarding Form Section */}
      <div className="lg:col-span-8 flex flex-col gap-8 w-full">
        
        {/* Progress Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="font-headline-lg text-3xl font-bold tracking-tight text-surface-on">Identity & Bank Details</h1>
            <span className="font-mono text-surface-on-variant text-sm">Step 1 of 3</span>
          </div>
          {/* Progress Bar */}
          <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/3 rounded-full shadow-[0_0_8px_rgba(184,195,255,0.4)]"></div>
          </div>
          <p className="font-body-lg text-lg text-surface-on-variant max-w-2xl">
            To securely disburse your funds, we need to verify your identity and connect your financial institution. Your data is encrypted end-to-end.
          </p>
        </div>

        {submissionMutation.isError ? (
          <div className="rounded-xl border border-[#ffdad6] bg-[#fff8f7] px-4 py-3 text-sm text-[#93000a]">
            Submission failed: {submissionMutation.error.message}
          </div>
        ) : null}

        {latestSubmission ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 text-sm text-surface-on flex flex-col gap-3">
            <div>
              <p className="font-semibold">Application created successfully.</p>
              <p className="text-surface-on-variant mt-1">
                Decision: <span className="font-semibold capitalize text-surface-on">{latestSubmission.decision}</span>.
                Reference: <span className="font-mono text-surface-on"> {latestSubmission.applicationId}</span>
              </p>
              <p className="text-surface-on-variant mt-1">
                Squad account lookup mode: <span className="font-semibold capitalize text-surface-on">{latestSubmission.providerMode}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90" to={`/status?applicationId=${latestSubmission.applicationId}`}>
                View live status
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-surface-on hover:bg-surface-container-high" onClick={() => setLatestSubmission(null)} type="button">
                Create another submission
              </button>
            </div>
          </div>
        ) : null}

        {/* Form Card */}
        <form className="bg-surface-container rounded-xl border border-white/10 shadow-lg p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden w-full" onSubmit={handleSubmit}>
          {/* Subtle Gradient Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-surface-container"></div>
          
          <div className="flex flex-col gap-5">
            <h2 className="font-title-lg text-xl font-medium text-surface-on border-b border-outline-variant/20 pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="fullName">Full Legal Name</label>
                <input 
                  className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline" 
                  id="fullName" 
                  name="fullName"
                  placeholder="As it appears on your ID" 
                  required
                  type="text" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="referenceId">Institution / Reference ID</label>
                <input 
                  className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-mono text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline" 
                  id="referenceId" 
                  name="referenceId"
                  placeholder="e.g. REF-2024-9876" 
                  required
                  type="text" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="email">Email Address</label>
                <input 
                  className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline" 
                  id="email" 
                  name="email"
                  placeholder="name@example.org" 
                  type="email" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="phone">Phone Number</label>
                <input 
                  className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline" 
                  id="phone" 
                  name="phone"
                  placeholder="08012345678" 
                  type="tel" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-4">
            <h2 className="font-title-lg text-xl font-medium text-surface-on border-b border-outline-variant/20 pb-2">Program Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="programName">Program Name</label>
                <input 
                  className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline" 
                  id="programName" 
                  name="programName"
                  placeholder="2025 Merit Scholarship" 
                  type="text" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="organizationName">Institution / Organisation</label>
                <input 
                  className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline" 
                  id="organizationName" 
                  name="organizationName"
                  placeholder="PROVA Demo University" 
                  type="text" 
                />
              </div>
              <div className="flex flex-col gap-2 md:max-w-sm">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="programType">Program Type</label>
                <div className="relative">
                  <select 
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all appearance-none cursor-pointer" 
                    defaultValue="Scholarship"
                    id="programType"
                    name="programType"
                  >
                    <option value="Scholarship">Scholarship</option>
                    <option value="Stipend">Stipend</option>
                    <option value="Grant">Grant</option>
                    <option value="Bursary">Bursary</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-surface-on-variant pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-4">
            <h2 className="font-title-lg text-xl font-medium text-surface-on border-b border-outline-variant/20 pb-2">Financial Routing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="bankSelect">Financial Institution</label>
                <div className="relative">
                  <select 
                    className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all appearance-none cursor-pointer" 
                    defaultValue=""
                    id="bankCode"
                    name="bankCode"
                    required
                  >
                    <option className="text-outline" disabled value="">Select Institution</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.code}>{bank.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-surface-on-variant pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="accountNumber">Account Number</label>
                <input 
                  className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-mono text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline" 
                  id="accountNumber" 
                  name="accountNumber"
                  placeholder="•••• •••• ••••" 
                  required
                  type="password" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-4">
            <h2 className="font-title-lg text-xl font-medium text-surface-on border-b border-outline-variant/20 pb-2">Demo Evidence Pack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="flex items-start gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-4">
                <input className="mt-1 h-4 w-4 accent-primary" defaultChecked name="includeDocument" type="checkbox" />
                <span className="flex flex-col gap-1">
                  <span className="font-label-md text-sm font-semibold text-surface-on">Attach demo program document</span>
                  <span className="font-body-md text-sm text-surface-on-variant">Improves document verification and keeps the live demo on the approved path.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-4">
                <input className="mt-1 h-4 w-4 accent-primary" defaultChecked name="includeSelfie" type="checkbox" />
                <span className="flex flex-col gap-1">
                  <span className="font-label-md text-sm font-semibold text-surface-on">Attach demo selfie capture</span>
                  <span className="font-body-md text-sm text-surface-on-variant">Feeds the liveness and face-match stages of the verification engine even before real storage is connected.</span>
                </span>
              </label>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-6 mt-2 border-t border-outline-variant/20">
            <button className="bg-primary-container text-primary-on-container hover:bg-primary hover:text-primary-on transition-colors px-6 py-3 rounded-lg font-label-md text-sm font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-60" disabled={submissionMutation.isPending} type="submit">
              {submissionMutation.isPending ? 'Submitting live application...' : 'Submit to PROVA'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Security Sidebar (PROVA Protocol) */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full">
        <div className="bg-surface-container/50 backdrop-blur-md rounded-xl border border-primary/20 p-6 flex flex-col gap-6 sticky top-24 shadow-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30 shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-title-lg text-xl font-medium text-surface-on">Secured by PROVA</h3>
              <p className="font-label-md text-xs font-semibold text-surface-on-variant uppercase tracking-wider mt-0.5">Institutional Grade Protocol</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-5">
            {/* Protocol Feature 1 */}
            <div className="flex gap-4 items-start">
              <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-sm font-semibold text-surface-on">End-to-End Encryption</span>
                <span className="font-body-md text-sm text-surface-on-variant">Your financial data is encrypted at rest and in transit. We never store raw account numbers.</span>
              </div>
            </div>
            {/* Protocol Feature 2 */}
            <div className="flex gap-4 items-start">
              <UserSquare className="w-5 h-5 text-tertiary mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-sm font-semibold text-surface-on">Biometric Liveness</span>
                <span className="font-body-md text-sm text-surface-on-variant">Step 2 will require a brief 3D facial scan to ensure funds are released only to the true beneficiary.</span>
              </div>
            </div>
            {/* Protocol Feature 3 */}
            <div className="flex gap-4 items-start">
              <Scale className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-sm font-semibold text-surface-on">Regulatory Compliance</span>
                <span className="font-body-md text-sm text-surface-on-variant">Meets strict KYC/AML standards required by institutional providers.</span>
              </div>
            </div>
          </div>
          
          {/* Trust Indicator Badges */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-outline-variant/20 pt-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container-high border border-outline-variant/30 font-mono text-[10px] text-surface-on-variant uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              SOC2 Type II
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container-high border border-outline-variant/30 font-mono text-[10px] text-surface-on-variant uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              PCI-DSS
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
