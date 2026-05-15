import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json, readBody } from '../_shared/http.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'

type ReviewAction = 'approve' | 'review' | 'reject'
type BeneficiaryStatus = 'approved' | 'review' | 'rejected'

interface ReviewRequest {
  action?: ReviewAction
  beneficiaryId?: string
  notes?: string
}

interface VerificationRecord {
  created_by: string | null
  document_score: number | string | null
  face_match_score: number | string | null
  id: string
  liveness_score: number | string | null
  raw_provider_summary: Record<string, unknown> | null
  reason_codes: string[]
  risk_score: number | string | null
}

function requireField(value: string | undefined, fieldName: string) {
  const normalized = value?.trim()

  if (!normalized) {
    throw new Error(`${fieldName} is required`)
  }

  return normalized
}

function mapActionToStatus(action: ReviewAction): BeneficiaryStatus {
  if (action === 'approve') {
    return 'approved'
  }

  if (action === 'reject') {
    return 'rejected'
  }

  return 'review'
}

Deno.serve(async (request) => {
  const optionsResponse = handleOptions(request)

  if (optionsResponse) {
    return optionsResponse
  }

  if (request.method !== 'POST') {
    return failure('Method not allowed', 405)
  }

  try {
    const payload = await readBody<ReviewRequest>(request)
    const beneficiaryId = requireField(payload.beneficiaryId, 'Beneficiary ID')
    const notes = requireField(payload.notes, 'Reviewer notes')
    const action = payload.action

    if (!action || !['approve', 'review', 'reject'].includes(action)) {
      throw new Error('Review action must be approve, review, or reject')
    }

    const nextStatus = mapActionToStatus(action)
    const supabase = createServiceRoleClient()

    const { data: beneficiary, error: beneficiaryError } = await supabase
      .from('beneficiaries')
      .select('id, status')
      .eq('id', beneficiaryId)
      .single()

    if (beneficiaryError || !beneficiary) {
      throw beneficiaryError ?? new Error('Beneficiary not found')
    }

    const { data: latestVerification, error: verificationError } = await supabase
      .from('verification_results')
      .select(
        'id, liveness_score, face_match_score, document_score, risk_score, reason_codes, raw_provider_summary, created_by',
      )
      .eq('beneficiary_id', beneficiaryId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (verificationError || !latestVerification) {
      throw verificationError ?? new Error('No verification result exists for this beneficiary')
    }

    const verificationRecord = latestVerification as VerificationRecord
    const { data: reviewResult, error: reviewInsertError } = await supabase
      .from('verification_results')
      .insert({
        beneficiary_id: beneficiaryId,
        created_by: verificationRecord.created_by,
        decision: nextStatus,
        document_score: verificationRecord.document_score,
        face_match_score: verificationRecord.face_match_score,
        liveness_score: verificationRecord.liveness_score,
        raw_provider_summary: {
          ...(verificationRecord.raw_provider_summary ?? {}),
          lastManualAction: nextStatus,
          manualReviewAt: new Date().toISOString(),
        },
        reason_codes: verificationRecord.reason_codes,
        review_notes: notes,
        risk_score: verificationRecord.risk_score,
      })
      .select('id')
      .single()

    if (reviewInsertError || !reviewResult) {
      throw reviewInsertError ?? new Error('Unable to save review decision')
    }

    const { error: beneficiaryUpdateError } = await supabase
      .from('beneficiaries')
      .update({ status: nextStatus })
      .eq('id', beneficiaryId)

    if (beneficiaryUpdateError) {
      throw beneficiaryUpdateError
    }

    const { error: auditError } = await supabase.from('audit_events').insert({
      entity_type: 'beneficiary',
      entity_id: beneficiaryId,
      event_type: `review.${nextStatus}`,
      payload: {
        notes,
        previousStatus: beneficiary.status,
        reviewResultId: reviewResult.id,
      },
    })

    if (auditError) {
      throw auditError
    }

    return json({
      beneficiaryId,
      decision: nextStatus,
      notes,
      reviewResultId: reviewResult.id,
      status: nextStatus,
    })
  } catch (error) {
    return failure('Unable to review beneficiary', 400, error instanceof Error ? error.message : error)
  }
})
