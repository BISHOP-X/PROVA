import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export interface AdminDashboardResponse {
  metrics: {
    activePrograms: number
    approvedBeneficiaries: number
    pendingVerifications: number
    totalBeneficiaries: number
    trustScore: number
  }
  recentQueue: Array<{
    id: string
    name: string
    referenceId: string
    risk: 'Low' | 'Medium' | 'High'
    status: string
    time: string
    type: string
  }>
}

export interface BeneficiaryListResponse {
  beneficiaries: Array<{
    entity: string
    fullName: string
    id: string
    initials: string
    lastPayoutAmount: number | null
    lastPayoutDate: string | null
    latestDecision: 'approved' | 'review' | 'rejected' | null
    maskedContact: string
    organizationName: string
    programName: string
    referenceId: string
    riskLevel: 'Low' | 'Medium' | 'High'
    status: 'draft' | 'submitted' | 'approved' | 'review' | 'rejected'
  }>
  summary: {
    flagged: number
    pendingReview: number
    totalActive: number
  }
}

export interface SubmitBeneficiaryPayload {
  accountNumber: string
  bankCode: string
  bankName?: string
  email?: string
  fullName: string
  organizationName?: string
  phone?: string
  programName?: string
  programType?: string
  referenceId: string
}

export interface SubmitBeneficiaryResponse {
  accountLast4: string
  applicationId: string
  decision: 'approved' | 'review' | 'rejected'
  program: {
    name: string
    organizationName: string
    type: string
  }
  reasonCodes: string[]
  status: 'approved' | 'review' | 'rejected'
}

export interface BeneficiaryStatusResponse {
  applicationId: string
  beneficiary: {
    accountLast4: string
    currentStatus: 'draft' | 'submitted' | 'approved' | 'review' | 'rejected'
    fullName: string
    organizationName: string
    programName: string
    programType: string
    referenceId: string
  }
  payout: {
    amount: number
    releasedAt: string | null
    squadStatus: string
  } | null
  timeline: Array<{
    description: string
    key: string
    label: string
    status: 'completed' | 'active' | 'pending'
    timestamp: string | null
  }>
  verification: {
    decision: 'approved' | 'review' | 'rejected'
    documentScore: number
    faceMatchScore: number
    livenessScore: number
    reasonCodes: string[]
    riskScore: number
  } | null
}

async function invokeFunction<TResponse>(
  functionName: string,
  payload?: object,
): Promise<TResponse> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
  }

  const { data, error } = await supabase.functions.invoke(
    functionName,
    payload === undefined ? undefined : { body: payload as Record<string, unknown> },
  )

  if (error) {
    throw new Error(error.message)
  }

  if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
    throw new Error(data.error)
  }

  return data as TResponse
}

export function getAdminDashboard() {
  return invokeFunction<AdminDashboardResponse>('get-admin-dashboard')
}

export function listBeneficiaries() {
  return invokeFunction<BeneficiaryListResponse>('list-beneficiaries')
}

export function submitBeneficiaryVerification(payload: SubmitBeneficiaryPayload) {
  return invokeFunction<SubmitBeneficiaryResponse>('submit-beneficiary-verification', payload)
}

export function getBeneficiaryStatus(applicationId: string) {
  return invokeFunction<BeneficiaryStatusResponse>('get-beneficiary-status', { applicationId })
}