import { useSubmissions } from '@/contexts/SubmissionsContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

export function AdminSubmissionsPage() {
  const { submissions, updateSubmissionStatus, getAuditForSubmission } = useSubmissions();
  const navigate = useNavigate();
  const [actingOnId, setActingOnId] = useState<string | null>(null);

  const statusIcon: Record<string, React.ReactNode> = {
    approved: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    pending: <Clock className="w-5 h-5 text-amber-500" />,
    review: <AlertCircle className="w-5 h-5 text-orange-600" />,
    rejected: <XCircle className="w-5 h-5 text-red-600" />,
  };

  const statusColor: Record<string, string> = {
    approved: 'bg-green-50 border-green-200',
    pending: 'bg-amber-50 border-amber-200',
    review: 'bg-orange-50 border-orange-200',
    rejected: 'bg-red-50 border-red-200',
  };

  const handleStatusChange = async (submissionId: string, newStatus: 'approved' | 'review' | 'rejected' | 'pending') => {
    setActingOnId(submissionId);
    try {
      await updateSubmissionStatus(submissionId, newStatus);
    } finally {
      setActingOnId(null);
    }
  };

  const pending = submissions.filter(s => s.status === 'pending');
  const inReview = submissions.filter(s => s.status === 'review');
  const approved = submissions.filter(s => s.status === 'approved');
  const rejected = submissions.filter(s => s.status === 'rejected');

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submission Review Queue</h1>
        <button onClick={() => navigate('/admin/beneficiaries')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          View All Beneficiaries
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-800 mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-amber-900">{pending.length}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm font-medium text-orange-800 mb-1">On Hold</p>
          <p className="text-3xl font-bold text-orange-900">{inReview.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-800 mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-900">{approved.length}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800 mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-900">{rejected.length}</p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.length === 0 && (
          <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-600">No submissions yet.</div>
        )}
        {submissions.map((s) => (
          <div key={s.id} className={`p-6 rounded-lg border-2 ${statusColor[s.status]}`}>
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {statusIcon[s.status]}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{s.fullName}</h3>
                    <p className="text-sm text-gray-600">
                      {s.applicationId && <span className="font-mono">{s.applicationId}</span>}
                      {!s.applicationId && <span>ID: {s.id.slice(0, 8)}</span>}
                    </p>
                  </div>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                    s.status === 'approved' ? 'bg-green-200 text-green-800' :
                    s.status === 'pending' ? 'bg-amber-200 text-amber-800' :
                    s.status === 'review' ? 'bg-orange-200 text-orange-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {s.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 my-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Program</p>
                    <p className="font-semibold text-gray-900">{s.programName || 'Unassigned'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Bank & Account</p>
                    <p className="font-mono text-gray-900">{s.bank} • {s.accountMasked}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Submitted</p>
                    <p className="text-gray-900">{s.createdAt ? new Date(s.createdAt).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>

                {s.livenessScore !== undefined && (
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                    <p className="text-xs text-gray-600 font-medium">Liveness Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            s.livenessScore >= 75 ? 'bg-green-600' :
                            s.livenessScore >= 50 ? 'bg-amber-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${s.livenessScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{s.livenessScore}%</span>
                    </div>
                  </div>
                )}

                <details className="mt-4 text-xs">
                  <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                    View Audit Trail ({getAuditForSubmission(s.id).length})
                  </summary>
                  <div className="mt-3 space-y-1 text-gray-600 border-t pt-3">
                    {getAuditForSubmission(s.id).map((a) => (
                      <div key={a.id} className="text-xs">
                        <span className="font-mono">{new Date(a.createdAt).toLocaleString()}</span> — {a.message}
                      </div>
                    ))}
                  </div>
                </details>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 min-w-[120px]">
                <button 
                  onClick={() => handleStatusChange(s.id, 'approved')}
                  disabled={actingOnId === s.id || s.status === 'approved'}
                  className="px-3 py-2 bg-green-600 text-white rounded font-medium text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ✓ Approve
                </button>
                <button 
                  onClick={() => handleStatusChange(s.id, 'review')}
                  disabled={actingOnId === s.id}
                  className="px-3 py-2 bg-orange-500 text-white rounded font-medium text-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ⏸ Hold
                </button>
                <button 
                  onClick={() => handleStatusChange(s.id, 'rejected')}
                  disabled={actingOnId === s.id || s.status === 'rejected'}
                  className="px-3 py-2 bg-red-600 text-white rounded font-medium text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminSubmissionsPage;
