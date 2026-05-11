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

function relativeTime(timestamp: string) {
  const createdAt = new Date(timestamp).getTime()
  const now = Date.now()
  const diffInHours = Math.max(1, Math.round((now - createdAt) / (1000 * 60 * 60)))

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }

  const diffInDays = Math.round(diffInHours / 24)
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
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
    const [beneficiariesResponse, resultsResponse, programsResponse] = await Promise.all([
      supabase
        .from('beneficiaries')
        .select('id, full_name, student_identifier, status, created_at, updated_at, program:programs(name, organization_name, program_type)')
        .order('created_at', { ascending: false }),
      supabase
        .from('verification_results')
        .select('beneficiary_id, decision, risk_score, created_at')
        .order('created_at', { ascending: false }),
      supabase.from('programs').select('id'),
    ])

    if (beneficiariesResponse.error) {
      throw beneficiariesResponse.error
    }

    if (resultsResponse.error) {
      throw resultsResponse.error
    }

    if (programsResponse.error) {
      throw programsResponse.error
    }

    const beneficiaries = (beneficiariesResponse.data ?? []) as BeneficiaryRecord[]
    const results = (resultsResponse.data ?? []) as VerificationRecord[]
    const latestResultByBeneficiary = new Map<string, VerificationRecord>()

    for (const result of results) {
      if (!latestResultByBeneficiary.has(result.beneficiary_id)) {
        latestResultByBeneficiary.set(result.beneficiary_id, result)
      }
    }

    const totalBeneficiaries = beneficiaries.length
    const pendingVerifications = beneficiaries.filter((beneficiary) =>
      ['submitted', 'review'].includes(beneficiary.status),
    ).length
    const approvedBeneficiaries = beneficiaries.filter((beneficiary) => beneficiary.status === 'approved').length
    const activePrograms = programsResponse.data?.length ?? 0

    const trustInputs = beneficiaries
      .map((beneficiary) => latestResultByBeneficiary.get(beneficiary.id))
      .filter((record): record is VerificationRecord => Boolean(record))

    const trustScore = trustInputs.length
      ? Math.round(
          trustInputs.reduce((sum, record) => sum + (100 - Number(record.risk_score ?? 0)), 0) /
            trustInputs.length,
        )
      : 0

    const recentQueue = beneficiaries.slice(0, 5).map((beneficiary) => {
      const program = programFromRecord(beneficiary.program)
      const latestResult = latestResultByBeneficiary.get(beneficiary.id)

      return {
        id: beneficiary.id,
        name: beneficiary.full_name,
        type: program?.program_type ?? 'Program beneficiary',
        referenceId: beneficiary.student_identifier,
        risk: riskLevel(latestResult?.risk_score ?? null),
        status: beneficiary.status,
        time: relativeTime(beneficiary.created_at),
      }
    })

    return json({
      metrics: {
        activePrograms,
        approvedBeneficiaries,
        pendingVerifications,
        totalBeneficiaries,
        trustScore,
      },
      recentQueue,
    })
  } catch (error) {
    return failure('Unable to load dashboard data', 500, error instanceof Error ? error.message : error)
  }
})