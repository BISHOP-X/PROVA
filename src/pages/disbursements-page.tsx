import { Plus, CheckCircle2, Send, AlertCircle, Loader } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import { initiateTransfer } from '@/services/squad-api';

export function DisbursementsPage() {
  const { user } = useAuth();
  const { submissions } = useSubmissions();
  const [disbursingId, setDisbursingId] = useState<string | null>(null);
  const [disburseError, setDisburseError] = useState<string | null>(null);
  const [disburseSuccess, setDisburseSuccess] = useState<string | null>(null);

  const approved = submissions.filter((s) => s.status === 'approved');
  const pending = submissions.filter((s) => s.status === 'pending');
  const review = submissions.filter((s) => s.status === 'review');

  const handleDisburse = async (submission: typeof approved[0]) => {
    if (!user || user.role !== 'admin') {
      setDisburseError('Only admins can disburse funds');
      return;
    }

    if (!submission.bank || !submission.accountNumber) {
      setDisburseError('Invalid beneficiary bank details');
      return;
    }

    setDisbursingId(submission.id);
    setDisburseError(null);
    setDisburseSuccess(null);

    try {
      // Call Squad transfer API directly
      const result = await initiateTransfer({
        beneficiary_account: submission.accountNumber,
        beneficiary_bank: submission.bank,
        amount: 50000, // Amount in kobo (50,000 kobo = ₦500)
        remark: `PROVA Scholarship - ${submission.fullName}`,
        currency_id: 'NGN',
      });

      setDisburseSuccess(`Transfer initiated for ${submission.fullName} (Ref: ${result.transaction_reference})`);
      setTimeout(() => setDisburseSuccess(null), 4000);
    } catch (err) {
      console.error('[Disbursements] transfer error', err);
      setDisburseError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setDisbursingId(null);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-medium leading-7 text-[#191b22]">Disbursement Management</h1>
          <p className="text-[14px] text-[#424753] mt-1">Process payments to approved beneficiaries through Squad.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0058bd] text-white px-5 py-2.5 rounded-lg font-bold text-[12px] tracking-[0.05em] hover:opacity-90 transition-opacity self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New Batch
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c2c6d5]">
          <p className="text-[12px] text-[#424753] font-semibold uppercase mb-2">Approved Ready</p>
          <p className="text-[28px] font-bold text-[#0058bd]">{approved.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c2c6d5]">
          <p className="text-[12px] text-[#424753] font-semibold uppercase mb-2">Pending Review</p>
          <p className="text-[28px] font-bold text-[#8f4a00]">{pending.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c2c6d5]">
          <p className="text-[12px] text-[#424753] font-semibold uppercase mb-2">Flagged</p>
          <p className="text-[28px] font-bold text-[#ba1a1a]">{review.length}</p>
        </div>
      </div>

      {/* Approved Beneficiaries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#c2c6d5] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#c2c6d5] flex items-center justify-between bg-[#f9f9ff]">
          <h2 className="text-[18px] font-bold text-[#191b22]">Approved Beneficiaries - Ready for Payout</h2>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded-full">
            <CheckCircle2 className="w-3 h-3" /> {approved.length} Ready
          </span>
        </div>

        {approved.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[14px] text-[#424753]">No approved beneficiaries yet. Verify submissions to show here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f2f3fd] border-b border-[#c2c6d5]">
                <tr>
                  {['Name', 'Bank', 'Account', 'Program', 'Amount', 'Action'].map((h) => (
                    <th key={h} className="px-6 py-4 text-[12px] font-bold text-[#424753] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c2c6d5]">
                {approved.map((s) => (
                  <tr key={s.id} className="hover:bg-[#f9f9ff] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[14px] text-[#191b22]">{s.fullName}</p>
                      <p className="text-[11px] text-[#424753]">{s.email || s.userId.slice(0, 8)}</p>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#191b22] font-mono">{s.bank}</td>
                    <td className="px-6 py-4 text-[14px] font-mono text-[#191b22]">{s.accountMasked}</td>
                    <td className="px-6 py-4 text-[14px] text-[#191b22]">{s.programName || 'Unassigned'}</td>
                    <td className="px-6 py-4 font-bold text-[14px] text-[#0058bd]">₦50,000</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDisburse(s)}
                        disabled={disbursingId === s.id}
                        className="flex items-center gap-2 px-3 py-2 bg-[#0058bd] text-white rounded font-semibold text-[12px] hover:bg-[#003d8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {disbursingId === s.id ? (
                          <>
                            <Loader className="w-3 h-3 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            Disburse
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Alerts */}
      {disburseError && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30">
          <AlertCircle className="w-5 h-5 text-[#ba1a1a] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-[#ba1a1a] text-sm">Transfer Error</p>
            <p className="text-[12px] text-[#ba1a1a] mt-1">{disburseError}</p>
          </div>
        </div>
      )}

      {disburseSuccess && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-green-100 border border-green-300">
          <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Transfer Initiated</p>
            <p className="text-[12px] text-green-700 mt-1">{disburseSuccess}</p>
          </div>
        </div>
      )}

      {/* Additional sections would go here */}
    </>
  );
}
