import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json, readBody } from '../_shared/http.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'

interface StatusRequest {
  applicationId?: string
}

interface ProgramRecord {
  name: string
  organization_name: string
  program_type: string
}

interface BeneficiaryRecord {
  id: string
  full_name: string
  student_identifier: string
  bank_code: string
  account_number: string
  status: 'draft' | 'pending' | 'submitted' | 'approved' | 'review' | 'rejected'
  created_at: string
  updated_at: string
  program: ProgramRecord | ProgramRecord[] | null
}

interface VerificationRecord {
  decision: 'approved' | 'review' | 'rejected'
  liveness_score: number | string | null
  face_match_score: number | string | null
  document_score: number | string | null
  risk_score: number | string | null
  reason_codes: string[]
  created_at: string
}

interface PayoutRecord {
  amount: number | string
  squad_status: string
  released_at: string | null
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function programFromRecord(record: ProgramRecord | ProgramRecord[] | null) {
  if (Array.isArray(record)) {
    return record[0] ?? null
  }

  return record
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
    const url = new URL(request.url)
    const body = request.method === 'POST' ? await readBody<StatusRequest>(request) : {}
    const applicationId = body.applicationId?.trim() || url.searchParams.get('applicationId')?.trim() || ''

    if (!applicationId) {
      return failure('Application ID is required', 400)
    }

    const supabase = createServiceRoleClient()
    const beneficiaryQuery = supabase
      .from('beneficiaries')
      .select('id, full_name, student_identifier, bank_code, account_number, status, created_at, updated_at, program:programs(name, organization_name, program_type)')
      .limit(1)

    const { data: beneficiary, error: beneficiaryError } = await (isUuid(applicationId)
      ? beneficiaryQuery.eq('id', applicationId)
      : beneficiaryQuery.eq('student_identifier', applicationId)
    ).maybeSingle()

    if (beneficiaryError) {
      throw beneficiaryError
    }

    if (!beneficiary) {
      return failure('Application not found', 404)
    }

    const typedBeneficiary = beneficiary as BeneficiaryRecord
    const [submissionResponse, verificationResponse, payoutResponse, auditResponse] = await Promise.all([
      supabase
        .from('verification_submissions')
        .select('submitted_at')
        .eq('beneficiary_id', typedBeneficiary.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('verification_results')
        .select('decision, liveness_score, face_match_score, document_score, risk_score, reason_codes, created_at')
        .eq('beneficiary_id', typedBeneficiary.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('payout_items')
        .select('amount, squad_status, released_at')
        .eq('beneficiary_id', typedBeneficiary.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('audit_events')
        .select('event_type, payload, created_at')
        .eq('entity_id', typedBeneficiary.id)
        .order('created_at', { ascending: true }),
    ])

    if (submissionResponse.error) {
      throw submissionResponse.error
    }

    if (verificationResponse.error) {
      throw verificationResponse.error
    }

    if (payoutResponse.error) {
      throw payoutResponse.error
    }

    if (auditResponse.error) {
      throw auditResponse.error
    }

    const program = programFromRecord(typedBeneficiary.program)
    const verification = verificationResponse.data as VerificationRecord | null
    const payout = payoutResponse.data as PayoutRecord | null

    const timeline = [
      {
        key: 'submitted',
        label: 'Details submitted',
        description: 'Your bank and program details were received by PROVA.',
        status: 'completed',
        timestamp: submissionResponse.data?.submitted_at ?? typedBeneficiary.created_at,
      },
      {
        key: 'verification',
        label: 'AI verification',
        description: verification
          ? `Decision: ${verification.decision}. Risk score ${Number(verification.risk_score ?? 0)}.`
          : 'Automated verification checks are now running.',
        status: verification ? 'completed' : 'active',
        timestamp: verification?.created_at ?? typedBeneficiary.updated_at,
      },
      {
        key: 'review',
        label: 'Reviewer decision',
        description:
          typedBeneficiary.status === 'review'
            ? 'The case is currently waiting for manual review.'
            : typedBeneficiary.status === 'approved'
              ? 'The beneficiary has been approved for payout release.'
              : typedBeneficiary.status === 'rejected'
                ? 'The application was rejected by the verification policy.'
                : typedBeneficiary.status === 'pending'
                  ? 'Your submission is queued for verification.'
                : 'A reviewer step will activate only if the AI pipeline flags the application.',
        status:
          typedBeneficiary.status === 'review'
            ? 'active'
            : ['approved', 'rejected'].includes(typedBeneficiary.status)
              ? 'completed'
              : 'pending',
        timestamp: verification?.created_at ?? null,
      },
      {
        key: 'payout',
        label: 'Payout release',
        description: payout
          ? `Funds processed with status ${payout.squad_status}.`
          : 'Funds will be released after approval and payout batching.',
        status: payout ? 'completed' : typedBeneficiary.status === 'approved' ? 'active' : 'pending',
        timestamp: payout?.released_at ?? null,
      },
    ]

    return json({
      applicationId: typedBeneficiary.id,
      auditTrail: auditResponse.data ?? [],
      beneficiary: {
        accountLast4: typedBeneficiary.account_number.slice(-4),
        currentStatus: typedBeneficiary.status,
        fullName: typedBeneficiary.full_name,
        organizationName: program?.organization_name ?? 'Pending assignment',
        programName: program?.name ?? 'Pending assignment',
        programType: program?.program_type ?? 'Program beneficiary',
        referenceId: typedBeneficiary.student_identifier,
      },
      payout: payout
        ? {
            amount: Number(payout.amount),
            releasedAt: payout.released_at,
            squadStatus: payout.squad_status,
          }
        : null,
      timeline,
      verification: verification
        ? {
            decision: verification.decision,
            documentScore: Number(verification.document_score ?? 0),
            faceMatchScore: Number(verification.face_match_score ?? 0),
            livenessScore: Number(verification.liveness_score ?? 0),
            reasonCodes: verification.reason_codes,
            riskScore: Number(verification.risk_score ?? 0),
          }
        : null,
    })
  } catch (error) {
    return failure('Unable to load beneficiary status', 500, error instanceof Error ? error.message : error)
  }
})
