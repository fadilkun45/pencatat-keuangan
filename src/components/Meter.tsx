import { budgetStatus, Tone } from '../lib/Formatter'

const bar: Record<Tone, string> = { aman: 'bg-aman', waspada: 'bg-waspada', bahaya: 'bg-bahaya' }

export const Meter = ({ spent, limit, thick }: { spent: number, limit: number, thick?: boolean }) => {
  const { pct, tone } = budgetStatus(spent, limit)
  return (
    <div
      role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.min(pct, 100))}
      aria-label="Budget terpakai"
      className={`overflow-hidden rounded-full bg-garis ${thick ? 'h-4' : 'h-2.5'}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none ${bar[tone]}`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  )
}
