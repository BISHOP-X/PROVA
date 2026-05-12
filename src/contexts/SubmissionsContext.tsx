import React, { createContext, useContext, useEffect, useState } from 'react';

export type SubmissionStatus = 'pending' | 'approved' | 'review' | 'rejected';

export type Submission = {
  id: string;
  userId: string;
  fullName: string;
  scholarshipId?: string;
  bank?: string;
  accountMasked?: string;
  accountLast4?: string;
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

type SubmissionsContextType = {
  submissions: Submission[];
  addSubmission: (s: Omit<Submission, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Submission;
  updateSubmissionStatus: (id: string, status: SubmissionStatus, details?: Partial<Submission>) => Submission | undefined;
  getByUser: (userId: string) => Submission | undefined;
  auditEvents: AuditEvent[];
  addAuditEvent: (e: Omit<AuditEvent, 'id' | 'createdAt'>) => AuditEvent;
  getAuditForSubmission: (submissionId: string) => AuditEvent[];
};

const KEY = 'prova_submissions_v1';
const AUDIT_KEY = 'prova_audit_v1';

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export const SubmissionsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Submission[]) : [];
    } catch {
      return [];
    }
  });

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    try {
      const raw = localStorage.getItem(AUDIT_KEY);
      return raw ? (JSON.parse(raw) as AuditEvent[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditEvents));
  }, [auditEvents]);

  const addSubmission = (s: Omit<Submission, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const sub: Submission = {
      id: `sub_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      ...s,
    } as Submission;
    setSubmissions((cur) => [sub, ...cur]);
    // add audit event
    const ev = {
      id: `ae_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      submissionId: sub.id,
      type: 'submitted' as const,
      message: 'Submission created',
      createdAt: now,
    };
    setAuditEvents((cur) => [ev, ...cur]);
    return sub;
  };

  const updateSubmissionStatus = (id: string, status: Submission['status'], details?: Partial<Submission>) => {
    let updated: Submission | undefined;
    setSubmissions((cur) => cur.map((s) => {
      if (s.id !== id) return s;
      updated = { ...s, status, updatedAt: new Date().toISOString(), ...details };
      return updated;
    }));
    if (updated) {
      const ev = {
        id: `ae_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        submissionId: id,
        type: 'status_change' as const,
        message: `Status changed to ${status}`,
        createdAt: new Date().toISOString(),
      };
      setAuditEvents((cur) => [ev, ...cur]);
    }
    return updated;
  };

  const getByUser = (userId: string) => submissions.find((s) => s.userId === userId);

  const addAuditEvent = (e: Omit<AuditEvent, 'id' | 'createdAt'>) => {
    const ev: AuditEvent = { id: `ae_${Date.now()}_${Math.floor(Math.random() * 10000)}`, createdAt: new Date().toISOString(), ...e };
    setAuditEvents((cur) => [ev, ...cur]);
    return ev;
  };

  const getAuditForSubmission = (submissionId: string) => auditEvents.filter((a) => a.submissionId === submissionId);

  return (
    <SubmissionsContext.Provider value={{ submissions, addSubmission, updateSubmissionStatus, getByUser, auditEvents, addAuditEvent, getAuditForSubmission }}>{children}</SubmissionsContext.Provider>
  );
};

export const useSubmissions = () => {
  const ctx = useContext(SubmissionsContext);
  if (!ctx) throw new Error('useSubmissions must be used within SubmissionsProvider');
  return ctx;
};

export default SubmissionsContext;
