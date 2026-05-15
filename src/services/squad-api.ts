// Squad API client (frontend)
// Account validation and transfers go through Supabase Edge Functions
// which handle authentication with secret keys server-side

import { getSupabase } from './supabase';

export interface AccountLookupResponse {
  success: boolean;
  message: string;
  data?: {
    account_name: string;
    account_number: string;
  };
}

export interface TransferResponse {
  success: boolean;
  message: string;
  data?: {
    transaction_reference: string;
    status: string;
    amount: number;
  };
}

/**
 * Validate bank account with Squad Account Lookup API
 * Calls via Edge Function to keep secret key server-side
 */
export async function validateBankAccount(
  bankCode: string,
  accountNumber: string
): Promise<{ account_name: string; account_number: string }> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase.functions.invoke('squad-account-lookup', {
      body: {
        bank_code: bankCode,
        account_number: accountNumber,
      },
    });

    if (error) {
      throw new Error(error.message || 'Account lookup failed');
    }

    if (!data || !data.success) {
      throw new Error(data?.message || 'Account lookup failed');
    }

    return data.data;
  } catch (err) {
    console.error('[Squad API] Account lookup failed:', err);
    throw err;
  }
}

/**
 * Initiate fund transfer via Squad Transfer API
 * Calls via Edge Function to keep secret key server-side
 */
export async function initiateTransfer(payload: {
  beneficiary_account: string;
  beneficiary_bank: string;
  amount: number;
  remark: string;
  currency_id?: string;
}): Promise<{ transaction_reference: string; status: string }> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase.functions.invoke('squad-transfer', {
      body: {
        beneficiary_account: payload.beneficiary_account,
        beneficiary_bank: payload.beneficiary_bank,
        amount: payload.amount,
        remark: payload.remark,
        currency_id: payload.currency_id || 'NGN',
      },
    });

    if (error) {
      throw new Error(error.message || 'Transfer failed');
    }

    if (!data || !data.success) {
      throw new Error(data?.message || 'Transfer failed');
    }

    return {
      transaction_reference: data.data.transaction_reference,
      status: data.data.status,
    };
  } catch (err) {
    console.error('[Squad API] Transfer failed:', err);
    throw err;
  }
}

export default {
  validateBankAccount,
  initiateTransfer,
};
