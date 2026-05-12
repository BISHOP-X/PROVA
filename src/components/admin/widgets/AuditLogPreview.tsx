export function AuditLogPreview() {
  const events = [
    { id: 'E-1', desc: 'Transfer initiated for B-001' },
    { id: 'E-2', desc: 'Verification flagged V-101' },
  ]

  return (
    <section>
      <h3 className="text-lg font-medium">Recent Audit Events</h3>
      <div className="mt-3 space-y-2">
        {events.map((e) => (
          <div key={e.id} className="rounded-md border p-3 text-sm text-zinc-600">{e.desc}</div>
        ))}
      </div>
    </section>
  )
}

export default AuditLogPreview
