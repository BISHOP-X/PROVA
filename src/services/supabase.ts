import { createClient, SupabaseClient } from '@supabase/supabase-js';

type SupabasePayload = Record<string, unknown>;
export type AppRole = 'admin' | 'beneficiary';

export type ProfileRecord = {
  id: string;
  role: AppRole;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type BeneficiaryStatus = 'pending' | 'approved' | 'review' | 'rejected';

export type BeneficiaryRecord = {
  id: string;
  program_id: string;
  profile_id?: string | null;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  student_identifier: string;
  bank_code: string;
  account_number: string;
  account_name_lookup?: string | null;
  status: BeneficiaryStatus;
  created_at?: string | null;
  updated_at?: string | null;
  programs?: ProgramRecord | null;
};

export type VerificationSubmissionRecord = {
  id: string;
  beneficiary_id: string;
  selfie_file_path?: string | null;
  document_file_path?: string | null;
  submitted_at: string;
  beneficiaries?: BeneficiaryRecord | null;
};

export type ProgramRecord = {
  id: string;
  name: string;
  organization_name: string;
  program_type: string;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

let supabase: SupabaseClient | null = null;
if (url && anon) {
  supabase = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  console.log('[supabase] client initialized');
} else {
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set');
}

export function getSupabase() {
  if (!supabase) throw new Error('Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  return supabase;
}

// Auth and profiles
export async function signInWithPassword(email: string, password: string) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const sb = getSupabase();
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}

export async function signUp(email: string, password: string, fullName: string, role: AppRole) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });
  if (error) throw error;
  
  // Create profile record if it doesn't exist
  if (data.user) {
    const { error: profileError } = await sb.from('profiles').upsert({
      id: data.user.id,
      email: data.user.email,
      role: role,
      full_name: fullName,
    });
    if (profileError) console.error('[supabase] profile creation failed', profileError);
  }
  
  return data;
}

export async function getAuthSession() {
  const sb = getSupabase();
  const { data, error } = await sb.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback: () => void) {
  const sb = getSupabase();
  const { data } = sb.auth.onAuthStateChange(() => {
    callback();
  });
  return data.subscription;
}

export async function getProfileById(id: string) {
  const sb = getSupabase();
  const { data, error } = await sb.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data as ProfileRecord;
}

// Programs
export async function getPrograms() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as ProgramRecord[];
}

// Beneficiaries
export async function createBeneficiary(payload: SupabasePayload) {
  const sb = getSupabase();
  const { data, error } = await sb.from('beneficiaries').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateBeneficiary(id: string, updates: SupabasePayload) {
  const sb = getSupabase();
  const { data, error } = await sb.from('beneficiaries').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function getBeneficiariesByProfile(profile_id: string) {
  const sb = getSupabase();
  const { data, error } = await sb.from('beneficiaries').select('*').eq('profile_id', profile_id);
  if (error) throw error;
  return data;
}

export async function getAllBeneficiaries() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('beneficiaries')
    .select('*, programs(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as BeneficiaryRecord[];
}

export async function getAuditEvents() {
  const sb = getSupabase();
  const { data, error } = await sb.from('audit_events').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Realtime subscription helpers (Supabase JS v2)
export function subscribeToBeneficiaries(callback: (payload: unknown) => void) {
  const sb = getSupabase();
  // create a uniquely-named channel to avoid adding handlers to an already-subscribed channel
  const name = `public:beneficiaries:${Math.random().toString(36).slice(2)}`;
  const channel = sb.channel(name);
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'beneficiaries' }, (payload) => {
    callback(payload);
  });
  channel.subscribe();
  return channel;
}

export function subscribeToAuditEvents(callback: (payload: unknown) => void) {
  const sb = getSupabase();
  const name = `public:audit_events:${Math.random().toString(36).slice(2)}`;
  const channel = sb.channel(name);
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'audit_events' }, (payload) => {
    callback(payload);
  });
  channel.subscribe();
  return channel;
}

export async function getApprovedBeneficiaries(program_id?: string) {
  const sb = getSupabase();
  let query = sb.from('beneficiaries').select('*').eq('status', 'approved');
  if (program_id) query = query.eq('program_id', program_id);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Verification submissions & results
export async function createVerificationSubmission(payload: SupabasePayload) {
  const sb = getSupabase();
  const { data, error } = await sb.from('verification_submissions').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function getVerificationSubmissions() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('verification_submissions')
    .select('*, beneficiaries(*, programs(*))')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data as VerificationSubmissionRecord[];
}

export async function createVerificationResult(payload: SupabasePayload) {
  const sb = getSupabase();
  const { data, error } = await sb.from('verification_results').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

// Audit events
export async function addAuditEvent(payload: SupabasePayload) {
  const sb = getSupabase();
  const { data, error } = await sb.from('audit_events').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

// Convenience: set verification result and update beneficiary status
export async function applyVerificationDecision(beneficiaryId: string, result: SupabasePayload & { decision?: string }) {
  // create result
  const created = await createVerificationResult({ beneficiary_id: beneficiaryId, ...result });
  // update beneficiary status based on decision
  const status = result.decision === 'approved' ? 'approved' : result.decision === 'rejected' ? 'rejected' : 'review';
  await updateBeneficiary(beneficiaryId, { status });
  // add audit event
  await addAuditEvent({ entity_type: 'beneficiary', entity_id: beneficiaryId, event_type: 'verification', payload: result });
  return created;
}

// Payout Management
export async function createPayoutBatch(payload: SupabasePayload) {
  const sb = getSupabase();
  const { data, error } = await sb.from('payout_batches').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function getPayoutBatches(program_id?: string) {
  const sb = getSupabase();
  let query = sb.from('payout_batches').select('*').order('created_at', { ascending: false });
  if (program_id) query = query.eq('program_id', program_id);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createPayoutItem(payload: SupabasePayload) {
  const sb = getSupabase();
  const { data, error } = await sb.from('payout_items').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function getPayoutItems(batch_id: string) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('payout_items')
    .select('*, beneficiaries(*)')
    .eq('batch_id', batch_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updatePayoutItem(id: string, updates: SupabasePayload) {
  const sb = getSupabase();
  const { data, error } = await sb.from('payout_items').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Squad Account Validation
export async function validateAccountWithSquad(bankCode: string, accountNumber: string) {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.functions.invoke('squad-account-lookup', {
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
    console.error('[supabase] account validation error', err);
    throw err;
  }
}

export default {
  getSupabase,
  signInWithPassword,
  signOut,
  signUp,
  getAuthSession,
  onAuthStateChange,
  getProfileById,
  getPrograms,
  createBeneficiary,
  updateBeneficiary,
  getBeneficiariesByProfile,
  getApprovedBeneficiaries,
  createVerificationSubmission,
  getVerificationSubmissions,
  createVerificationResult,
  addAuditEvent,
  applyVerificationDecision,
  createPayoutBatch,
  getPayoutBatches,
  createPayoutItem,
  getPayoutItems,
  updatePayoutItem,
  validateAccountWithSquad,
};
