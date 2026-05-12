export function ReviewQueue() {
  const items = [
    { id: 'V-101', name: 'Adaeze Okafor', reason: 'Low liveness score' },
    { id: 'V-102', name: 'Mohammed Bello', reason: 'Document mismatch' },
  ]

  return (
    <section>
      <h3 className="text-lg font-medium">Review Queue</h3>
      <div className="mt-3 space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-zinc-500">{i.id} • {i.reason}</div>
            </div>
            <div className="flex gap-2">
              <button className="rounded-md px-2 py-1 bg-emerald-600 text-white text-sm">Approve</button>
              <button className="rounded-md px-2 py-1 bg-amber-500 text-white text-sm">Hold</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReviewQueue
