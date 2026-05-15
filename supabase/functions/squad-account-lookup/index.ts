import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SQUAD_API_BASE = Deno.env.get("SQUAD_API_BASE_URL") || "https://sandbox-api-d.squadco.com"
const SQUAD_SECRET_KEY = Deno.env.get("SQUAD_API_SECRET_KEY")

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  "Access-Control-Max-Age": "86400",
}

interface AccountLookupPayload {
  bank_code: string
  account_number: string
}

interface SquadAccountResponse {
  status: number
  success: boolean
  message: string
  data?: {
    account_name: string
    account_number: string
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const payload: AccountLookupPayload = await req.json()

    if (!payload.bank_code || !payload.account_number) {
      return new Response(
        JSON.stringify({ error: "Missing bank_code or account_number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!SQUAD_SECRET_KEY) {
      console.error("[squad-account-lookup] SQUAD_API_SECRET_KEY not set")
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Call Squad Account Lookup API
    const squadResponse = await fetch(`${SQUAD_API_BASE}/payout/account/lookup`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SQUAD_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bank_code: payload.bank_code,
        account_number: payload.account_number,
      }),
    })

    const squadData: SquadAccountResponse = await squadResponse.json()

    // Return Squad response as-is
    return new Response(JSON.stringify(squadData), {
      status: squadResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("[squad-account-lookup] error:", error)
    return new Response(
      JSON.stringify({
        status: 500,
        success: false,
        message: "Account lookup failed",
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})
