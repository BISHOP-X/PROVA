import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json } from '../_shared/http.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'
import { getSquadMerchantBalance, getSquadMode, requerySquadTransfer } from '../_shared/squad.ts'

type BeneficiaryStatus = 'draft' | 'pending' | 'submitted' | 'approved' | 'review' | 'rejected'
type BatchStatus = 'draft' | 'ready' | 'processing' | 'completed' | 'failed'
type PayoutStatus = 'pending' | 'queued' | 'processing' | 'successful' | 'failed'

interface ProgramRecord {
  id: string
  name: string
  organization_name: string
  program_type: string
}

interface BeneficiaryRecord {
  account_name_lookup: string | null
  account_number: string
  bank_code: string
  full_name: string
  id: string
  program: ProgramRecord | ProgramRecord[] | null
  status: BeneficiaryStatus
  student_identifier: string
}

interface VerificationRecord {
  beneficiary_id: string
  decision: 'approved' | 'review' | 'rejected'
  risk_score: number | string | null
  created_at: string
}

interface BatchRecord {
  batch_name: string
  created_at: string
  id: string
  status: BatchStatus
  total_amount: number | string
  updated_at: string
}

interface PayoutRecord {
  amount: number | string
  batch_id: string
  beneficiary_id: string
  id: string
  released_at: string | null
  squad_status: PayoutStatus
  squad_transaction_reference: string | null
  updated_at: string
}

function programFromRecord(record: ProgramRecord | ProgramRecord[] | null) {
  if (Array.isArray(record)) {
    return record[0] ?? null
  }

  return record
}

async function refreshPendingTransfers() {
  if (getSquadMode() !== 'live') {
    return
  }

  const supabase = createServiceRoleClient()
  const { data: pendingTransfers, error } = await supabase
    .from('payout_items')
    .select('id, squad_transaction_reference')
    .in('squad_status', ['queued', 'processing'])
    .not('squad_transaction_reference', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(4)

  if (error) {
    throw error
  }

  for (const payout of pendingTransfers ?? []) {
    const transactionReference = payout.squad_transaction_reference

    if (!transactionReference) {
      continue
    }

    const requeryResult = await requerySquadTransfer(transactionReference)
    await supabase
      .from('payout_items')
      .update({
        released_at: requeryResult.squadStatus === 'successful' ? new Date().toISOString() : null,
        squad_status: requeryResult.squadStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payout.id)
  }
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
    await refreshPendingTransfers()

    const supabase = createServiceRoleClient()
    const [balance, beneficiariesResponse, verificationResponse, batchesResponse, payoutsResponse] = await Promise.all([
      getSquadMerchantBalance(),
      supabase
        .from('beneficiaries')
        .select(
          'id, full_name, student_identifier, bank_code, account_number, account_name_lookup, status, program:programs(id, name, organization_name, program_type)',
        )
        .order('created_at', { ascending: false }),
      supabase
        .from('verification_results')
        .select('beneficiary_id, decision, risk_score, created_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('payout_batches')
        .select('id, batch_name, total_amount, status, created_at, updated_at')
        .order('updated_at', { ascending: false }),
      supabase
        .from('payout_items')
        .select(
          'id, batch_id, beneficiary_id, amount, squad_status, squad_transaction_reference, released_at, updated_at',
        )
        .order('updated_at', { ascending: false }),
    ])

    if (beneficiariesResponse.error) {
      throw beneficiariesResponse.error
    }

    if (verificationResponse.error) {
      throw verificationResponse.error
    }

    if (batchesResponse.error) {
      throw batchesResponse.error
    }

    if (payoutsResponse.error) {
      throw payoutsResponse.error
    }

    const verificationByBeneficiary = new Map<string, VerificationRecord>()
    const latestPayoutByBeneficiary = new Map<string, PayoutRecord>()
    const payoutsByBatch = new Map<string, PayoutRecord[]>()

    for (const result of (verificationResponse.data ?? []) as VerificationRecord[]) {
      if (!verificationByBeneficiary.has(result.beneficiary_id)) {
        verificationByBeneficiary.set(result.beneficiary_id, result)
      }
    }

    for (const payout of (payoutsResponse.data ?? []) as PayoutRecord[]) {
      if (!latestPayoutByBeneficiary.has(payout.beneficiary_id)) {
        latestPayoutByBeneficiary.set(payout.beneficiary_id, payout)
      }

      const batchPayouts = payoutsByBatch.get(payout.batch_id) ?? []
      batchPayouts.push(payout)
      payoutsByBatch.set(payout.batch_id, batchPayouts)
    }

    const beneficiaries = (beneficiariesResponse.data ?? []) as BeneficiaryRecord[]
    const readyItems = beneficiaries
      .filter((beneficiary) => beneficiary.status === 'approved')
      .map((beneficiary) => {
        const latestResult = verificationByBeneficiary.get(beneficiary.id)
        const latestPayout = latestPayoutByBeneficiary.get(beneficiary.id)
        const program = programFromRecord(beneficiary.program)
        const latestStatus = latestPayout?.squad_status ?? null

        return {
          accountName: beneficiary.account_name_lookup,
          accountNumberLast4: beneficiary.account_number.slice(-4),
          amount: latestPayout ? Number(latestPayout.amount) : null,
          bankCode: beneficiary.bank_code,
          beneficiaryId: beneficiary.id,
          decision: latestResult?.decision ?? 'approved',
          fullName: beneficiary.full_name,
          latestPayoutStatus: latestStatus,
          organizationName: program?.organization_name ?? 'Unassigned program',
          programName: program?.name ?? 'Program pending',
          referenceId: beneficiary.student_identifier,
          riskScore: latestResult?.risk_score === null || latestResult?.risk_score === undefined ? null : Number(latestResult.risk_score),
        }
      })
      .filter((item) => !item.latestPayoutStatus || item.latestPayoutStatus === 'failed')

    const activeBatches = ((batchesResponse.data ?? []) as BatchRecord[])
      .map((batch) => {
        const batchPayouts = payoutsByBatch.get(batch.id) ?? []

        return {
          batchName: batch.batch_name,
          beneficiaryCount: batchPayouts.length,
          failedCount: batchPayouts.filter((item) => item.squad_status === 'failed').length,
          id: batch.id,
          releasedCount: batchPayouts.filter((item) => item.squad_status === 'successful').length,
          status: batch.status,
          totalAmount: Number(batch.total_amount),
          updatedAt: batch.updated_at,
        }
      })
      .filter((batch) => batch.status !== 'completed')

    const beneficiaryNameById = new Map(beneficiaries.map((beneficiary) => [beneficiary.id, beneficiary.full_name]))
    const recentPayouts = ((payoutsResponse.data ?? []) as PayoutRecord[]).slice(0, 12).map((payout) => {
      const batch = ((batchesResponse.data ?? []) as BatchRecord[]).find((item) => item.id === payout.batch_id)

      return {
        amount: Number(payout.amount),
        batchId: payout.batch_id,
        batchName: batch?.batch_name ?? 'PROVA payout batch',
        beneficiaryId: payout.beneficiary_id,
        fullName: beneficiaryNameById.get(payout.beneficiary_id) ?? 'Unknown beneficiary',
        id: payout.id,
        releasedAt: payout.released_at,
        squadStatus: payout.squad_status,
        transactionReference: payout.squad_transaction_reference,
        updatedAt: payout.updated_at,
      }
    })

    return json({
      activeBatches,
      balance,
      providerMode: balance.mode,
      readyItems,
      recentPayouts,
      summary: {
        completedCount: recentPayouts.filter((item) => item.squadStatus === 'successful').length,
        processingCount: recentPayouts.filter((item) => ['queued', 'processing'].includes(item.squadStatus)).length,
        readyCount: readyItems.length,
        totalReadyAmount: readyItems.reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
      },
    })
  } catch (error) {
    return failure(
      'Unable to load disbursement dashboard',
      500,
      error instanceof Error ? error.message : error,
    )
  }
})
