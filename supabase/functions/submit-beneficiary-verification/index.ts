import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json, readBody } from '../_shared/http.ts'
import { runVerificationPipelineForBeneficiary } from '../_shared/pipeline.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'

interface SubmitBeneficiaryRequest {
  accountNumber?: string
  bankCode?: string
  bankName?: string
  documentFilePath?: string
  email?: string
  fullName?: string
  organizationName?: string
  phone?: string
  programName?: string
  programType?: string
  referenceId?: string
  selfieFilePath?: string
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
    const payload = await readBody<SubmitBeneficiaryRequest>(request)
    const fullName = requiredField(payload.fullName, 'Full name')
    const referenceId = requiredField(payload.referenceId, 'Reference ID')
    const bankCode = requiredField(payload.bankCode, 'Bank')
    const accountNumber = requiredField(payload.accountNumber, 'Account number')
    const programName = payload.programName?.trim() || 'PROVA Scholarship Demo'
    const organizationName = payload.organizationName?.trim() || 'Squad Hackathon Foundation'
    const programType = payload.programType?.trim() || 'Scholarship'
    const supabase = createServiceRoleClient()

    const { data: existingProgram, error: existingProgramError } = await supabase
      .from('programs')
      .select('id, name, organization_name, program_type')
      .eq('name', programName)
      .eq('organization_name', organizationName)
      .eq('program_type', programType)
      .limit(1)
      .maybeSingle()

    if (existingProgramError) {
      throw existingProgramError
    }

    const program = existingProgram
      ? existingProgram
      : (
          await supabase
            .from('programs')
            .insert({
              name: programName,
              organization_name: organizationName,
              program_type: programType,
            })
            .select('id, name, organization_name, program_type')
            .single()
        ).data

    if (!program) {
      throw new Error('Unable to create or load program')
    }

    const { data: beneficiary, error: beneficiaryError } = await supabase
      .from('beneficiaries')
      .insert({
        account_name_lookup: payload.bankName?.trim() || null,
        account_number: accountNumber,
        bank_code: bankCode,
        email: payload.email?.trim() || null,
        full_name: fullName,
        phone: payload.phone?.trim() || null,
        program_id: program.id,
        status: 'submitted',
        student_identifier: referenceId,
      })
      .select('id')
      .single()

    if (beneficiaryError || !beneficiary) {
      throw beneficiaryError ?? new Error('Unable to create beneficiary')
    }

    const { error: submissionError } = await supabase.from('verification_submissions').insert({
      beneficiary_id: beneficiary.id,
      document_file_path: payload.documentFilePath?.trim() || null,
      selfie_file_path: payload.selfieFilePath?.trim() || null,
    })

    if (submissionError) {
      throw submissionError
    }

    const { error: auditError } = await supabase.from('audit_events').insert({
      entity_type: 'beneficiary',
      entity_id: beneficiary.id,
      event_type: 'beneficiary.submitted',
      payload: {
        bankCode,
        programId: program.id,
        referenceId,
      },
    })

    if (auditError) {
      throw auditError
    }

    const verification = await runVerificationPipelineForBeneficiary(supabase, beneficiary.id)

    return json(
      {
        accountLast4: accountNumber.slice(-4),
        applicationId: beneficiary.id,
        decision: verification.decision,
        program: {
          name: program.name,
          organizationName: program.organization_name,
          type: program.program_type,
        },
        reasonCodes: verification.reasonCodes,
        status: verification.status,
      },
      201,
    )
  } catch (error) {
    return failure('Unable to submit beneficiary verification', 400, error instanceof Error ? error.message : error)
  }
})