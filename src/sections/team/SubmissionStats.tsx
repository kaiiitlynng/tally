import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'

/** Submitted / Due soon / Overdue counters + automatic schedule card (Figma 36:7765). */
export function SubmissionStats() {
  const { store, update } = useDemo()
  const count = (status: string) => String(Object.values(store.submissions).filter((s) => s === status).length).padStart(2, '0')

  const stats = [
    { label: 'Submitted', icon: 'check-submitted', tile: 'bg-stat-submitted' },
    { label: 'Due soon', icon: 'clock-due', tile: 'bg-stat-due' },
    { label: 'Overdue', icon: 'bell-overdue', tile: 'bg-stat-overdue' },
  ]

  return (
    <div className="grid grid-cols-[150px_150px_150px_1fr] gap-2.5 pt-6">
      {stats.map((s) => (
        <div key={s.label} className="grid grid-cols-[35px_1fr] grid-rows-[46px_22px] rounded-14 border border-line bg-surface p-4">
          <span className={`row-span-2 grid size-8 place-items-center self-center rounded-10 ${s.tile}`}>
            <Icon name={s.icon} size={18} />
          </span>
          <b className="self-center font-display text-24 font-bold tracking-stat-sm text-ink">{count(s.label)}</b>
          <span className="self-center text-8 text-ink">{s.label}</span>
        </div>
      ))}
      <div className="rounded-14 border border-line bg-surface px-4 pt-5 pb-4">
        <b className="block text-11 font-bold text-ink">Automatic schedule</b>
        <p className="pt-1.25 text-8 text-ink-muted">7 days before · 24 hours before · 1 day overdue</p>
        <button
          type="button"
          onClick={() =>
            update((s) => {
              s.reminderLog.unshift('Demo trigger: 24-hour reminders checked')
            })
          }
          className="mt-4 rounded-10 text-8 text-ink underline hover:text-link focus-visible:outline-2 focus-visible:outline-dark"
        >
          Run demo trigger
        </button>
      </div>
    </div>
  )
}
