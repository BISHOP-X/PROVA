export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export function handleOptions(request: Request) {
  if (request.method !== 'OPTIONS') {
    return null
  }

  return new Response('ok', { headers: corsHeaders })
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

export function failure(message: string, status = 400, details?: unknown) {
  return json(
    {
      error: message,
      details,
    },
    status,
  )
}

export async function readBody<T>(request: Request): Promise<T> {
  const rawBody = await request.text()

  if (!rawBody.trim()) {
    return {} as T
  }

  return JSON.parse(rawBody) as T
}