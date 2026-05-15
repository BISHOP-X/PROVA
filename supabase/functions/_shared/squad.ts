export type SquadMode = 'live' | 'mock'
export type PayoutItemStatus = 'pending' | 'queued' | 'processing' | 'successful' | 'failed'

interface SquadAccountLookupInput {
  accountNameHint?: string
  accountNumber: string
  bankCode: string
  fullName?: string
}

interface SquadTransferInput {
  accountName: string
  accountNumber: string
  amount: number
  bankCode: string
  remark: string
  transactionReference: string
}

export interface SquadAccountLookupResult {
  accountName: string
  accountNumber: string
  message: string
  mode: SquadMode
  raw: Record<string, unknown>
}

export interface SquadBalanceResult {
  amount: number
  currency: string
  lastUpdatedAt: string
  message: string
  mode: SquadMode
  raw: Record<string, unknown>
}

export interface SquadTransferResult {
  message: string
  mode: SquadMode
  raw: Record<string, unknown>
  squadStatus: PayoutItemStatus
  transactionReference: string
}

function env(name: string) {
  return Deno.env.get(name)?.trim() || ''
}

function hashValue(input: string) {
  let hash = 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function numberFromUnknown(value: unknown) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : null
}

function squadBaseUrl() {
  return env('SQUAD_API_BASE_URL') || 'https://sandbox-api-d.squadco.com'
}

function squadMerchantId() {
  return env('SQUAD_MERCHANT_ID')
}

export function getSquadMode(): SquadMode {
  return env('SQUAD_API_SECRET_KEY') && squadMerchantId() ? 'live' : 'mock'
}

function mockAccountName(input: SquadAccountLookupInput) {
  const candidate = input.accountNameHint?.trim() || input.fullName?.trim() || 'PROVA BENEFICIARY'
  return candidate.toUpperCase()
}

function merchantReferencePrefix() {
  return squadMerchantId() || 'PROVADEMO'
}

function toJsonRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function extractLiveBalance(raw: Record<string, unknown>) {
  const data = toJsonRecord(raw.data)
  const candidates = [
    data.ledger_balance,
    data.available_balance,
    data.balance,
    raw.ledger_balance,
    raw.available_balance,
    raw.balance,
  ]

  for (const candidate of candidates) {
    const numericValue = numberFromUnknown(candidate)

    if (numericValue !== null) {
      return numericValue / 100
    }
  }

  return 0
}

function mapSquadStatus(value: unknown): PayoutItemStatus {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()

  if (!normalized) {
    return 'queued'
  }

  if (normalized.includes('success')) {
    return 'successful'
  }

  if (normalized.includes('fail') || normalized.includes('revers') || normalized.includes('error')) {
    return 'failed'
  }

  if (normalized.includes('process') || normalized.includes('pending')) {
    return 'processing'
  }

  if (normalized.includes('queue')) {
    return 'queued'
  }

  return 'queued'
}

async function squadFetch(path: string, init: RequestInit) {
  const secretKey = env('SQUAD_API_SECRET_KEY')

  if (!secretKey) {
    throw new Error('Missing required environment variable: SQUAD_API_SECRET_KEY')
  }

  const response = await fetch(`${squadBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  const rawText = await response.text()
  const parsedBody = rawText ? JSON.parse(rawText) : {}

  if (!response.ok) {
    throw new Error(parsedBody?.message || `Squad request failed with status ${response.status}`)
  }

  return toJsonRecord(parsedBody)
}

export async function lookupSquadAccount(
  input: SquadAccountLookupInput,
): Promise<SquadAccountLookupResult> {
  const mockResult = {
    accountName: mockAccountName(input),
    accountNumber: input.accountNumber,
    message: 'Mock Squad lookup completed for demo mode.',
    mode: 'mock' as const,
    raw: {
      data: {
        account_name: mockAccountName(input),
        account_number: input.accountNumber,
      },
      success: true,
    },
  }

  if (getSquadMode() === 'mock') {
    return mockResult
  }

  try {
    const raw = await squadFetch('/payout/account/lookup', {
      body: JSON.stringify({
        account_number: input.accountNumber,
        bank_code: input.bankCode,
      }),
      method: 'POST',
    })

    const data = toJsonRecord(raw.data)
    return {
      accountName: String(data.account_name ?? input.accountNameHint ?? input.fullName ?? '').trim(),
      accountNumber: String(data.account_number ?? input.accountNumber).trim(),
      message: String(raw.message ?? 'Squad account lookup completed.'),
      mode: 'live',
      raw,
    }
  } catch (error) {
    return {
      ...mockResult,
      message: `Mock Squad lookup fallback: ${error instanceof Error ? error.message : 'live lookup failed'}`,
      raw: {
        ...mockResult.raw,
        fallbackReason: error instanceof Error ? error.message : 'live lookup failed',
      },
    }
  }
}

export async function getSquadMerchantBalance(): Promise<SquadBalanceResult> {
  const mockResult = {
    amount: 4250000,
    currency: 'NGN',
    lastUpdatedAt: new Date().toISOString(),
    message: 'Mock Squad balance returned for demo mode.',
    mode: 'mock' as const,
    raw: {
      data: {
        ledger_balance: 425000000,
      },
      success: true,
    },
  }

  if (getSquadMode() === 'mock') {
    return mockResult
  }

  try {
    const raw = await squadFetch('/merchant/balance?currency_id=NGN', {
      method: 'GET',
    })

    return {
      amount: extractLiveBalance(raw),
      currency: 'NGN',
      lastUpdatedAt: new Date().toISOString(),
      message: String(raw.message ?? 'Squad merchant balance loaded.'),
      mode: 'live',
      raw,
    }
  } catch (error) {
    return {
      ...mockResult,
      message: `Mock Squad balance fallback: ${error instanceof Error ? error.message : 'live balance failed'}`,
      raw: {
        ...mockResult.raw,
        fallbackReason: error instanceof Error ? error.message : 'live balance failed',
      },
    }
  }
}

export function createSquadTransferReference(seed: string) {
  return `${merchantReferencePrefix()}_${Date.now()}_${hashValue(seed).toString(36).slice(0, 8)}`
}

export async function transferWithSquad(
  input: SquadTransferInput,
): Promise<SquadTransferResult> {
  const transferHash = hashValue(input.transactionReference)
  const mockStatus: PayoutItemStatus =
    transferHash % 9 === 0 ? 'processing' : transferHash % 17 === 0 ? 'failed' : 'successful'
  const mockResult = {
    message:
      mockStatus === 'successful'
        ? 'Mock Squad transfer completed.'
        : mockStatus === 'processing'
          ? 'Mock Squad transfer is processing.'
          : 'Mock Squad transfer failed.',
    mode: 'mock' as const,
    raw: {
      data: {
        account_name: input.accountName,
        account_number: input.accountNumber,
        amount: String(Math.round(input.amount)),
        bank_code: input.bankCode,
        currency_id: 'NGN',
        transaction_reference: input.transactionReference,
      },
      success: mockStatus !== 'failed',
    },
    squadStatus: mockStatus,
    transactionReference: input.transactionReference,
  }

  if (getSquadMode() === 'mock') {
    return mockResult
  }

  try {
    const raw = await squadFetch('/payout/transfer', {
      body: JSON.stringify({
        account_name: input.accountName,
        account_number: input.accountNumber,
        amount: String(Math.round(input.amount)),
        bank_code: input.bankCode,
        currency_id: 'NGN',
        remark: input.remark,
        transaction_reference: input.transactionReference,
      }),
      method: 'POST',
    })

    const data = toJsonRecord(raw.data)
    const statusSource =
      data.status ??
      data.transaction_status ??
      data.transfer_status ??
      data.nip_status ??
      raw.status ??
      raw.message

    return {
      message: String(raw.message ?? 'Squad transfer submitted.'),
      mode: 'live',
      raw,
      squadStatus: mapSquadStatus(statusSource),
      transactionReference: String(data.transaction_reference ?? input.transactionReference),
    }
  } catch (error) {
    return {
      ...mockResult,
      message: `Mock Squad transfer fallback: ${error instanceof Error ? error.message : 'live transfer failed'}`,
      raw: {
        ...mockResult.raw,
        fallbackReason: error instanceof Error ? error.message : 'live transfer failed',
      },
    }
  }
}

export async function requerySquadTransfer(transactionReference: string): Promise<SquadTransferResult> {
  const transferHash = hashValue(transactionReference)
  const mockStatus: PayoutItemStatus = transferHash % 5 === 0 ? 'processing' : 'successful'
  const mockResult = {
    message:
      mockStatus === 'successful'
        ? 'Mock Squad requery confirms settlement.'
        : 'Mock Squad requery indicates processing.',
    mode: 'mock' as const,
    raw: {
      data: {
        transaction_reference: transactionReference,
      },
      success: true,
    },
    squadStatus: mockStatus,
    transactionReference,
  }

  if (getSquadMode() === 'mock') {
    return mockResult
  }

  try {
    const raw = await squadFetch('/payout/requery', {
      body: JSON.stringify({
        transaction_reference: transactionReference,
      }),
      method: 'POST',
    })

    const data = toJsonRecord(raw.data)
    const statusSource =
      data.status ??
      data.transaction_status ??
      data.transfer_status ??
      data.nip_status ??
      raw.status ??
      raw.message

    return {
      message: String(raw.message ?? 'Squad transfer requery completed.'),
      mode: 'live',
      raw,
      squadStatus: mapSquadStatus(statusSource),
      transactionReference: String(data.transaction_reference ?? transactionReference),
    }
  } catch (error) {
    return {
      ...mockResult,
      message: `Mock Squad requery fallback: ${error instanceof Error ? error.message : 'live requery failed'}`,
      raw: {
        ...mockResult.raw,
        fallbackReason: error instanceof Error ? error.message : 'live requery failed',
      },
    }
  }
}
