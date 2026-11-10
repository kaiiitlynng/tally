import { uid, useDemo } from '../../components/DemoContext'
import { demoToday } from '../../data/store'
import { Icon } from '../../components/Icon'

/** Submitted / Due soon / Overdue counters + automatic schedule card (Figma 36:7765). */
export function SubmissionStats() {
  const { store, update, toast } = useDemo()
  const count = (status: string) => String(Object.values(store.submissions).filter((s) => s === status).length).padStart(2, '0')

  const stats = [
    { label: 'Submitted', icon: 'check-submitted', tile: 'bg-stat-submitted' },
    { label: 'Due soon', icon: 'clock-due', tile: 'bg-stat-due' },
    { label: 'Overdue', icon: 'bell-overdue', tile: 'bg-stat-overdue' },
  ]

  return (
    <div className="grid grid-cols-[150px_150px_150px_1fr] gap-2.5 pt-6">
      {stats.map((s) => (
        <div key={s.label} className="grid grid-cols-[35px_1fr] grid-rows-[46px_22px] rounded-lg border border-line bg-surface shadow-card p-4">
          <span className={`row-span-2 grid size-8 place-items-center self-center rounded-md ${s.tile}`}>
            <Icon name={s.icon} size={18} />
          </span>
          <b className="self-center font-display text-title font-bold tracking-stat-sm text-ink">{count(s.label)}</b>
          <span className="self-center text-caption text-ink">{s.label}</span>
        </div>
      ))}
      <div className="rounded-lg border border-line bg-surface shadow-card px-4 pt-5 pb-4">
        <b className="block text-body font-semibold text-ink">Automatic schedule</b>
        {/* Editable schedule (spec item 7): each reminder can be switched on or off. */}
        <div role="group" aria-label="Automatic reminders" className="flex flex-wrap gap-1.5 pt-1.5">
          {(
            [
              ['sevenDays', '7 days before'],
              ['oneDay', '24 hours before'],
              ['overdue', '1 day overdue'],
            ] as const
          ).map(([key, label]) => {
            const on = store.reminderSchedule[key]
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  update((s) => {
                    s.reminderSchedule[key] = !on
                    s.reminderLog.unshift(`Automatic reminder “${label}” turned ${on ? 'off' : 'on'}`)
                  })
                }
                className={`rounded-lg border px-2 py-1 text-caption focus-visible:outline-2 focus-visible:outline-accent ${
                  on ? 'border-success-line bg-success-pill text-success-ink' : 'border-line bg-white text-ink-muted line-through'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            // Simulates the last outstanding team member (Ryan) submitting, then announces every project
            // whose whole team is now in (spec item 4). Worked out from current data before updating.
            const late = Object.keys(store.submissions).find((p) => store.submissions[p] === 'Due soon')
            const submitted = (person: string) => person === late || store.submissions[person] === 'Submitted'
            const ready = late
              ? store.projects.filter(
                  (p) =>
                    p.people.includes(late) &&
                    p.people.every(submitted) &&
                    !store.notifications.some((n) => n.to === `/review/${p.id}`) &&
                    !['Approved', 'Exported', 'Sent'].includes(store.invoiceStatus[p.id]),
                )
              : []
            const text = (name: string) => `All May time is in for ${name}. Invoice is ready for your review.`
            update((s) => {
              s.reminderLog.unshift('Demo trigger: 24-hour reminders checked')
              if (!late) return
              s.submissions[late] = 'Submitted'
              s.lastSubmitted[late] = demoToday
              s.reminderLog.unshift(`${late} submitted May time; pending reminders canceled`)
              // Unshift in reverse so the list reads in project order, matching the toast.
              ;[...ready].reverse().forEach((p) => {
                if (s.invoiceStatus[p.id] === 'Draft') s.invoiceStatus[p.id] = 'In review'
                s.notifications.unshift({ id: uid(), text: text(p.name), to: `/review/${p.id}`, read: false })
              })
            })
            // The toast shows the first announcement; the bell keeps all of them.
            if (ready[0]) toast(text(ready[0].name))
          }}
          className="mt-2.5 rounded-md text-caption text-ink underline hover:text-link focus-visible:outline-2 focus-visible:outline-accent"
        >
          Run demo trigger
        </button>
      </div>
    </div>
  )
}
