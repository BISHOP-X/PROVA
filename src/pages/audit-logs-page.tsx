import { Lock, Download, CalendarDays, UserSearch, AlertTriangle, Bot, ShieldAlert, Settings, ShieldCheck, FileJson, ChevronLeft, ChevronRight } from 'lucide-react';

const logRows = [
  {
    timestamp: '2023-10-25 14:32:01',
    ms: '.842Z',
    actorIcon: Bot,
    actorBg: 'bg-[#d8e2ff]',
    actorIconColor: 'text-[#0058bd]',
    actor: 'KYC_Engine_v3',
    dotColor: 'bg-green-500',
    eventType: 'Verification Approved',
    eventColor: 'text-[#191b22]',
    detail: 'Beneficiary DOC_ID: bnf_8x92m. Confidence score: 99.4%',
    hash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    highlight: false,
  },
  {
    timestamp: '2023-10-25 14:30:45',
    ms: '.112Z',
    actorIcon: ShieldAlert,
    actorBg: 'bg-[#ffdad6]',
    actorIconColor: 'text-[#ba1a1a]',
    actor: 'Admin.094',
    dotColor: 'bg-[#ba1a1a]',
    eventType: 'Payout Initiated',
    eventColor: 'text-[#ba1a1a] font-bold',
    detail: 'Manual override on block: Risk score 82. Amount: $450,000.00',
    hash: '0x5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    highlight: true,
  },
  {
    timestamp: '2023-10-25 14:15:00',
    ms: '.000Z',
    actorIcon: Settings,
    actorBg: 'bg-[#e7e7f1]',
    actorIconColor: 'text-[#424753]',
    actor: 'Sys_Cron_Node',
    dotColor: 'bg-[#8f4a00]',
    eventType: 'Batch Sync',
    eventColor: 'text-[#191b22]',
    detail: 'Completed ledger synchronization with remote node NA-EAST-1. 14,204 records updated.',
    hash: '0x8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    highlight: false,
  },
  {
    timestamp: '2023-10-25 13:45:22',
    ms: '.331Z',
    actorIcon: ShieldCheck,
    actorBg: 'bg-[#e7e7f1]',
    actorIconColor: 'text-[#424753]',
    actor: 'Admin.094',
    dotColor: 'bg-[#0058bd]',
    eventType: 'Session Login',
    eventColor: 'text-[#191b22]',
    detail: 'MFA validated via Hardware Token. IP: 192.168.1.44 (Internal VPN)',
    hash: '0x3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
    highlight: false,
  },
];

export function AuditLogsPage() {
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
                <tr key={row.timestamp} className={`hover:bg-[#f9f9ff] transition-colors ${row.highlight ? 'bg-[#ffdad6]/20' : ''}`}>
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
            <div key={row.timestamp} className={`px-4 py-4 ${row.highlight ? 'bg-[#ffdad6]/20' : ''}`}>
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
          <span className="text-[12px] text-[#424753]">Showing 1–4 of 24,091 immutable records</span>
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
