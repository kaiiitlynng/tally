import { useDemo } from '../../components/DemoContext'
import { Pill, type PillTone } from '../../components/Pill'
import { FIRST, ROW, TABLE, TABLE_WRAP, TD, TH } from '../../components/tableStyles'
import { currentPeriod, daysOverdue, demoToday, initials, monthNames, notify, submissionStatus, timesheetDueLabel, type Submission } from '../../data/store'

const TONE: Record<Submission, PillTone> = { Submitted: 'success', 'Due soon': 'accent', 'Not submitted': 'neutral', Overdue: 'danger' }
/** Overdue first, then due soon, then not submitted, then submitted. */
const ORDER: Record<Submission, number> = { Overdue: 0, 'Due soon': 1, 'Not submitted': 2, Submitted: 3 }
// Reorganised by the owner (2026-11-10), replacing Figma 36:7802: who, where they stand (with the last reminder
// underneath), when they last submitted, then the action.
const COLS = ['34%', '28%', '20%', '18%']
const day = (iso?: string) => (iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '')

/** Every status is about the current period (from submissionStatus); overdue says by how much. */
const statusText = (s: Submission) => (s === 'Overdue' ? `Overdue · ${daysOverdue()} ${daysOverdue() === 1 ? 'day' : 'days'}` : s)
const periodName = monthNames[currentPeriod.month - 1]

/** Team submission table (Figma 36:7801). */
export function TeamTable() {
  const { store, update, me, toast } = useDemo()

  function remind(person: string) {
    update((s) => {
      s.lastReminded[person] = demoToday
      s.reminderLog.unshift(`Manual in-app reminder sent to ${person}`)
      notify(s, person, `${me.firstName} sent a reminder: ${periodName} time is due ${timesheetDueLabel}`, '/time', 'reminder')
    })
    toast(`Reminder sent to ${person}`)
  }

  const rows = store.team
    // The partner doesn't remind themselves.
    .filter(({ name }) => name !== me.name)
    .map(({ name }) => ({ name, status: submissionStatus(store, name) }))
    .sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.name.localeCompare(b.name))

  return (
    <div className={`mt-3.75 ${TABLE_WRAP} shadow-card`}>
      <table className={TABLE}>
        <colgroup>
          {COLS.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={`${TH} ${FIRST}`}>
              Team member
            </th>
            <th scope="col" className={TH}>
              Status
            </th>
            <th scope="col" className={TH}>
              Last submitted
            </th>
            <th scope="col" className={`${TH} pr-4`}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ name: p, status }) => {
            const reminded = store.lastReminded[p]
            const remindedToday = reminded === demoToday
            return (
              <tr key={p} className={ROW}>
                <th scope="row" className={`${TD} ${FIRST} text-left`}>
                  <span className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-full bg-teammate text-caption font-normal" aria-hidden="true">
                      {initials(p)}
                    </span>
                    <b className="font-semibold">{p}</b>
                  </span>
                </th>
                <td className={TD}>
                  <Pill tone={TONE[status]}>{statusText(status)}</Pill>
                  {/* Earlier reminders show here; today's shows in the action column instead. */}
                  {reminded && !remindedToday && <span className="block pt-1 text-caption text-ink-muted">Reminded {day(reminded)}</span>}
                </td>
                <td className={TD}>{day(store.lastSubmitted[p]) || <span className="text-ink-muted">Never</span>}</td>
                <td className={`${TD} pr-4`}>
                  {status !== 'Submitted' &&
                    (remindedToday ? (
                      <span className="px-2.5 text-small text-ink-muted">Reminded today</span>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Send reminder to ${p}`}
                        onClick={() => remind(p)}
                        className="inline-flex h-8 items-center rounded-sm px-2.5 text-small font-semibold text-link transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        Send reminder
                      </button>
                    ))}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
