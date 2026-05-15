import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.4"

const SQUAD_API_BASE = Deno.env.get("SQUAD_API_BASE_URL") || "https://sandbox-api-d.squadco.com"
const SQUAD_SECRET_KEY = Deno.env.get("SQUAD_API_SECRET_KEY")
const SQUAD_MERCHANT_ID = Deno.env.get("SQUAD_MERCHANT_ID")

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  "Access-Control-Max-Age": "86400",
}

interface TransferPayload {
  payout_item_id: string
  beneficiary_id: string
  amount: string
  bank_code: string
  account_number: string
  account_name: string
  actor_profile_id: string
  remark?: string
}

interface SquadTransferResponse {
  status: number
  success: boolean
  message: string
  data?: {
    nip_transaction_reference: string
    squad_transaction_reference?: string
    status?: string
    [key: string]: unknown
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

    const payload: TransferPayload = await req.json()

    // Validate required fields
    const required = ["payout_item_id", "beneficiary_id", "amount", "bank_code", "account_number", "account_name", "actor_profile_id"]
    for (const field of required) {
      if (!payload[field as keyof TransferPayload]) {
        return new Response(JSON.stringify({ error: `Missing ${field}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
    }

    // Generate unique transaction reference: MERCHANT_ID_TIMESTAMP_RANDOM
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const transaction_reference = `${SQUAD_MERCHANT_ID}_${timestamp}_${random}`

    // Call Squad Transfer API
    const squadResponse = await fetch(`${SQUAD_API_BASE}/payout/transfer`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SQUAD_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        remark: payload.remark || "PROVA Scholarship Disbursement",
        bank_code: payload.bank_code,
        currency_id: "NGN",
        amount: payload.amount,
        account_number: payload.account_number,
        transaction_reference,
        account_name: payload.account_name,
      }),
    })

    const squadData: SquadTransferResponse = await squadResponse.json()

    // Update payout_item with Squad reference and status
    if (squadData.success && squadData.data?.nip_transaction_reference) {
      const { error: updateError } = await supabase
        .from("payout_items")
        .update({
          squad_transaction_reference: transaction_reference,
          squad_status: "submitted",
          released_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", payload.payout_item_id)

      if (updateError) {
        console.error("[squad-transfer] failed to update payout_item:", updateError)
      }

      // Log audit event
      await supabase.from("audit_events").insert({
        actor_profile_id: payload.actor_profile_id,
        entity_type: "payout_item",
        entity_id: payload.payout_item_id,
        event_type: "transfer_initiated",
        payload: {
          beneficiary_id: payload.beneficiary_id,
          amount: payload.amount,
          squad_transaction_reference: transaction_reference,
          squad_response: squadData,
        },
      })
    } else {
      // Transfer failed
      const { error: updateError } = await supabase
        .from("payout_items")
        .update({
          squad_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payload.payout_item_id)

      if (updateError) {
        console.error("[squad-transfer] failed to update payout_item:", updateError)
      }

      // Log failure
      await supabase.from("audit_events").insert({
        actor_profile_id: payload.actor_profile_id,
        entity_type: "payout_item",
        entity_id: payload.payout_item_id,
        event_type: "transfer_failed",
        payload: {
          beneficiary_id: payload.beneficiary_id,
          amount: payload.amount,
          error: squadData.message,
          squad_response: squadData,
        },
      })
    }

    // Return Squad response
    return new Response(JSON.stringify(squadData), {
      status: squadResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("[squad-transfer] error:", error)
    return new Response(
      JSON.stringify({
        status: 500,
        success: false,
        message: "Transfer failed",
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
