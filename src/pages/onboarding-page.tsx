import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  UserSquare, 
  Scale, 
  ChevronDown 
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addSubmission } = useSubmissions();
  const { completeOnboarding } = useAuth();

  const [fullName, setFullName] = useState('');
  const [scholarshipId, setScholarshipId] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleContinue = () => {
    if (!user) return navigate('/login');
    if (!fullName || !bank || !accountNumber) {
      // minimal validation
      alert('Please complete full name, bank and account number.');
      return;
    }
    const masked = `•••• •••• ${accountNumber.slice(-4)}`;
    const sub = addSubmission({ userId: user.id, fullName, scholarshipId, bank, accountMasked: masked, accountLast4: accountNumber.slice(-4) });
    // mark onboarding as started/completed for beneficiary session
    try { completeOnboarding(); } catch {}
    navigate('/onboarding/liveness');
  };

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

        {/* Form Card */}
        <div className="bg-surface-container rounded-xl border border-white/10 shadow-lg p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden w-full">
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
                  placeholder="As it appears on your ID" 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="scholarshipId">Institution / Reference ID</label>
                <input 
                  className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-mono text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline" 
                  id="scholarshipId" 
                  placeholder="e.g. REF-2024-9876" 
                  type="text" 
                  value={scholarshipId}
                  onChange={(e) => setScholarshipId(e.target.value)}
                />
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
                    id="bankSelect"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                  >
                    <option className="text-outline" disabled value="">Select Institution</option>
                    <option value="chase">JPMorgan Chase</option>
                    <option value="bofa">Bank of America</option>
                    <option value="citi">Citibank</option>
                    <option value="wells">Wells Fargo</option>
                    <option value="other">Other / Credit Union</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-surface-on-variant pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-surface-on-variant" htmlFor="accountNumber">Account Number</label>
                <input 
                  className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 font-mono text-sm text-surface-on focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline" 
                  id="accountNumber" 
                  placeholder="•••• •••• ••••" 
                  type="password" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-6 mt-2 border-t border-outline-variant/20">
            <button onClick={handleContinue} className="bg-primary-container text-primary-on-container hover:bg-primary hover:text-primary-on transition-colors px-6 py-3 rounded-lg font-label-md text-sm font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
              Continue to Liveness Check
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
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
