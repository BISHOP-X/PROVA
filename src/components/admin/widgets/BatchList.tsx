export function BatchList() {
  const batches = [
    { id: 'B-001', name: 'Scholarship April', total: '₦1,200,000', status: 'Ready' },
    { id: 'B-002', name: 'Stipend May', total: '₦2,000,000', status: 'Processing' },
  ]

  return (
    <section>
      <h3 className="text-lg font-medium">Payout Batches</h3>
      <div className="mt-3 space-y-2">
        {batches.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">{b.name}</div>
              <div className="text-sm text-zinc-500">{b.id} • {b.total}</div>
            </div>
            <div className="text-sm text-zinc-600">{b.status}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BatchList
