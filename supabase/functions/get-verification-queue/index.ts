import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json } from '../_shared/http.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'

type BeneficiaryStatus = 'draft' | 'pending' | 'submitted' | 'approved' | 'review' | 'rejected'
type PayoutStatus = 'pending' | 'queued' | 'processing' | 'successful' | 'failed'

interface ProgramRecord {
  name: string
  organization_name: string
  program_type: string
}

interface BeneficiaryRecord {
  account_name_lookup: string | null
  account_number: string
  bank_code: string
  created_at: string
  full_name: string
  id: string
  program: ProgramRecord | ProgramRecord[] | null
  status: BeneficiaryStatus
  student_identifier: string
  updated_at: string
}

interface SubmissionRecord {
  beneficiary_id: string
  document_file_path: string | null
  selfie_file_path: string | null
  submitted_at: string
}

interface VerificationRecord {
  beneficiary_id: string
  created_at: string
  decision: 'approved' | 'review' | 'rejected'
  document_score: number | string | null
  face_match_score: number | string | null
  liveness_score: number | string | null
  raw_provider_summary: Record<string, unknown> | null
  reason_codes: string[]
  review_notes: string | null
  risk_score: number | string | null
}

interface PayoutRecord {
  beneficiary_id: string
  squad_status: PayoutStatus
  updated_at: string
}

function programFromRecord(record: ProgramRecord | ProgramRecord[] | null) {
  if (Array.isArray(record)) {
    return record[0] ?? null
  }

  return record
}

function numericValue(value: number | string | null) {
  return value === null ? null : Number(value)
}

Deno.serve(async (request) => {
  const optionsResponse = handleOptions(request)

  if (optionsResponse) {
    return optionsResponse
  }

  if (!['GET', 'POST'].includes(request.method)) {
    return failure('Method not allowed', 405)
  }

  try {
    const supabase = createServiceRoleClient()
    const [beneficiariesResponse, submissionsResponse, resultsResponse, payoutsResponse] = await Promise.all([
      supabase
        .from('beneficiaries')
        .select(
          'id, full_name, student_identifier, bank_code, account_number, account_name_lookup, status, created_at, updated_at, program:programs(name, organization_name, program_type)',
        )
        .order('created_at', { ascending: false }),
      supabase
        .from('verification_submissions')
        .select('beneficiary_id, selfie_file_path, document_file_path, submitted_at')
        .order('submitted_at', { ascending: false }),
      supabase
        .from('verification_results')
        .select(
          'beneficiary_id, decision, liveness_score, face_match_score, document_score, risk_score, reason_codes, review_notes, raw_provider_summary, created_at',
        )
        .order('created_at', { ascending: false }),
      supabase
        .from('payout_items')
        .select('beneficiary_id, squad_status, updated_at')
        .order('updated_at', { ascending: false }),
    ])

    if (beneficiariesResponse.error) {
      throw beneficiariesResponse.error
    }

    if (submissionsResponse.error) {
      throw submissionsResponse.error
    }

    if (resultsResponse.error) {
      throw resultsResponse.error
    }

    if (payoutsResponse.error) {
      throw payoutsResponse.error
    }

    const latestSubmissionByBeneficiary = new Map<string, SubmissionRecord>()
    const latestResultByBeneficiary = new Map<string, VerificationRecord>()
    const latestPayoutByBeneficiary = new Map<string, PayoutRecord>()

    for (const submission of (submissionsResponse.data ?? []) as SubmissionRecord[]) {
      if (!latestSubmissionByBeneficiary.has(submission.beneficiary_id)) {
        latestSubmissionByBeneficiary.set(submission.beneficiary_id, submission)
      }
    }

    for (const result of (resultsResponse.data ?? []) as VerificationRecord[]) {
      if (!latestResultByBeneficiary.has(result.beneficiary_id)) {
        latestResultByBeneficiary.set(result.beneficiary_id, result)
      }
    }

    for (const payout of (payoutsResponse.data ?? []) as PayoutRecord[]) {
      if (!latestPayoutByBeneficiary.has(payout.beneficiary_id)) {
        latestPayoutByBeneficiary.set(payout.beneficiary_id, payout)
      }
    }

    const queue = ((beneficiariesResponse.data ?? []) as BeneficiaryRecord[])
      .map((beneficiary) => {
        const submission = latestSubmissionByBeneficiary.get(beneficiary.id)
        const verification = latestResultByBeneficiary.get(beneficiary.id)
        const payout = latestPayoutByBeneficiary.get(beneficiary.id)
        const program = programFromRecord(beneficiary.program)

        return {
          accountName: beneficiary.account_name_lookup,
          accountNumberLast4: beneficiary.account_number.slice(-4),
          bankCode: beneficiary.bank_code,
          decision: verification?.decision ?? null,
          documentScore: numericValue(verification?.document_score ?? null),
          faceMatchScore: numericValue(verification?.face_match_score ?? null),
          fullName: beneficiary.full_name,
          hasDocument: Boolean(submission?.document_file_path),
          hasSelfie: Boolean(submission?.selfie_file_path),
          id: beneficiary.id,
          livenessScore: numericValue(verification?.liveness_score ?? null),
          organizationName: program?.organization_name ?? 'Unassigned program',
          payoutStatus: payout?.squad_status ?? null,
          programName: program?.name ?? 'Program pending',
          programType: program?.program_type ?? 'Beneficiary',
          providerMode:
            verification?.raw_provider_summary &&
            typeof verification.raw_provider_summary.providerMode === 'string'
              ? verification.raw_provider_summary.providerMode
              : 'mock',
          reasonCodes: verification?.reason_codes ?? [],
          referenceId: beneficiary.student_identifier,
          reviewNotes: verification?.review_notes ?? null,
          riskScore: numericValue(verification?.risk_score ?? null),
          status: beneficiary.status,
          submittedAt: submission?.submitted_at ?? beneficiary.created_at,
          updatedAt: beneficiary.updated_at,
          verificationCreatedAt: verification?.created_at ?? null,
        }
      })
      .sort((left, right) => {
        const leftRank = left.status === 'review' ? 0 : left.status === 'rejected' ? 1 : left.status === 'pending' || left.status === 'submitted' ? 2 : 3
        const rightRank = right.status === 'review' ? 0 : right.status === 'rejected' ? 1 : right.status === 'pending' || right.status === 'submitted' ? 2 : 3

        if (leftRank !== rightRank) {
          return leftRank - rightRank
        }

        return (right.riskScore ?? 0) - (left.riskScore ?? 0)
      })

    return json({
      queue,
      summary: {
        approvedCount: queue.filter((item) => item.status === 'approved').length,
        flaggedCount: queue.filter((item) => ['review', 'rejected'].includes(item.status)).length,
        pendingCount: queue.filter((item) => ['pending', 'submitted'].includes(item.status)).length,
        total: queue.length,
      },
    })
  } catch (error) {
    return failure('Unable to load verification queue', 500, error instanceof Error ? error.message : error)
  }
})
