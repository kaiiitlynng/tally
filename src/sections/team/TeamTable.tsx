import { useDemo } from '../../components/DemoContext'
import { Pill, type PillTone } from '../../components/Pill'
import { initials, people, type Submission } from '../../data/store'

const TONE: Record<Submission, PillTone> = { Submitted: 'success', 'Due soon': 'accent', Overdue: 'danger' }
// Column widths from Figma (36:7802): 242.77 / 161.85 / 131.51 / 121.39 / 161.85 / 141.62 px.
const COLS = ['25.3%', '16.8%', '13.7%', '12.6%', '16.8%', '14.8%']
const TH = 'h-8.75 text-left align-middle text-7 font-normal tracking-th text-ink-th uppercase'
const TD = 'h-14.5 border-t border-line-row align-middle text-9 text-ink'

/** Team submission table (Figma 36:7801). */
export function TeamTable() {
  const { store, update } = useDemo()

  return (
    <div className="mt-3.75 overflow-hidden rounded-14 border border-line bg-surface">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          {COLS.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={`${TH} pl-4`}>Team member</th>
            <th scope="col" className={TH}>Last submission</th>
            <th scope="col" className={TH}>Status</th>
            <th scope="col" className={TH}>Next due</th>
            <th scope="col" className={TH}>Reminder</th>
            <th scope="col" className={`${TH} pr-4`}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {people.map((p) => {
            const status = store.submissions[p]
            const submitted = status === 'Submitted'
            return (
              <tr key={p}>
                <th scope="row" className={`${TD} pl-4 text-left`}>
                  <span className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-full bg-teammate text-7 font-normal" aria-hidden="true">
                      {initials(p)}
                    </span>
                    <b className="font-bold">{p}</b>
                  </span>
                </th>
                <td className={TD}>{p === 'Maya Singh' ? 'Apr 30' : 'May 29'}</td>
                <td className={TD}>
                  <Pill tone={TONE[status]}>{status}</Pill>
                </td>
                <td className={TD}>June 3</td>
                <td className={TD}>{submitted ? 'Canceled' : 'Scheduled'}</td>
                <td className={`${TD} pr-4 text-right`}>
                  <button
                    type="button"
                    disabled={submitted}
                    aria-label={`Send reminder to ${p}`}
                    onClick={() =>
                      update((s) => {
                        s.reminderLog.unshift(`Manual in-app reminder sent to ${p} just now`)
                      })
                    }
                    className="rounded-10 text-8 text-link hover:underline focus-visible:outline-2 focus-visible:outline-dark disabled:opacity-30 disabled:hover:no-underline"
                  >
                    Send reminder
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
