import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json, readBody } from '../_shared/http.ts'
import { transferWithSquad } from '../_shared/squad.ts'

interface TransferRequest {
  account_name?: string
  account_number?: string
  amount?: number
  bank_code?: string
  remark?: string
  transaction_reference?: string
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
    const payload = await readBody<TransferRequest>(request)

    if (!payload.amount || Number(payload.amount) <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    const result = await transferWithSquad({
      accountName: requiredField(payload.account_name, 'Account name'),
      accountNumber: requiredField(payload.account_number, 'Account number'),
      amount: Number(payload.amount),
      bankCode: requiredField(payload.bank_code, 'Bank code'),
      remark: requiredField(payload.remark, 'Remark'),
      transactionReference: requiredField(payload.transaction_reference, 'Transaction reference'),
    })

    return json(result)
  } catch (error) {
    return failure('Unable to initiate Squad transfer', 400, error instanceof Error ? error.message : error)
  }
})
