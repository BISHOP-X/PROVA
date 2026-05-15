import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json, readBody } from '../_shared/http.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'
import {
  createSquadTransferReference,
  lookupSquadAccount,
  transferWithSquad,
  type PayoutItemStatus,
} from '../_shared/squad.ts'

type BatchStatus = 'draft' | 'ready' | 'processing' | 'completed' | 'failed'

interface ReleaseRequest {
  beneficiaryIds?: string[]
}

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
  program_id: string
  status: string
  student_identifier: string
}

interface VerificationRecord {
  beneficiary_id: string
  decision: 'approved' | 'review' | 'rejected'
  risk_score: number | string | null
}

interface ExistingPayoutRecord {
  beneficiary_id: string
  squad_status: PayoutItemStatus
  updated_at: string
}

function programFromRecord(record: ProgramRecord | ProgramRecord[] | null) {
  if (Array.isArray(record)) {
    return record[0] ?? null
  }

  return record
}

function amountForProgram(programType: string, referenceId: string) {
  const baseAmount =
    programType.toLowerCase() === 'stipend'
      ? 85000
      : programType.toLowerCase() === 'grant'
        ? 400000
        : programType.toLowerCase() === 'bursary'
          ? 120000
          : 250000

  const spreadSeed = referenceId
    .split('')
    .reduce((sum, character) => sum + character.charCodeAt(0), 0)

  return baseAmount + (spreadSeed % 12) * 2500
}

function batchStatusFromItems(statuses: PayoutItemStatus[]): BatchStatus {
  if (!statuses.length) {
    return 'draft'
  }

  if (statuses.every((status) => status === 'successful')) {
    return 'completed'
  }

  if (statuses.some((status) => status === 'failed') && statuses.every((status) => status === 'failed')) {
    return 'failed'
  }

  if (statuses.some((status) => ['queued', 'processing'].includes(status))) {
    return 'processing'
  }

  if (statuses.some((status) => status === 'successful')) {
    return 'processing'
  }

  return 'ready'
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
    const payload = await readBody<ReleaseRequest>(request)
    const selectedBeneficiaryIds = new Set((payload.beneficiaryIds ?? []).filter(Boolean))
    const supabase = createServiceRoleClient()

    const { data: beneficiaries, error: beneficiariesError } = await supabase
      .from('beneficiaries')
      .select(
        'id, full_name, student_identifier, bank_code, account_number, account_name_lookup, status, program_id, program:programs(id, name, organization_name, program_type)',
      )
      .eq('status', 'approved')

    if (beneficiariesError) {
      throw beneficiariesError
    }

    const approvedBeneficiaries = (beneficiaries ?? []) as BeneficiaryRecord[]
    const candidateBeneficiaries = selectedBeneficiaryIds.size
      ? approvedBeneficiaries.filter((beneficiary) => selectedBeneficiaryIds.has(beneficiary.id))
      : approvedBeneficiaries

    if (!candidateBeneficiaries.length) {
      throw new Error('No approved beneficiaries are available for payout release')
    }

    const beneficiaryIds = candidateBeneficiaries.map((beneficiary) => beneficiary.id)
    const [verificationResponse, existingPayoutsResponse] = await Promise.all([
      supabase
        .from('verification_results')
        .select('beneficiary_id, decision, risk_score')
        .in('beneficiary_id', beneficiaryIds)
        .order('created_at', { ascending: false }),
      supabase
        .from('payout_items')
        .select('beneficiary_id, squad_status, updated_at')
        .in('beneficiary_id', beneficiaryIds)
        .order('updated_at', { ascending: false }),
    ])

    if (verificationResponse.error) {
      throw verificationResponse.error
    }

    if (existingPayoutsResponse.error) {
      throw existingPayoutsResponse.error
    }

    const verificationByBeneficiary = new Map<string, VerificationRecord>()
    const existingPayoutByBeneficiary = new Map<string, ExistingPayoutRecord>()

    for (const result of (verificationResponse.data ?? []) as VerificationRecord[]) {
      if (!verificationByBeneficiary.has(result.beneficiary_id)) {
        verificationByBeneficiary.set(result.beneficiary_id, result)
      }
    }

    for (const payout of (existingPayoutsResponse.data ?? []) as ExistingPayoutRecord[]) {
      if (!existingPayoutByBeneficiary.has(payout.beneficiary_id)) {
        existingPayoutByBeneficiary.set(payout.beneficiary_id, payout)
      }
    }

    const eligibleBeneficiaries = candidateBeneficiaries.filter((beneficiary) => {
      const latestPayout = existingPayoutByBeneficiary.get(beneficiary.id)
      return !latestPayout || latestPayout.squad_status === 'failed'
    })

    if (!eligibleBeneficiaries.length) {
      throw new Error('Every selected beneficiary already has an active or completed payout')
    }

    const beneficiariesByProgram = new Map<string, BeneficiaryRecord[]>()

    for (const beneficiary of eligibleBeneficiaries) {
      const existingGroup = beneficiariesByProgram.get(beneficiary.program_id) ?? []
      existingGroup.push(beneficiary)
      beneficiariesByProgram.set(beneficiary.program_id, existingGroup)
    }

    const batches: Array<{
      batchId: string
      batchName: string
      beneficiaryCount: number
      status: BatchStatus
      totalAmount: number
    }> = []
    const processed: Array<{
      amount: number
      beneficiaryId: string
      fullName: string
      payoutItemId: string
      providerMessage: string
      squadStatus: PayoutItemStatus
      transactionReference: string | null
    }> = []

    for (const [programId, groupedBeneficiaries] of beneficiariesByProgram.entries()) {
      const firstBeneficiary = groupedBeneficiaries[0]
      const program = programFromRecord(firstBeneficiary.program)
      const batchName = `${program?.name ?? 'PROVA'} Batch ${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric' })}`

      const { data: batch, error: batchError } = await supabase
        .from('payout_batches')
        .insert({
          batch_name: batchName,
          program_id: programId,
          status: 'draft',
          total_amount: 0,
        })
        .select('id')
        .single()

      if (batchError || !batch) {
        throw batchError ?? new Error('Unable to create payout batch')
      }

      const batchStatuses: PayoutItemStatus[] = []
      let batchTotalAmount = 0

      for (const beneficiary of groupedBeneficiaries) {
        const latestVerification = verificationByBeneficiary.get(beneficiary.id)
        const programRecord = programFromRecord(beneficiary.program)
        const amount = amountForProgram(programRecord?.program_type ?? 'Scholarship', beneficiary.student_identifier)
        batchTotalAmount += amount

        const lookupResult = await lookupSquadAccount({
          accountNameHint: beneficiary.account_name_lookup ?? undefined,
          accountNumber: beneficiary.account_number,
          bankCode: beneficiary.bank_code,
          fullName: beneficiary.full_name,
        })

        await supabase
          .from('beneficiaries')
          .update({
            account_name_lookup: lookupResult.accountName,
            updated_at: new Date().toISOString(),
          })
          .eq('id', beneficiary.id)

        const { data: payoutItem, error: payoutInsertError } = await supabase
          .from('payout_items')
          .insert({
            amount,
            batch_id: batch.id,
            beneficiary_id: beneficiary.id,
            decision_snapshot: latestVerification?.decision ?? 'approved',
            squad_status: 'pending',
          })
          .select('id')
          .single()

        if (payoutInsertError || !payoutItem) {
          throw payoutInsertError ?? new Error('Unable to create payout item')
        }

        const transactionReference = createSquadTransferReference(`${beneficiary.id}:${batch.id}:${amount}`)

        try {
          const transferResult = await transferWithSquad({
            accountName: lookupResult.accountName,
            accountNumber: beneficiary.account_number,
            amount,
            bankCode: beneficiary.bank_code,
            remark: `PROVA payout for ${beneficiary.full_name}`,
            transactionReference,
          })

          batchStatuses.push(transferResult.squadStatus)

          await supabase
            .from('payout_items')
            .update({
              released_at:
                transferResult.squadStatus === 'successful' ? new Date().toISOString() : null,
              squad_status: transferResult.squadStatus,
              squad_transaction_reference: transferResult.transactionReference,
              updated_at: new Date().toISOString(),
            })
            .eq('id', payoutItem.id)

          await supabase.from('audit_events').insert({
            entity_type: 'payout_item',
            entity_id: payoutItem.id,
            event_type:
              transferResult.squadStatus === 'failed' ? 'payout.failed' : 'payout.released',
            payload: {
              amount,
              beneficiaryId: beneficiary.id,
              providerMessage: transferResult.message,
              providerMode: transferResult.mode,
              squadStatus: transferResult.squadStatus,
              transactionReference: transferResult.transactionReference,
            },
          })

          processed.push({
            amount,
            beneficiaryId: beneficiary.id,
            fullName: beneficiary.full_name,
            payoutItemId: payoutItem.id,
            providerMessage: transferResult.message,
            squadStatus: transferResult.squadStatus,
            transactionReference: transferResult.transactionReference,
          })
        } catch (error) {
          batchStatuses.push('failed')

          await supabase
            .from('payout_items')
            .update({
              squad_status: 'failed',
              squad_transaction_reference: transactionReference,
              updated_at: new Date().toISOString(),
            })
            .eq('id', payoutItem.id)

          await supabase.from('audit_events').insert({
            entity_type: 'payout_item',
            entity_id: payoutItem.id,
            event_type: 'payout.failed',
            payload: {
              amount,
              beneficiaryId: beneficiary.id,
              providerMessage: error instanceof Error ? error.message : error,
              transactionReference,
            },
          })

          processed.push({
            amount,
            beneficiaryId: beneficiary.id,
            fullName: beneficiary.full_name,
            payoutItemId: payoutItem.id,
            providerMessage: error instanceof Error ? error.message : 'Payout failed',
            squadStatus: 'failed',
            transactionReference,
          })
        }
      }

      const batchStatus = batchStatusFromItems(batchStatuses)

      await supabase
        .from('payout_batches')
        .update({
          status: batchStatus,
          total_amount: batchTotalAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', batch.id)

      await supabase.from('audit_events').insert({
        entity_type: 'payout_batch',
        entity_id: batch.id,
        event_type: 'payout.batch_created',
        payload: {
          beneficiaryCount: groupedBeneficiaries.length,
          status: batchStatus,
          totalAmount: batchTotalAmount,
        },
      })

      batches.push({
        batchId: batch.id,
        batchName,
        beneficiaryCount: groupedBeneficiaries.length,
        status: batchStatus,
        totalAmount: batchTotalAmount,
      })
    }

    return json({
      batches,
      processed,
      providerMode: processed[0]?.providerMessage?.toLowerCase().includes('mock') ? 'mock' : 'live',
      summary: {
        failedCount: processed.filter((item) => item.squadStatus === 'failed').length,
        processedCount: processed.length,
        processingCount: processed.filter((item) => item.squadStatus === 'processing').length,
        queuedCount: processed.filter((item) => item.squadStatus === 'queued').length,
        successfulCount: processed.filter((item) => item.squadStatus === 'successful').length,
      },
    })
  } catch (error) {
    return failure('Unable to release approved payouts', 400, error instanceof Error ? error.message : error)
  }
})
