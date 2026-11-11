import { Link } from 'react-router'
import { uid, useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { demoToday, outstandingPeople, submissionStatus, submittedThisPeriod, type Submission } from '../../data/store'

/**
 * The scheduled 24-hour reminder run, simulated (spec item 4): reminds everyone still outstanding, then the last
 * outstanding person (Ryan) submits and every project whose whole team is in is announced. Its button was removed
 * from Manage Team (owner request 2026-11-10); the function is kept for demos and is not wired to the UI.
 */
export function useReminderRun() {
  const { store, update, toast, me } = useDemo()
  return () => {
    const late = outstandingPeople(store, me.name)[0]
    const submitted = (person: string) => person === late || submittedThisPeriod(store, person)
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
      const outstanding = outstandingPeople(s, me.name)
      if (s.reminderSchedule.oneDay && outstanding.length) {
        outstanding.forEach((n) => (s.lastReminded[n] = demoToday))
        s.reminderLog.unshift(`24-hour reminder sent in-app to ${outstanding.join(', ')}`)
      } else s.reminderLog.unshift('24-hour reminder run: nothing to send')
      if (!late) return
      s.lastSubmitted[late] = demoToday
      s.reminderLog.unshift(`${late} submitted May time; pending reminders canceled`)
      ;[...ready].reverse().forEach((p) => {
        if (s.invoiceStatus[p.id] === 'Draft') s.invoiceStatus[p.id] = 'In review'
        s.notifications.unshift({ id: uid(), text: text(p.name), to: `/review/${p.id}`, read: false })
      })
    })
    if (ready[0]) toast(text(ready[0].name))
  }
}

const SCHEDULE = [
  ['sevenDays', '1 week before'],
  ['oneDay', '1 day before'],
  ['overdue', '1 day after'],
] as const

/** Status counters (from submissionStatus) + automatic reminders card (Figma 36:7765). */
export function SubmissionStats() {
  const { store, update, me } = useDemo()
  // Counts the people the partner reminds: the team, minus the partner.
  const count = (status: Submission) => store.team.filter((m) => m.name !== me.name && submissionStatus(store, m.name) === status).length

  // Same colors as the status pills in the table below. "Submitted" and "Due soon" always show; the others only
  // when someone is in them (no demo data is overdue).
  const stats = (
    [
      { label: 'Submitted', tone: 'border-step-done-line bg-success-pill/60 text-success-ink', always: true },
      { label: 'Due soon', tone: 'border-brand-200 bg-accent-soft text-accent-ink', always: true },
      { label: 'Not submitted', tone: 'border-line bg-surface text-ink-muted', always: false },
      { label: 'Overdue', tone: 'border-danger-line bg-danger-soft text-danger-ink', always: false },
    ] as const
  ).filter((c) => c.always || count(c.label) > 0)

  return (
    <div className="flex gap-2.5 pt-6">
      {stats.map(({ label, tone }) => (
        <div key={label} className={`flex w-37.5 shrink-0 flex-col justify-center gap-1 rounded-lg border p-4 shadow-card ${tone}`}>
          <b className="font-display text-display leading-none font-bold tracking-stat-sm">{count(label)}</b>
          <span className="text-caption font-semibold">{label}</span>
        </div>
      ))}
      <div className="flex flex-1 flex-col rounded-lg border border-line bg-surface px-4 pt-5 pb-4 shadow-card">
        <b className="block text-body font-semibold text-ink">Automatic reminders</b>
        <p className="pt-0.5 text-caption text-ink-muted">Sent to anyone who hasn&apos;t submitted.</p>
        {/* Editable schedule (spec item 7): each chip toggles its reminder; on = filled with a check, off = outlined. */}
        <div role="group" aria-label="Automatic reminders" className="flex flex-wrap gap-1.5 pt-2">
          {SCHEDULE.map(([key, label]) => {
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
                className={`inline-flex h-7 items-center gap-1 rounded-pill border px-2.5 text-caption font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                  on ? 'border-success-pill bg-success-pill text-success-ink' : 'border-line bg-white font-medium text-ink-muted hover:border-line-field'
                }`}
              >
                {on && <Icon name="check-green" size={12} />}
                {label}
              </button>
            )
          })}
        </div>
        {!store.reminderChannels.email && (
          <p className="mt-auto pt-3 text-caption text-ink-muted">
            In-app only ·{' '}
            <Link to={store.gmailConnected ? '/settings?tab=notifications' : '/settings?tab=integrations'} className="rounded-xs font-semibold text-link hover:underline focus-visible:outline-2 focus-visible:outline-accent">
              {store.gmailConnected ? 'Turn on email' : 'Connect email'}
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
