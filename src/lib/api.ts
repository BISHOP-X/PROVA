import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export type BeneficiaryWorkflowStatus = 'draft' | 'pending' | 'submitted' | 'approved' | 'review' | 'rejected'
export type ReviewAction = 'approve' | 'review' | 'reject'
export type SquadPayoutStatus = 'pending' | 'queued' | 'processing' | 'successful' | 'failed'

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
    status: BeneficiaryWorkflowStatus
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
  documentFilePath?: string
  email?: string
  fullName: string
  organizationName?: string
  phone?: string
  programName?: string
  programType?: string
  referenceId: string
  selfieFilePath?: string
}

export interface SubmitBeneficiaryResponse {
  accountLast4: string
  applicationId: string
  decision: 'approved' | 'review' | 'rejected'
  providerMode: 'mock' | 'live'
  program: {
    name: string
    organizationName: string
    type: string
  }
  reasonCodes: string[]
  status: 'approved' | 'review' | 'rejected'
}

export interface BeneficiaryStatusResponse {
  auditTrail: Array<{
    created_at: string
    event_type: string
    payload: Record<string, unknown>
  }>
  applicationId: string
  beneficiary: {
    accountLast4: string
    currentStatus: BeneficiaryWorkflowStatus
    fullName: string
    organizationName: string
    programName: string
    programType: string
    referenceId: string
  }
  payout: {
    amount: number
    releasedAt: string | null
    squadStatus: SquadPayoutStatus | string
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

export interface VerificationQueueResponse {
  queue: Array<{
    accountName: string | null
    accountNumberLast4: string
    bankCode: string
    decision: 'approved' | 'review' | 'rejected' | null
    documentScore: number | null
    faceMatchScore: number | null
    fullName: string
    hasDocument: boolean
    hasSelfie: boolean
    id: string
    livenessScore: number | null
    organizationName: string
    payoutStatus: SquadPayoutStatus | null
    programName: string
    programType: string
    providerMode: 'mock' | 'live' | string
    reasonCodes: string[]
    referenceId: string
    reviewNotes: string | null
    riskScore: number | null
    status: BeneficiaryWorkflowStatus
    submittedAt: string
    updatedAt: string
    verificationCreatedAt: string | null
  }>
  summary: {
    approvedCount: number
    flaggedCount: number
    pendingCount: number
    total: number
  }
}

export interface ReviewBeneficiaryResponse {
  beneficiaryId: string
  decision: 'approved' | 'review' | 'rejected'
  notes: string
  reviewResultId: string
  status: BeneficiaryWorkflowStatus
}

export interface DisbursementDashboardResponse {
  activeBatches: Array<{
    batchName: string
    beneficiaryCount: number
    failedCount: number
    id: string
    releasedCount: number
    status: 'draft' | 'ready' | 'processing' | 'completed' | 'failed'
    totalAmount: number
    updatedAt: string
  }>
  balance: {
    amount: number
    currency: string
    lastUpdatedAt: string
    message: string
    mode: 'mock' | 'live'
  }
  providerMode: 'mock' | 'live'
  readyItems: Array<{
    accountName: string | null
    accountNumberLast4: string
    amount: number | null
    bankCode: string
    beneficiaryId: string
    decision: 'approved' | 'review' | 'rejected'
    fullName: string
    latestPayoutStatus: SquadPayoutStatus | null
    organizationName: string
    programName: string
    referenceId: string
    riskScore: number | null
  }>
  recentPayouts: Array<{
    amount: number
    batchId: string
    batchName: string
    beneficiaryId: string
    fullName: string
    id: string
    releasedAt: string | null
    squadStatus: SquadPayoutStatus
    transactionReference: string | null
    updatedAt: string
  }>
  summary: {
    completedCount: number
    processingCount: number
    readyCount: number
    totalReadyAmount: number
  }
}

export interface ReleaseApprovedPayoutsResponse {
  batches: Array<{
    batchId: string
    batchName: string
    beneficiaryCount: number
    status: 'draft' | 'ready' | 'processing' | 'completed' | 'failed'
    totalAmount: number
  }>
  processed: Array<{
    amount: number
    beneficiaryId: string
    fullName: string
    payoutItemId: string
    providerMessage: string
    squadStatus: SquadPayoutStatus
    transactionReference: string | null
  }>
  providerMode: 'mock' | 'live'
  summary: {
    failedCount: number
    processedCount: number
    processingCount: number
    queuedCount: number
    successfulCount: number
  }
}

export interface AuditEventsResponse {
  meta: {
    limit: number
    total: number
  }
  records: Array<{
    actorName: string
    createdAt: string
    details: string
    entityId: string | null
    entityType: string
    eventType: string
    hash: string
    id: string
    payload: Record<string, unknown>
    severity: 'info' | 'warn' | 'critical'
  }>
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

export function getVerificationQueue() {
  return invokeFunction<VerificationQueueResponse>('get-verification-queue')
}

export function reviewBeneficiary(payload: {
  action: ReviewAction
  beneficiaryId: string
  notes: string
}) {
  return invokeFunction<ReviewBeneficiaryResponse>('review-beneficiary', payload)
}

export function getDisbursementDashboard() {
  return invokeFunction<DisbursementDashboardResponse>('get-disbursement-dashboard')
}

export function releaseApprovedPayouts(payload?: { beneficiaryIds?: string[] }) {
  return invokeFunction<ReleaseApprovedPayoutsResponse>('release-approved-payouts', payload ?? {})
}

export function listAuditEvents(payload?: {
  eventType?: string
  from?: string
  limit?: number
  severity?: 'critical' | 'info' | 'warn'
  to?: string
}) {
  return invokeFunction<AuditEventsResponse>('list-audit-events', payload ?? {})
}
