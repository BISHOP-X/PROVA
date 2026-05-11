import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json, readBody } from '../_shared/http.ts'
import { runVerificationPipelineForBeneficiary } from '../_shared/pipeline.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'

interface RunVerificationRequest {
  beneficiaryId?: string
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
    const payload = await readBody<RunVerificationRequest>(request)
    const beneficiaryId = payload.beneficiaryId?.trim()

    if (!beneficiaryId) {
      return failure('Beneficiary ID is required', 400)
    }

    const supabase = createServiceRoleClient()
    const result = await runVerificationPipelineForBeneficiary(supabase, beneficiaryId)
    return json(result)
  } catch (error) {
    return failure('Unable to run verification pipeline', 400, error instanceof Error ? error.message : error)
  }
})