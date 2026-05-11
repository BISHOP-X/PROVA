import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json } from '../_shared/http.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'

interface ProgramRecord {
  name: string
  organization_name: string
  program_type: string
}

interface BeneficiaryRecord {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  student_identifier: string
  status: 'draft' | 'submitted' | 'approved' | 'review' | 'rejected'
  created_at: string
  updated_at: string
  program: ProgramRecord | ProgramRecord[] | null
}

interface VerificationRecord {
  beneficiary_id: string
  decision: 'approved' | 'review' | 'rejected'
  risk_score: number | string | null
  created_at: string
}

interface PayoutRecord {
  beneficiary_id: string
  amount: number | string
  squad_status: string
  released_at: string | null
  updated_at: string
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function maskContact(email: string | null, phone: string | null) {
  if (email) {
    const [localPart, domain] = email.split('@')
    const head = localPart.slice(0, 2)
    return `${head}${'*'.repeat(Math.max(localPart.length - 2, 2))}@${domain}`
  }

  if (phone) {
    return `${phone.slice(0, 3)}${'*'.repeat(Math.max(phone.length - 5, 2))}${phone.slice(-2)}`
  }

  return 'Not provided'
}

function riskLevel(riskScore: number | string | null) {
  const value = Number(riskScore ?? 0)

  if (value >= 50) {
    return 'High'
  }

  if (value >= 30) {
    return 'Medium'
  }

  return 'Low'
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
    const supabase = createServiceRoleClient()
    const { data: beneficiaries, error: beneficiariesError } = await supabase
      .from('beneficiaries')
      .select('id, full_name, email, phone, student_identifier, status, created_at, updated_at, program:programs(name, organization_name, program_type)')
      .order('created_at', { ascending: false })

    if (beneficiariesError) {
      throw beneficiariesError
    }

    const beneficiaryRecords = (beneficiaries ?? []) as BeneficiaryRecord[]
    const beneficiaryIds = beneficiaryRecords.map((beneficiary) => beneficiary.id)

    if (!beneficiaryIds.length) {
      return json({
        beneficiaries: [],
        summary: {
          flagged: 0,
          pendingReview: 0,
          totalActive: 0,
        },
      })
    }

    const [resultsResponse, payoutsResponse] = await Promise.all([
      supabase
        .from('verification_results')
        .select('beneficiary_id, decision, risk_score, created_at')
        .in('beneficiary_id', beneficiaryIds)
        .order('created_at', { ascending: false }),
      supabase
        .from('payout_items')
        .select('beneficiary_id, amount, squad_status, released_at, updated_at')
        .in('beneficiary_id', beneficiaryIds)
        .order('updated_at', { ascending: false }),
    ])

    if (resultsResponse.error) {
      throw resultsResponse.error
    }

    if (payoutsResponse.error) {
      throw payoutsResponse.error
    }

    const latestResultByBeneficiary = new Map<string, VerificationRecord>()
    const latestPayoutByBeneficiary = new Map<string, PayoutRecord>()

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

    const responsePayload = beneficiaryRecords.map((beneficiary) => {
      const latestResult = latestResultByBeneficiary.get(beneficiary.id)
      const latestPayout = latestPayoutByBeneficiary.get(beneficiary.id)
      const program = programFromRecord(beneficiary.program)

      return {
        id: beneficiary.id,
        initials: initials(beneficiary.full_name),
        fullName: beneficiary.full_name,
        maskedContact: maskContact(beneficiary.email, beneficiary.phone),
        organizationName: program?.organization_name ?? 'Unassigned program',
        entity: program?.program_type ?? 'Beneficiary',
        programName: program?.name ?? 'Program pending',
        referenceId: beneficiary.student_identifier,
        status: beneficiary.status,
        latestDecision: latestResult?.decision ?? null,
        riskLevel: riskLevel(latestResult?.risk_score ?? null),
        lastPayoutAmount: latestPayout ? Number(latestPayout.amount) : null,
        lastPayoutDate: latestPayout?.released_at ?? null,
      }
    })

    const summary = {
      flagged: responsePayload.filter(
        (beneficiary) => beneficiary.riskLevel === 'High' || beneficiary.status === 'rejected',
      ).length,
      pendingReview: responsePayload.filter((beneficiary) => ['submitted', 'review'].includes(beneficiary.status)).length,
      totalActive: responsePayload.filter((beneficiary) => beneficiary.status !== 'rejected').length,
    }

    return json({
      beneficiaries: responsePayload,
      summary,
    })
  } catch (error) {
    return failure('Unable to load beneficiaries', 500, error instanceof Error ? error.message : error)
  }
})