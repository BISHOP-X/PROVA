import {
  ArrowRight,
  ShieldCheck,
  Lock,
  UserSquare,
  Scale,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Edit2,
  CheckCheck,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import { getPrograms } from '@/services/supabase';
import { validateBankAccount } from '@/services/squad-api';
import { isValidBankCode, validateAccountNumber, formatAccountNumber, NIGERIAN_BANKS, generateApplicationId } from '@/services/bank-codes';
import type { ProgramRecord } from '@/services/supabase';

const inputClass =
  'bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline';

// Convert NIGERIAN_BANKS to sorted array
const BANK_OPTIONS = Object.entries(NIGERIAN_BANKS)
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const { addSubmission, submissions, updateSubmissionStatus } = useSubmissions();
  
  // Check if user already has a submission
  const existingSubmission = user ? submissions.find(s => s.userId === user.id) : null;

  const [fullName, setFullName] = useState('');
  const [programId, setProgramId] = useState('');
  const [scholarshipId, setScholarshipId] = useState('');
  const [bank, setBank] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountNameLookup, setAccountNameLookup] = useState<string | null>(null);
  const [validatingAccount, setValidatingAccount] = useState(false);
  const [accountValidationError, setAccountValidationError] = useState('');
  const [programs, setPrograms] = useState<ProgramRecord[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programError, setProgramError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // If user already has submission, load it for editing
  useEffect(() => {
    if (existingSubmission) {
      setFullName(existingSubmission.fullName);
      setProgramId(existingSubmission.programId);
      setScholarshipId(existingSubmission.scholarshipId || '');
      setBank(existingSubmission.bank || '');
      setAccountNumber(existingSubmission.accountNumber || '');
      setAccountNameLookup(existingSubmission.fullName ? existingSubmission.fullName : null);
      setIsEditMode(true);
    }
  }, [existingSubmission]);

  React.useEffect(() => {
    let mounted = true;

    async function loadPrograms() {
      try {
        setProgramError('');
        const rows = await getPrograms();
        if (!mounted) return;
        setPrograms(rows);
        if (rows.length === 1) setProgramId(rows[0].id);
      } catch (err) {
        console.error('[Onboarding] failed to load programs', err);
        if (mounted) setProgramError('Unable to load available programs.');
      } finally {
        if (mounted) setProgramsLoading(false);
      }
    }

    loadPrograms();

    return () => {
      mounted = false;
    };
  }, []);

  const validateAccount = async () => {
    if (!bank || !accountNumber.trim()) {
      setAccountValidationError('Please enter both bank and account number');
      return;
    }

    if (!isValidBankCode(bank)) {
      setAccountValidationError('Invalid bank code');
      return;
    }

    const formattedAccount = formatAccountNumber(accountNumber);
    if (!validateAccountNumber(formattedAccount)) {
      setAccountValidationError('Account number must be 10 digits');
      return;
    }

    setValidatingAccount(true);
    setAccountValidationError('');
    setAccountNameLookup(null);
    setFullName(''); // Clear manually entered name to avoid confusion during validation

    try {
      const result = await validateBankAccount(bank, formattedAccount);
      if (result?.account_name) {
        setAccountNameLookup(result.account_name);
        setAccountValidationError('');
      } else {
        setAccountValidationError('Account name not found. Please check your details.');
      }
    } catch (err) {
      console.error('[Onboarding] account validation failed', err);
      setAccountValidationError(err instanceof Error ? err.message : 'Failed to validate account. Please try again.');
    } finally {
      setValidatingAccount(false);
    }
  };

  const handleAccountNumberBlur = () => {
    if (accountNumber.trim()) {
      validateAccount();
    }
  };

  const filteredBanks = BANK_OPTIONS.filter(
    (b) => b.name.toLowerCase().includes(bankSearch.toLowerCase()) || b.code.includes(bankSearch)
  );

  const handleSelectBank = (code: string) => {
    setBank(code);
    setBankSearch('');
    setShowBankDropdown(false);
    setAccountNameLookup(null);
    setAccountValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    if (!programId || !fullName.trim() || !bank || !accountNumber.trim()) {
      alert('Please complete program, full name, bank and account number.');
      return undefined;
    }

    if (!accountNameLookup) {
      alert('Please validate your account number first.');
      return undefined;
    }

    setSubmitting(true);
    try {
      const normalizedAccountNumber = formatAccountNumber(accountNumber);
      
      // Ensure account number is exactly 10 digits
      if (normalizedAccountNumber.length !== 10) {
        throw new Error('Account number must be exactly 10 digits');
      }
      
      const masked = `**** **** ${normalizedAccountNumber.slice(-4)}`;

      if (isEditMode && existingSubmission) {
        // Edit mode: update existing submission and require liveness re-verification
        const updatedSubmission = await updateSubmissionStatus(
          existingSubmission.id,
          'pending',
          {
            fullName: fullName.trim(),
            scholarshipId: scholarshipId.trim(),
            bank,
            accountNumber: normalizedAccountNumber,
            accountMasked: masked,
            accountLast4: normalizedAccountNumber.slice(-4),
            livenessScore: undefined, // Reset liveness score to require re-verification
          }
        );

        if (updatedSubmission) {
          alert('Details updated. You need to redo the liveness verification.');
          navigate('/onboarding/liveness');
        }
      } else {
        // New submission: create with application ID
        const applicationId = generateApplicationId();
        
        await addSubmission({
          userId: user.id,
          programId,
          fullName: fullName.trim(),
          scholarshipId: scholarshipId.trim(),
          bank,
          accountNumber: normalizedAccountNumber,
          accountMasked: masked,
          accountLast4: normalizedAccountNumber.slice(-4),
          applicationId,
        });

        completeOnboarding();
        navigate('/onboarding/liveness');
      }
    } catch (err) {
      console.error('[Onboarding] submission error', err);
      alert(err instanceof Error ? err.message : 'Failed to submit onboarding. Check console for details.');
    } finally {
      setSubmitting(false);
    }

    return undefined;
  };

  return (
    <main className="px-4 md:px-10 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-headline-lg text-3xl font-bold tracking-tight text-on-surface">Identity & Bank Details</h1>
              {isEditMode && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                  <Edit2 className="w-3 h-3" />
                  Editing
                </span>
              )}
            </div>
            <span className="font-mono text-on-surface-variant text-sm">{isEditMode ? 'Edit Details' : 'Step 1 of 3'}</span>
          </div>

          <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/3 rounded-full shadow-[0_0_8px_rgba(184,195,255,0.4)]" />
          </div>

          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
            To securely disburse your funds, we need to verify your identity and connect your financial institution. Your data is encrypted end-to-end.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container rounded-xl border border-white/10 shadow-lg p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden w-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-surface-container" />

          <div className="flex flex-col gap-5">
            <h2 className="font-title-lg text-xl font-medium text-on-surface border-b border-outline-variant/20 pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-label-md text-xs font-semibold text-on-surface-variant" htmlFor="programId">Program</label>
                <div className="relative">
                  <select
                    className={`${inputClass} w-full appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70`}
                    id="programId"
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    disabled={programsLoading || programs.length === 0}
                  >
                    <option disabled value="">
                      {programsLoading ? 'Loading programs...' : 'Select Program'}
                    </option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name} - {program.organization_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
                {programError && <p className="text-xs font-medium text-error">{programError}</p>}
                {!programsLoading && !programError && programs.length === 0 && (
                  <p className="text-xs font-medium text-error">No programs are available for onboarding.</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-on-surface-variant" htmlFor="fullName">Full Legal Name</label>
                <input
                  className={inputClass}
                  id="fullName"
                  placeholder="As it appears on your ID"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  disabled={validatingAccount}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-on-surface-variant" htmlFor="scholarshipId">Institution / Reference ID</label>
                <input
                  className={`${inputClass} font-mono`}
                  id="scholarshipId"
                  placeholder="e.g. REF-2026-9876"
                  type="text"
                  value={scholarshipId}
                  onChange={(e) => setScholarshipId(e.target.value)}
                  autoComplete="organization"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-4">
            <h2 className="font-title-lg text-xl font-medium text-on-surface border-b border-outline-variant/20 pb-2">Financial Routing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-on-surface-variant" htmlFor="bankSelect">Financial Institution</label>
                <div className="relative">
                  <div
                    className={`${inputClass} w-full flex items-center justify-between cursor-pointer`}
                    onClick={() => setShowBankDropdown(!showBankDropdown)}
                  >
                    <span className={bank ? 'text-on-surface' : 'text-outline'}>
                      {bank ? NIGERIAN_BANKS[bank] : 'Search or select bank...'}
                    </span>
                    <ChevronDown className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  {showBankDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container border border-outline-variant/30 rounded-lg shadow-lg z-50">
                      <div className="p-2 border-b border-outline-variant/20">
                        <input
                          type="text"
                          placeholder="Search by name or code..."
                          className={`${inputClass} w-full`}
                          value={bankSearch}
                          onChange={(e) => setBankSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {filteredBanks.length > 0 ? (
                          filteredBanks.map((b) => (
                            <div
                              key={b.code}
                              onClick={() => handleSelectBank(b.code)}
                              className={`px-4 py-3 cursor-pointer hover:bg-primary-container transition-colors ${
                                bank === b.code ? 'bg-primary-container' : ''
                              }`}
                            >
                              <div className="text-sm font-medium text-on-surface">{b.name}</div>
                              <div className="text-xs text-on-surface-variant font-mono">{b.code}</div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-on-surface-variant">No banks found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-xs font-semibold text-on-surface-variant" htmlFor="accountNumber">Account Number (10 digits)</label>
                <input
                  className={`${inputClass} font-mono`}
                  id="accountNumber"
                  placeholder="0123456789"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                    setAccountNumber(digits);
                    if (digits.length < 10) {
                      setAccountNameLookup(null);
                      setAccountValidationError('');
                    }
                  }}
                  onBlur={handleAccountNumberBlur}
                  autoComplete="off"
                />
                {validatingAccount && (
                  <p className="text-xs text-secondary font-medium">Validating account...</p>
                )}
                {accountValidationError && (
                  <p className="text-xs font-medium text-error flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {accountValidationError}
                  </p>
                )}
                {accountNameLookup && (
                  <div className="mt-3 p-3 bg-tertiary/10 border border-tertiary/20 rounded-lg">
                    <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1">Verified Account Holder</p>
                    <p className="text-sm font-bold text-on-surface flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-tertiary" />
                      {accountNameLookup}
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-1 italic">
                      Please ensure this matches your legal identity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-2 border-t border-outline-variant/20">
            <button
              type="submit"
              disabled={submitting || !accountNameLookup || validatingAccount}
              className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors px-6 py-3 rounded-lg font-label-md text-sm font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update & Re-verify' : 'Continue to Liveness Check'}
              {isEditMode ? <CheckCheck className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6 w-full">
        <div className="bg-surface-container/50 backdrop-blur-md rounded-xl border border-primary/20 p-6 flex flex-col gap-6 sticky top-24 shadow-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30 shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-title-lg text-xl font-medium text-on-surface">Secured by PROVA</h3>
              <p className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">Institutional Grade Protocol</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-4 items-start">
              <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-sm font-semibold text-on-surface">End-to-End Encryption</span>
                <span className="font-body-md text-sm text-on-surface-variant">Your financial data is encrypted at rest and in transit.</span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <UserSquare className="w-5 h-5 text-tertiary mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-sm font-semibold text-on-surface">Biometric Liveness</span>
                <span className="font-body-md text-sm text-on-surface-variant">Step 2 will require a brief facial scan to ensure funds are released only to the true beneficiary.</span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Scale className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-sm font-semibold text-on-surface">Regulatory Compliance</span>
                <span className="font-body-md text-sm text-on-surface-variant">Meets strict KYC/AML standards required by institutional providers.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-outline-variant/20 pt-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container-high border border-outline-variant/30 font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              SOC2 Type II
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container-high border border-outline-variant/30 font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              PCI-DSS
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
