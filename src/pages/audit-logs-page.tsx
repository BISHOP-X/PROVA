import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, CalendarDays, Download, FileJson, Lock, UserSearch } from 'lucide-react'
import { listAuditEvents } from '@/lib/api'

function severityTone(severity: 'info' | 'warn' | 'critical') {
  if (severity === 'critical') {
    return 'prova-chip-danger'
  }

  if (severity === 'warn') {
    return 'prova-chip-warm'
  }

  return 'prova-chip-info'
}

function formatTimestamp(value: string) {
  const date = new Date(value)

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
  }
}

export function AuditLogsPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [eventType, setEventType] = useState('')
  const [severity, setSeverity] = useState<'critical' | 'info' | 'warn' | ''>('')
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['audit-events', { eventType, from, severity, to }],
    queryFn: () =>
      listAuditEvents({
        eventType: eventType || undefined,
        from: from || undefined,
        limit: 50,
        severity: severity || undefined,
        to: to || undefined,
      }),
  })

  const records = data?.records ?? []

  return (
    <>
      <section className="prova-panel prova-hero-panel rounded-[32px] p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative z-10">
            <div className="prova-kicker w-fit">
              <Lock className="h-3.5 w-3.5" />
              Audit ledger
            </div>
            <h1 className="font-display prova-metric-value mt-5 text-[2.5rem] leading-[0.94] tracking-[-0.06em] text-white md:text-[4rem]">
              Audit Evidence
            </h1>
            <p className="mt-4 max-w-[520px] text-sm text-[#d9ccb8]">Every review, override, and payout event lands here.</p>
          </div>

          <div className="prova-panel-soft relative z-10 rounded-[28px] p-5">
            <p className="font-label text-[11px] uppercase tracking-[0.16em] text-[#998a76]">Audit state</p>
            <div className="mt-4 space-y-3">
              <div className="prova-panel-muted rounded-[22px] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">Records visible</p>
                <p className="font-display prova-metric-value mt-2 text-[2.3rem] leading-none text-white">{records.length}</p>
              </div>
              <div className="prova-panel-muted rounded-[22px] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#998a76]">Ledger mode</p>
                <p className="mt-2 text-sm text-[#efe2cf]">Verification, review, payout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="prova-chip-info">
              <Lock className="h-3.5 w-3.5" />
              Audit ledger active
            </span>
          </div>
          <button className="prova-button-secondary px-4 py-2.5 text-xs font-bold" type="button">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {isError ? (
          <div className="rounded-[22px] border border-[#ba1a1a]/30 bg-[#311311]/70 px-4 py-3 text-sm text-[#ffb4ab]">
            Audit log feed failed to load: {error.message}
          </div>
        ) : null}
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="prova-panel rounded-[28px] p-4">
          <div className="mb-3 flex items-center gap-2 text-[#ffd59f]">
            <CalendarDays className="h-4 w-4" />
            <span className="font-label text-[11px] uppercase tracking-[0.14em] text-[#998a76]">Temporal range</span>
          </div>
          <div className="flex flex-col gap-2">
            <input className="prova-input px-3 py-2.5 text-sm" onChange={(event) => setFrom(event.target.value)} type="date" value={from} />
            <input className="prova-input px-3 py-2.5 text-sm" onChange={(event) => setTo(event.target.value)} type="date" value={to} />
          </div>
        </div>

        <div className="prova-panel rounded-[28px] p-4">
          <div className="mb-3 flex items-center gap-2 text-[#ffd59f]">
            <UserSearch className="h-4 w-4" />
            <span className="font-label text-[11px] uppercase tracking-[0.14em] text-[#998a76]">Event search</span>
          </div>
          <input
            className="prova-input w-full px-3 py-2.5 text-sm"
            onChange={(event) => setEventType(event.target.value)}
            placeholder="verification, review, payout..."
            type="text"
            value={eventType}
          />
        </div>

        <div className="prova-panel rounded-[28px] p-4">
          <div className="mb-3 flex items-center gap-2 text-[#ffd59f]">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-label text-[11px] uppercase tracking-[0.14em] text-[#998a76]">Event severity</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', value: '' as const },
              { label: 'Info', value: 'info' as const },
              { label: 'Warn', value: 'warn' as const },
              { label: 'Critical', value: 'critical' as const },
            ].map((option) => (
              <button
                key={option.label}
                className={`rounded-full px-4 py-2 text-xs font-bold ${severity === option.value ? severityTone((option.value || 'info') as 'critical' | 'info' | 'warn') : 'prova-button-secondary'}`}
                onClick={() => setSeverity(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="prova-panel rounded-[32px] overflow-hidden">
        {isLoading ? (
          <div className="px-6 py-10 text-sm text-[#d9ccb8]">Loading live audit records...</div>
        ) : !records.length ? (
          <div className="px-6 py-10 text-sm text-[#d9ccb8]">No audit records matched the current filters.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="prova-table min-w-[980px] text-left">
                <thead>
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Actor</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Details and hash</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const timestamp = formatTimestamp(record.createdAt)

                    return (
                      <tr key={record.id}>
                        <td className="px-6 py-4">
                          <p className="font-mono text-[13px] font-bold text-white">{timestamp.date}</p>
                          <p className="font-mono text-[11px] text-[#998a76]">{timestamp.time}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-white">{record.actorName}</td>
                        <td className="px-6 py-4">
                          <span className={severityTone(record.severity)}>{record.severity}</span>
                          <p className="mt-2 text-sm text-[#efe2cf]">{record.eventType}</p>
                        </td>
                        <td className="px-6 py-4 max-w-[360px]">
                          <p className="text-sm leading-6 text-[#efe2cf]">{record.details}</p>
                          <div className="prova-panel-muted mt-2 rounded-[18px] px-3 py-2">
                            <p className="truncate font-mono text-[11px] text-[#d9ccb8]">hash: {record.hash.slice(0, 40)}...</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="prova-button-secondary h-10 w-10 p-0" type="button">
                            <FileJson className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/8 px-6 py-4">
              <span className="text-xs text-[#d9ccb8]">Showing {records.length} of {data?.meta.total ?? records.length} immutable records</span>
              <span className="font-mono text-xs text-[#998a76]">Limit {data?.meta.limit ?? 50}</span>
            </div>
          </>
        )}
      </section>
    </>
  )
}
