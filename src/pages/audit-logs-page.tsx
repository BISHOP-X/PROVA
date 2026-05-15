import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CalendarDays, Download, FileJson, Lock, UserSearch } from 'lucide-react';
import { listAuditEvents } from '@/lib/api';

function severityTone(severity: 'info' | 'warn' | 'critical') {
  if (severity === 'critical') {
    return 'bg-[#ffdad6] text-[#ba1a1a]';
  }

  if (severity === 'warn') {
    return 'bg-[#ffdcc4] text-[#8f4a00]';
  }

  return 'bg-[#d8e2ff] text-[#0058bd]';
}

function formatTimestamp(value: string) {
  const date = new Date(value);

  return {
    date: new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
    }).format(date),
  };
}

export function AuditLogsPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [eventType, setEventType] = useState('');
  const [severity, setSeverity] = useState<'critical' | 'info' | 'warn' | ''>('');
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['audit-events', { eventType, from, severity, to }],
    queryFn: () => listAuditEvents({
      eventType: eventType || undefined,
      from: from || undefined,
      limit: 50,
      severity: severity || undefined,
      to: to || undefined,
    }),
  });

  const records = data?.records ?? [];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-medium leading-7 text-[#191b22]">System Audit Logs</h1>
          <p className="text-[14px] text-[#424753] mt-1">Immutable trail of verification, review, and payout actions flowing through PROVA.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d8e2ff] text-[#0058bd] text-[12px] font-bold tracking-[0.04em]">
            <Lock className="w-4 h-4" />
            Audit Ledger Active
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#191b22] font-bold text-[12px] rounded-lg border border-[#c2c6d5] hover:bg-[#f2f3fd] transition-colors" type="button">
            <Download className="w-4 h-4" />
            EXPORT
          </button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3 text-[14px] text-[#93000a]">
          Audit log feed failed to load: {error.message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#c2c6d5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 text-[#424753] mb-3">
            <CalendarDays className="w-4 h-4 text-[#0058bd]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.05em]">Temporal Range</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <input className="flex-1 w-full bg-[#f9f9ff] border border-[#c2c6d5] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0058bd] focus:border-[#0058bd]" onChange={(event) => setFrom(event.target.value)} type="date" value={from} />
            <span className="text-[#424753] hidden sm:block font-bold">-</span>
            <input className="flex-1 w-full bg-[#f9f9ff] border border-[#c2c6d5] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0058bd] focus:border-[#0058bd]" onChange={(event) => setTo(event.target.value)} type="date" value={to} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#c2c6d5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 text-[#424753] mb-3">
            <UserSearch className="w-4 h-4 text-[#0058bd]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.05em]">Event Search</span>
          </div>
          <input
            className="w-full bg-[#f9f9ff] border border-[#c2c6d5] rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0058bd] focus:border-[#0058bd]"
            onChange={(event) => setEventType(event.target.value)}
            placeholder="verification, review, payout..."
            type="text"
            value={eventType}
          />
        </div>

        <div className="bg-white rounded-xl border border-[#c2c6d5] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 text-[#424753] mb-3">
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.05em]">Event Severity</span>
          </div>
          <div className="flex gap-2">
            {[
              { label: 'ALL', value: '' as const },
              { label: 'INFO', value: 'info' as const },
              { label: 'WARN', value: 'warn' as const },
              { label: 'CRITICAL', value: 'critical' as const },
            ].map((option) => (
              <button
                className={`flex-1 py-1.5 border text-[11px] font-bold uppercase rounded-lg transition-colors ${
                  severity === option.value
                    ? option.value === 'critical'
                      ? 'bg-[#ffdad6] border-[#ba1a1a]/20 text-[#ba1a1a]'
                      : option.value === 'warn'
                        ? 'bg-[#ffdcc4] border-[#8f4a00]/20 text-[#8f4a00]'
                        : 'bg-[#d8e2ff] border-[#0058bd]/20 text-[#0058bd]'
                    : 'bg-[#f9f9ff] border-[#c2c6d5] text-[#191b22] hover:bg-[#e7e7f1]'
                }`}
                key={option.label}
                onClick={() => setSeverity(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#c2c6d5] shadow-[0_1px_3px_rgba(0,0,0,0.12)] overflow-hidden">
        {isLoading ? (
          <div className="px-6 py-8 text-center text-[14px] text-[#424753] bg-[#f9f9ff]">
            Loading live audit records...
          </div>
        ) : null}

        {!isLoading && !records.length ? (
          <div className="px-6 py-8 text-center text-[14px] text-[#424753] bg-[#f9f9ff]">
            No audit records matched the current filters.
          </div>
        ) : null}

        {records.length ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[920px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f3fd] border-b border-[#c2c6d5]">
                    {['Timestamp', 'Actor', 'Event', 'Details & Hash', 'Action'].map((heading) => (
                      <th className="px-6 py-4 text-[11px] font-bold tracking-[0.06em] text-[#424753] uppercase" key={heading}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c2c6d5]">
                  {records.map((record) => {
                    const timestamp = formatTimestamp(record.createdAt);

                    return (
                      <tr className={`hover:bg-[#f9f9ff] transition-colors ${record.severity === 'critical' ? 'bg-[#ffdad6]/20' : ''}`} key={record.id}>
                        <td className="px-6 py-4">
                          <p className="font-mono text-[13px] font-bold text-[#191b22]">{timestamp.date}</p>
                          <p className="font-mono text-[11px] text-[#424753]">{timestamp.time}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[14px] font-medium text-[#191b22]">{record.actorName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase ${severityTone(record.severity)}`}>
                            {record.severity}
                          </span>
                          <p className="text-[13px] text-[#191b22] mt-2">{record.eventType}</p>
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          <p className="text-[13px] text-[#191b22]">{record.details}</p>
                          <p className="font-mono text-[11px] text-[#727785] bg-[#f2f3fd] rounded px-2 py-0.5 mt-1 truncate max-w-full inline-block border border-[#c2c6d5]">
                            hash: {record.hash.slice(0, 32)}...
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 hover:bg-[#e7e7f1] rounded-full transition-colors text-[#424753] hover:text-[#0058bd]" type="button">
                            <FileJson className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-[#c2c6d5]">
              {records.map((record) => (
                <div className={`px-4 py-4 ${record.severity === 'critical' ? 'bg-[#ffdad6]/20' : ''}`} key={record.id}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[13px] font-bold text-[#191b22]">{record.actorName}</p>
                      <p className="font-mono text-[11px] text-[#424753]">{formatTimestamp(record.createdAt).date} · {formatTimestamp(record.createdAt).time}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${severityTone(record.severity)}`}>
                      {record.severity}
                    </span>
                  </div>
                  <p className="text-[12px] font-bold text-[#191b22]">{record.eventType}</p>
                  <p className="text-[12px] text-[#424753] leading-relaxed mt-2">{record.details}</p>
                  <p className="font-mono text-[10px] text-[#727785] bg-[#f2f3fd] rounded px-2 py-1 mt-2 border border-[#c2c6d5] overflow-hidden text-ellipsis whitespace-nowrap">
                    {record.hash.slice(0, 40)}...
                  </p>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-[#c2c6d5] flex items-center justify-between">
              <span className="text-[12px] text-[#424753]">Showing {records.length} of {data?.meta.total ?? records.length} immutable records</span>
              <span className="text-[12px] font-mono text-[#191b22]">Limit {data?.meta.limit ?? 50}</span>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
