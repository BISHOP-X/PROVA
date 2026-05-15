import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json, readBody } from '../_shared/http.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'

interface AuditRequest {
  eventType?: string
  from?: string
  limit?: number
  severity?: 'critical' | 'info' | 'warn'
  to?: string
}

interface AuditRecord {
  actor_profile_id: string | null
  created_at: string
  entity_id: string | null
  entity_type: string
  event_type: string
  id: string
  payload: Record<string, unknown>
}

function severityFromEventType(eventType: string) {
  const normalized = eventType.toLowerCase()

  if (normalized.includes('failed') || normalized.includes('rejected')) {
    return 'critical' as const
  }

  if (normalized.includes('review') || normalized.includes('queued') || normalized.includes('processing')) {
    return 'warn' as const
  }

  return 'info' as const
}

function actorLabel(record: AuditRecord, profileName: string | null) {
  if (profileName) {
    return profileName
  }

  const providerMode = typeof record.payload?.providerMode === 'string' ? record.payload.providerMode : null

  if (record.event_type.startsWith('verification.') || record.event_type.startsWith('review.')) {
    return providerMode === 'live' ? 'AI + Admin Review' : 'PROVA Demo AI'
  }

  if (record.event_type.startsWith('payout.')) {
    return providerMode === 'live' ? 'Squad Rail' : 'Squad Mock Rail'
  }

  return 'System'
}

function detailText(record: AuditRecord) {
  const payload = record.payload ?? {}

  if (record.event_type === 'beneficiary.submitted') {
    return `Beneficiary submitted with reference ${String(payload.referenceId ?? 'unknown')} and bank ${String(payload.bankCode ?? 'unknown')}.`
  }

  if (record.event_type.startsWith('verification.')) {
    return `Verification completed with decision ${String(payload.decision ?? 'unknown')} and risk score ${String(payload.riskScore ?? 'n/a')}.`
  }

  if (record.event_type.startsWith('review.')) {
    return `Reviewer set status to ${record.event_type.split('.').at(-1) ?? 'review'} with notes ${String(payload.notes ?? 'not provided')}.`
  }

  if (record.event_type === 'payout.released') {
    return `Payout released with status ${String(payload.squadStatus ?? 'unknown')} for amount ${String(payload.amount ?? '0')}.`
  }

  if (record.event_type === 'payout.failed') {
    return `Payout failed for amount ${String(payload.amount ?? '0')}: ${String(payload.providerMessage ?? 'unknown error')}.`
  }

  if (record.event_type === 'payout.batch_created') {
    return `Payout batch prepared for ${String(payload.beneficiaryCount ?? 0)} beneficiaries totaling ${String(payload.totalAmount ?? 0)}.`
  }

  return `${record.entity_type} event recorded as ${record.event_type}.`
}

async function sha256Hex(value: string) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(buffer))
    .map((part) => part.toString(16).padStart(2, '0'))
    .join('')
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
    const url = new URL(request.url)
    const body = request.method === 'POST' ? await readBody<AuditRequest>(request) : {}
    const limit = Number(body.limit ?? url.searchParams.get('limit') ?? 40)
    const eventType = body.eventType?.trim() || url.searchParams.get('eventType')?.trim() || ''
    const from = body.from?.trim() || url.searchParams.get('from')?.trim() || ''
    const to = body.to?.trim() || url.searchParams.get('to')?.trim() || ''
    const severityFilter =
      body.severity ?? (url.searchParams.get('severity')?.trim() as AuditRequest['severity']) ?? ''
    const supabase = createServiceRoleClient()

    let query = supabase
      .from('audit_events')
      .select('id, actor_profile_id, entity_type, entity_id, event_type, payload, created_at', {
        count: 'exact',
      })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (eventType) {
      query = query.ilike('event_type', `%${eventType}%`)
    }

    if (from) {
      query = query.gte('created_at', from)
    }

    if (to) {
      query = query.lte('created_at', to)
    }

    const { count, data: events, error } = await query

    if (error) {
      throw error
    }

    const auditRecords = (events ?? []) as AuditRecord[]
    const actorIds = Array.from(
      new Set(auditRecords.map((event) => event.actor_profile_id).filter((value): value is string => Boolean(value))),
    )

    const { data: profiles, error: profileError } = actorIds.length
      ? await supabase.from('profiles').select('id, full_name').in('id', actorIds)
      : { data: [], error: null }

    if (profileError) {
      throw profileError
    }

    const profileNameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.full_name]))
    const records = []

    for (const event of auditRecords) {
      const severity = severityFromEventType(event.event_type)

      if (severityFilter && severity !== severityFilter) {
        continue
      }

      const eventHash = await sha256Hex(
        `${event.id}|${event.event_type}|${event.entity_type}|${event.entity_id ?? ''}|${JSON.stringify(event.payload ?? {})}`,
      )

      records.push({
        actorName: actorLabel(event, profileNameById.get(event.actor_profile_id) ?? null),
        createdAt: event.created_at,
        details: detailText(event),
        entityId: event.entity_id,
        entityType: event.entity_type,
        eventType: event.event_type,
        hash: eventHash,
        id: event.id,
        payload: event.payload ?? {},
        severity,
      })
    }

    return json({
      meta: {
        limit,
        total: count ?? records.length,
      },
      records,
    })
  } catch (error) {
    return failure('Unable to load audit events', 500, error instanceof Error ? error.message : error)
  }
})
