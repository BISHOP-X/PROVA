import React, { createContext, useContext, useEffect, useState } from 'react';
import * as sb from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { BeneficiaryRecord, BeneficiaryStatus, ProgramRecord } from '@/services/supabase';

export type SubmissionStatus = BeneficiaryStatus;

export type Submission = {
  id: string;
  userId: string;
  programId: string;
  programName?: string;
  organizationName?: string;
  fullName: string;
  email?: string;
  phone?: string;
  scholarshipId?: string;
  bank?: string;
  accountNumber?: string;
  accountMasked?: string;
  accountLast4?: string;
  applicationId?: string;
  status: SubmissionStatus;
  livenessScore?: number;
  createdAt: string;
  updatedAt: string;
};

export type AuditEvent = {
  id: string;
  submissionId: string;
  type: 'submitted' | 'status_change' | 'system' | 'note';
  actor?: string;
  message?: string;
  createdAt: string;
};

type BeneficiaryWithExtras = Partial<BeneficiaryRecord> & {
  id: string;
  programs?: ProgramRecord | null;
  liveness_score?: number | null;
};

type AuditRecord = {
  id: string;
  entity_id?: string | null;
  beneficiary_id?: string | null;
  event_type?: string | null;
  actor_profile_id?: string | null;
  message?: string | null;
  payload?: { message?: string; actor?: string } | Record<string, unknown> | null;
  created_at: string;
};

type RealtimePayload<T> = {
  new?: T;
  record?: T;
};

type NewSubmission = Omit<Submission, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
type NewAuditEvent = Omit<AuditEvent, 'id' | 'createdAt'>;

type SubmissionsContextType = {
  submissions: Submission[];
  addSubmission: (submission: NewSubmission) => Promise<Submission>;
  updateSubmissionStatus: (
    id: string,
    status: SubmissionStatus,
    details?: Partial<Submission>,
  ) => Promise<Submission | undefined>;
  getByUser: (userId: string) => Submission | undefined;
  auditEvents: AuditEvent[];
  addAuditEvent: (event: NewAuditEvent) => Promise<AuditEvent>;
  getAuditForSubmission: (submissionId: string) => AuditEvent[];
};

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

const isUuid = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value);

const maskAccount = (accountNumber?: string | null) => {
  if (!accountNumber) return undefined;
  return `**** **** ${String(accountNumber).slice(-4)}`;
};

const getPayloadMessage = (payload: AuditRecord['payload']) => {
  if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }
  return undefined;
};

const mapBeneficiary = (record: BeneficiaryWithExtras, fallbackUserId = ''): Submission => ({
  id: record.id,
  userId: record.profile_id ?? fallbackUserId,
  programId: record.program_id ?? '',
  programName: record.programs?.name ?? undefined,
  organizationName: record.programs?.organization_name ?? undefined,
  fullName: record.full_name ?? '',
  email: record.email ?? undefined,
  phone: record.phone ?? undefined,
  scholarshipId: record.student_identifier ?? undefined,
  bank: record.bank_code ?? undefined,
  accountNumber: record.account_number ?? undefined,
  accountMasked: maskAccount(record.account_number),
  accountLast4: record.account_number ? String(record.account_number).slice(-4) : undefined,
  status: record.status ?? 'pending',
  livenessScore: record.liveness_score ?? undefined,
  createdAt: record.created_at ?? new Date().toISOString(),
  updatedAt: record.updated_at ?? record.created_at ?? new Date().toISOString(),
});

const mapAuditEvent = (record: AuditRecord): AuditEvent => {
  const eventType = record.event_type;
  return {
    id: record.id,
    submissionId: record.entity_id ?? record.beneficiary_id ?? '',
    type:
      eventType === 'submitted' || eventType === 'status_change' || eventType === 'note'
        ? eventType
        : 'system',
    actor: record.actor_profile_id ?? undefined,
    message: getPayloadMessage(record.payload) || record.message || JSON.stringify(record.payload || {}),
    createdAt: record.created_at,
  };
};

const unwrapRealtimeRecord = <T,>(payload: unknown) => {
  const candidate = payload as RealtimePayload<T> | T;
  return 'new' in Object(candidate) || 'record' in Object(candidate)
    ? (candidate as RealtimePayload<T>).new ?? (candidate as RealtimePayload<T>).record
    : (candidate as T);
};

export const SubmissionsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    let mounted = true;

    if (loading) return undefined;

    if (!user) {
      queueMicrotask(() => {
        if (!mounted) return;
        setSubmissions([]);
        setAuditEvents([]);
      });
      return undefined;
    }

    async function load() {
      try {
        const beneficiaries = await sb.getAllBeneficiaries();
        const audits = (await sb.getAuditEvents()) as AuditRecord[];
        if (!mounted) return;

        setSubmissions(beneficiaries.map((beneficiary) => mapBeneficiary(beneficiary)));
        setAuditEvents(audits.map((audit) => mapAuditEvent(audit)));
      } catch (err) {
        console.error('[SubmissionsContext] load error', err);
      }
    }

    load();

    const beneficiaryChannel = sb.subscribeToBeneficiaries((payload) => {
      try {
        const record = unwrapRealtimeRecord<BeneficiaryWithExtras>(payload);
        if (!record) return;
        const mapped = mapBeneficiary(record);

        setSubmissions((current) => {
          const exists = current.some((submission) => submission.id === mapped.id);
          if (exists) return current.map((submission) => (submission.id === mapped.id ? mapped : submission));
          return [mapped, ...current];
        });
      } catch (err) {
        console.warn('beneficiary realtime handler failed', err);
      }
    });

    const auditChannel = sb.subscribeToAuditEvents((payload) => {
      try {
        const record = unwrapRealtimeRecord<AuditRecord>(payload);
        if (!record) return;
        setAuditEvents((current) => [mapAuditEvent(record), ...current]);
      } catch (err) {
        console.warn('audit realtime handler failed', err);
      }
    });

    return () => {
      mounted = false;
      try {
        beneficiaryChannel.unsubscribe();
      } catch (err) {
        console.warn('beneficiary unsubscribe failed', err);
      }
      try {
        auditChannel.unsubscribe();
      } catch (err) {
        console.warn('audit unsubscribe failed', err);
      }
    };
  }, [loading, user]);

  const addSubmission = async (submission: NewSubmission) => {
    const payload = {
      profile_id: isUuid(submission.userId) ? submission.userId : null,
      program_id: submission.programId,
      full_name: submission.fullName,
      student_identifier: submission.scholarshipId,
      bank_code: submission.bank,
      account_number: submission.accountNumber ?? (submission.accountLast4 ? `****${submission.accountLast4}` : undefined),
    };

    try {
      const created = (await sb.createBeneficiary(payload)) as BeneficiaryWithExtras;
      const newSubmission = mapBeneficiary(created, submission.userId);

      setSubmissions((current) => [newSubmission, ...current]);
      try {
        await sb.createVerificationSubmission({ beneficiary_id: newSubmission.id });
      } catch (err) {
        console.warn('verification submission write failed', err);
      }
      try {
        await sb.addAuditEvent({
          entity_type: 'beneficiary',
          entity_id: newSubmission.id,
          event_type: 'submitted',
          payload: { message: 'Submission created' },
        });
      } catch (err) {
        console.warn('audit write failed', err);
      }

      return newSubmission;
    } catch (err) {
      console.error('[SubmissionsContext] addSubmission error', err);
      throw err;
    }
  };

  const updateSubmissionStatus = async (
    id: string,
    status: SubmissionStatus,
    details?: Partial<Submission>,
  ) => {
    try {
      if (details?.livenessScore != null) {
        const score = details.livenessScore;
        const decision: Exclude<SubmissionStatus, 'pending'> =
          score >= 75 ? 'approved' : score < 50 ? 'rejected' : 'review';

        await sb.applyVerificationDecision(id, {
          liveness_score: score,
          decision,
          raw_provider_summary: { simulated: true },
        });

        const beneficiaries = await sb.getAllBeneficiaries();
        const found = beneficiaries.find((beneficiary) => beneficiary.id === id);
        if (found) {
          const updated = mapBeneficiary(found);
          setSubmissions((current) => current.map((submission) => (submission.id === id ? updated : submission)));
          setAuditEvents((current) => [
            {
              id: `ae_${Date.now()}`,
              submissionId: id,
              type: 'status_change',
              message: `Status changed to ${updated.status}`,
              createdAt: new Date().toISOString(),
            },
            ...current,
          ]);
          return updated;
        }
      }

      const updatedRecord = (await sb.updateBeneficiary(id, {
        status,
        updated_at: new Date().toISOString(),
      })) as BeneficiaryWithExtras;
      const updated = mapBeneficiary(updatedRecord);

      setSubmissions((current) => current.map((submission) => (submission.id === id ? updated : submission)));
      try {
        await sb.addAuditEvent({
          entity_type: 'beneficiary',
          entity_id: id,
          event_type: 'status_change',
          payload: { message: `Status changed to ${status}` },
        });
      } catch (err) {
        console.warn('audit write failed', err);
      }
      setAuditEvents((current) => [
        {
          id: `ae_${Date.now()}`,
          submissionId: id,
          type: 'status_change',
          message: `Status changed to ${status}`,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      return updated;
    } catch (err) {
      console.error('[SubmissionsContext] updateSubmissionStatus error', err);
      return undefined;
    }
  };

  const getByUser = (userId: string) =>
    submissions.find((submission) => submission.userId === userId || submission.userId === `beneficiary_${userId}`);

  const addAuditEvent = async (event: NewAuditEvent) => {
    try {
      await sb.addAuditEvent({
        entity_type: 'beneficiary',
        entity_id: event.submissionId,
        event_type: event.type,
        payload: { message: event.message, actor: event.actor },
      });
    } catch (err) {
      console.warn('audit write failed', err);
    }

    const auditEvent: AuditEvent = {
      id: `ae_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      ...event,
    };
    setAuditEvents((current) => [auditEvent, ...current]);
    return auditEvent;
  };

  const getAuditForSubmission = (submissionId: string) =>
    auditEvents.filter((auditEvent) => auditEvent.submissionId === submissionId);

  return (
    <SubmissionsContext.Provider
      value={{
        submissions,
        addSubmission,
        updateSubmissionStatus,
        getByUser,
        auditEvents,
        addAuditEvent,
        getAuditForSubmission,
      }}
    >
      {children}
    </SubmissionsContext.Provider>
  );
};

export const useSubmissions = () => {
  const ctx = useContext(SubmissionsContext);
  if (!ctx) throw new Error('useSubmissions must be used within SubmissionsProvider');
  return ctx;
};

export default SubmissionsContext;
