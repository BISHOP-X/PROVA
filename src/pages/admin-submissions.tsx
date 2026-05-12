import { useMemo } from 'react';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import { useNavigate } from 'react-router-dom';

export function AdminSubmissionsPage() {
  const { submissions, updateSubmissionStatus, getAuditForSubmission } = useSubmissions();
  const navigate = useNavigate();

  const pending = useMemo(() => submissions.filter((s) => s.status !== 'approved'), [submissions]);

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/beneficiaries')} className="px-3 py-2 bg-white border rounded">Beneficiaries</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {submissions.length === 0 && <div className="p-6 bg-white rounded shadow">No submissions yet.</div>}
        {submissions.map((s) => (
          <div key={s.id} className="p-4 bg-white rounded border shadow-sm flex items-start justify-between">
            <div>
              <div className="text-sm text-muted">{s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</div>
              <div className="text-lg font-bold">{s.fullName}</div>
              <div className="text-sm text-muted">{s.bank} • {s.accountMasked}</div>
              <div className="mt-2 text-xs">Status: <strong>{s.status}</strong></div>
              <div className="mt-2">
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium">Audit</summary>
                  <div className="mt-2">
                    {getAuditForSubmission(s.id).map((a) => (
                      <div key={a.id} className="text-xs mb-1">{new Date(a.createdAt).toLocaleString()} — {a.message}</div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => updateSubmissionStatus(s.id, 'approved')} className="px-3 py-2 bg-emerald-600 text-white rounded">Approve</button>
              <button onClick={() => updateSubmissionStatus(s.id, 'review')} className="px-3 py-2 bg-amber-500 text-white rounded">Review</button>
              <button onClick={() => updateSubmissionStatus(s.id, 'rejected')} className="px-3 py-2 bg-red-600 text-white rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminSubmissionsPage;
