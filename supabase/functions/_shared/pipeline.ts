import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import {
  computeVerificationScores,
  type VerificationDecision,
  type VerificationRule,
} from './scoring.ts'

type BeneficiaryStatus = 'approved' | 'review' | 'rejected'

interface PipelineResult {
  beneficiaryId: string
  status: BeneficiaryStatus
  decision: VerificationDecision
  verificationResultId: string
  livenessScore: number
  faceMatchScore: number
  documentScore: number
  riskScore: number
  reasonCodes: string[]
}

function statusFromDecision(decision: VerificationDecision): BeneficiaryStatus {
  if (decision === 'approved') {
    return 'approved'
  }

  if (decision === 'review') {
    return 'review'
  }

  return 'rejected'
}

export async function runVerificationPipelineForBeneficiary(
  supabase: SupabaseClient,
  beneficiaryId: string,
): Promise<PipelineResult> {
  const { data: beneficiary, error: beneficiaryError } = await supabase
    .from('beneficiaries')
    .select('id, full_name, student_identifier, bank_code, account_number')
    .eq('id', beneficiaryId)
    .single()

  if (beneficiaryError || !beneficiary) {
    throw new Error('Beneficiary not found for verification pipeline run')
  }

  const { data: submission, error: submissionError } = await supabase
    .from('verification_submissions')
    .select('id, selfie_file_path, document_file_path, submitted_at')
    .eq('beneficiary_id', beneficiaryId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (submissionError) {
    throw submissionError
  }

  const { data: rules, error: rulesError } = await supabase
    .from('verification_rules')
    .select('rule_key, threshold_value, decision_on_fail, is_active')
    .eq('is_active', true)

  if (rulesError) {
    throw rulesError
  }

  const { count, error: duplicateError } = await supabase
    .from('beneficiaries')
    .select('*', { count: 'exact', head: true })
    .eq('bank_code', beneficiary.bank_code)
    .eq('account_number', beneficiary.account_number)

  if (duplicateError) {
    throw duplicateError
  }

  const scores = computeVerificationScores(
    {
      fullName: beneficiary.full_name,
      studentIdentifier: beneficiary.student_identifier,
      bankCode: beneficiary.bank_code,
      accountNumber: beneficiary.account_number,
      hasDocument: Boolean(submission?.document_file_path),
      hasSelfie: Boolean(submission?.selfie_file_path),
      duplicateAccountCount: count ?? 1,
    },
    (rules ?? []) as VerificationRule[],
  )

  const { data: verificationResult, error: verificationError } = await supabase
    .from('verification_results')
    .insert({
      beneficiary_id: beneficiaryId,
      liveness_score: scores.livenessScore,
      face_match_score: scores.faceMatchScore,
      document_score: scores.documentScore,
      risk_score: scores.riskScore,
      decision: scores.decision,
      reason_codes: scores.reasonCodes,
      raw_provider_summary: scores.rawProviderSummary,
      review_notes:
        scores.decision === 'approved'
          ? 'Approved by the MVP verification pipeline.'
          : 'Flagged by the MVP verification pipeline for additional review.',
    })
    .select('id')
    .single()

  if (verificationError || !verificationResult) {
    throw verificationError ?? new Error('Unable to record verification result')
  }

  const status = statusFromDecision(scores.decision)

  const { error: beneficiaryUpdateError } = await supabase
    .from('beneficiaries')
    .update({ status })
    .eq('id', beneficiaryId)

  if (beneficiaryUpdateError) {
    throw beneficiaryUpdateError
  }

  const { error: auditError } = await supabase.from('audit_events').insert({
    entity_type: 'beneficiary',
    entity_id: beneficiaryId,
    event_type: 'verification.completed',
    payload: {
      decision: scores.decision,
      reasonCodes: scores.reasonCodes,
      riskScore: scores.riskScore,
      verificationResultId: verificationResult.id,
    },
  })

  if (auditError) {
    throw auditError
  }

  return {
    beneficiaryId,
    status,
    decision: scores.decision,
    verificationResultId: verificationResult.id,
    livenessScore: scores.livenessScore,
    faceMatchScore: scores.faceMatchScore,
    documentScore: scores.documentScore,
    riskScore: scores.riskScore,
    reasonCodes: scores.reasonCodes,
  }
}