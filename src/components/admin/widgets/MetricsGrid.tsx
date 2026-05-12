export function MetricsGrid() {
  const metrics = [
    { title: 'Pending reviews', value: 12 },
    { title: 'Approved today', value: 46 },
    { title: 'Total payout (NGN)', value: '₦4,320,000' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((m) => (
        <div key={m.title} className="rounded-lg border p-4 bg-white">
          <p className="text-sm text-zinc-500">{m.title}</p>
          <p className="mt-2 text-2xl font-semibold">{m.value}</p>
        </div>
      ))}
    </div>
  )
}

export default MetricsGrid
