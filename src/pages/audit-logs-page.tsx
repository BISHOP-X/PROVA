import { Lock, Download, CalendarDays, UserSearch, AlertTriangle, Bot, ShieldAlert, Settings, ShieldCheck, FileJson, ChevronLeft, ChevronRight, User, CheckCircle, ClipboardList } from 'lucide-react';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import { useMemo } from 'react';

export function AuditLogsPage() {
  const { auditEvents, submissions } = useSubmissions();

  const logRows = useMemo(() => {
    return auditEvents.map(event => {
      const submission = submissions.find(s => s.id === event.submissionId);
      const beneficiaryName = submission?.fullName || 'System';
      
      let Icon = Settings;
      let bg = 'bg-[#e7e7f1]';
      let iconColor = 'text-[#424753]';
      let dotColor = 'bg-[#8f4a00]';
      let eventType = 'System Event';

      if (event.type === 'submitted') {
        Icon = CheckCircle;
        bg = 'bg-[#d8e2ff]';
        iconColor = 'text-[#0058bd]';
        dotColor = 'bg-green-500';
        eventType = 'New Submission';
      } else if (event.type === 'status_change') {
        Icon = ShieldAlert;
        bg = 'bg-[#ffdad6]';
        iconColor = 'text-[#ba1a1a]';
        dotColor = 'bg-[#ba1a1a]';
        eventType = 'Status Updated';
      } else if (event.type === 'note') {
        Icon = ClipboardList;
        bg = 'bg-orange-50';
        iconColor = 'text-orange-600';
        dotColor = 'bg-orange-400';
        eventType = 'Reviewer Note';
      }

      return {
        id: event.id,
        timestamp: new Date(event.createdAt).toISOString().replace('T', ' ').split('.')[0],
        ms: '.' + new Date(event.createdAt).getMilliseconds().toString().padStart(3, '0') + 'Z',
        actorIcon: Icon,
        actorBg: bg,
        actorIconColor: iconColor,
        actor: event.actor || (event.type === 'system' ? 'SYSTEM' : 'ADMIN'),
        dotColor,
        eventType,
        eventColor: event.type === 'status_change' ? 'text-[#ba1a1a] font-bold' : 'text-[#191b22]',
        detail: `${beneficiaryName}: ${event.message}`,
        hash: `0x${event.id.replace(/-/g, '').slice(0, 64)}`,
        highlight: event.type === 'status_change',
      };
    });
  }, [auditEvents, submissions]);
  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-medium leading-7 text-[#191b22]">System Audit Logs</h1>
          <p className="text-[14px] text-[#424753] mt-1">Cryptographically verifiable, immutable record of all system events.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d8e2ff] text-[#0058bd] text-[12px] font-bold tracking-[0.04em]">
            <Lock className="w-4 h-4" />
            Immutable Ledger Active
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#191b22] font-bold text-[12px] rounded-lg border border-[#c2c6d5] hover:bg-[#f2f3fd] transition-colors">
            <Download className="w-4 h-4" />
            EXPORT CSV
          </button>
        </div>
      </div>

      {/* Filters bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Range */}
        <div className="bg-white rounded-xl border border-[#c2c6d5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 text-[#424753] mb-3">
            <CalendarDays className="w-4 h-4 text-[#0058bd]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.05em]">Temporal Range</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <input className="flex-1 w-full bg-[#f9f9ff] border border-[#c2c6d5] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0058bd] focus:border-[#0058bd]" type="date" defaultValue="2023-10-24" />
            <span className="text-[#424753] hidden sm:block font-bold">–</span>
            <input className="flex-1 w-full bg-[#f9f9ff] border border-[#c2c6d5] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0058bd] focus:border-[#0058bd]" type="date" defaultValue="2023-10-25" />
          </div>
        </div>

        {/* Actor Source */}
        <div className="bg-white rounded-xl border border-[#c2c6d5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 text-[#424753] mb-3">
            <UserSearch className="w-4 h-4 text-[#0058bd]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.05em]">Actor Source</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['System', 'AI Agent', 'Admin ID'].map((label) => (
              <label key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f9f9ff] border border-[#c2c6d5] cursor-pointer hover:border-[#0058bd] transition-colors">
                <input defaultChecked className="w-4 h-4 rounded text-[#0058bd] accent-[#0058bd]" type="checkbox" />
                <span className="text-[14px] text-[#191b22]">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Event Severity */}
        <div className="bg-white rounded-xl border border-[#c2c6d5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 text-[#424753] mb-3">
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.05em]">Event Severity</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-1.5 bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#ba1a1a] text-[11px] font-bold uppercase rounded-lg hover:opacity-80 transition-opacity">CRITICAL</button>
            <button className="flex-1 py-1.5 bg-[#f9f9ff] border border-[#c2c6d5] text-[#191b22] text-[11px] font-bold uppercase rounded-lg hover:bg-[#e7e7f1] transition-colors">INFO</button>
            <button className="flex-1 py-1.5 bg-[#f9f9ff] border border-[#c2c6d5] text-[#191b22] text-[11px] font-bold uppercase rounded-lg hover:bg-[#e7e7f1] transition-colors">WARN</button>
          </div>
        </div>
      </div>

      {/* Log table */}
      <div className="bg-white rounded-xl border border-[#c2c6d5] shadow-[0_1px_3px_rgba(0,0,0,0.12)] overflow-hidden">

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[880px] text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f3fd] border-b border-[#c2c6d5]">
                {['Timestamp (UTC)', 'Actor', 'Event Type', 'Details & Hash', 'Action'].map((h) => (
                  <th key={h} className="px-6 py-4 text-[11px] font-bold tracking-[0.06em] text-[#424753] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c2c6d5]">
              {logRows.map((row) => (
                <tr key={row.id} className={`hover:bg-[#f9f9ff] transition-colors ${row.highlight ? 'bg-[#ffdad6]/20' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-mono text-[13px] font-bold text-[#191b22]">{row.timestamp}</p>
                    <p className="font-mono text-[11px] text-[#424753]">{row.ms}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${row.actorBg} flex items-center justify-center`}>
                        <row.actorIcon className={`w-4 h-4 ${row.actorIconColor}`} />
                      </div>
                      <span className="text-[14px] font-medium text-[#191b22]">{row.actor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${row.dotColor}`} />
                      <span className={`text-[14px] ${row.eventColor}`}>{row.eventType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-[13px] text-[#191b22] truncate">{row.detail}</p>
                    <p className="font-mono text-[11px] text-[#727785] bg-[#f2f3fd] rounded px-2 py-0.5 mt-1 truncate max-w-full inline-block border border-[#c2c6d5]">
                      hash: {row.hash.slice(0, 30)}…
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-[#e7e7f1] rounded-full transition-colors text-[#424753] hover:text-[#0058bd]">
                      <FileJson className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#c2c6d5]">
          {logRows.map((row) => (
            <div key={row.id} className={`px-4 py-4 ${row.highlight ? 'bg-[#ffdad6]/20' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${row.actorBg} flex items-center justify-center shrink-0`}>
                    <row.actorIcon className={`w-4 h-4 ${row.actorIconColor}`} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#191b22]">{row.actor}</p>
                    <p className="font-mono text-[11px] text-[#424753]">{row.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <div className={`w-2 h-2 rounded-full ${row.dotColor}`} />
                  <span className={`text-[11px] font-bold ${row.eventColor}`}>{row.eventType}</span>
                </div>
              </div>
              <p className="text-[12px] text-[#424753] leading-relaxed">{row.detail}</p>
              <p className="font-mono text-[10px] text-[#727785] bg-[#f2f3fd] rounded px-2 py-1 mt-2 border border-[#c2c6d5] overflow-hidden text-ellipsis whitespace-nowrap">
                {row.hash.slice(0, 40)}…
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[#c2c6d5] flex items-center justify-between">
          <span className="text-[12px] text-[#424753]">Showing {logRows.length} immutable records</span>
          <div className="flex items-center gap-2">
            <button disabled className="p-2 rounded-lg bg-[#f2f3fd] border border-[#c2c6d5] text-[#424753] disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[14px] text-[#191b22] px-2">Page 1</span>
            <button className="p-2 rounded-lg bg-[#f2f3fd] border border-[#c2c6d5] text-[#424753] hover:border-[#0058bd] hover:text-[#0058bd] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
