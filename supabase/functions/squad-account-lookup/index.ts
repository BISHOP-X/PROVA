import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json, readBody } from '../_shared/http.ts'
import { lookupSquadAccount } from '../_shared/squad.ts'

interface LookupRequest {
  account_number?: string
  bank_code?: string
  full_name?: string
}

function requiredField(value: string | undefined, fieldName: string) {
  const normalized = value?.trim()

  if (!normalized) {
    throw new Error(`${fieldName} is required`)
  }

  return normalized
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
    const payload = await readBody<LookupRequest>(request)
    const result = await lookupSquadAccount({
      accountNumber: requiredField(payload.account_number, 'Account number'),
      bankCode: requiredField(payload.bank_code, 'Bank code'),
      fullName: payload.full_name?.trim(),
    })

    return json(result)
  } catch (error) {
    return failure('Unable to perform Squad account lookup', 400, error instanceof Error ? error.message : error)
  }
})
