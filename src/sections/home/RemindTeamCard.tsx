import { useState } from 'react'
import { DarkButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { currentPeriod, outstandingPeople, periodLabel, timesheetDueLabel } from '../../data/store'

const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`)
import { RequestTimeModal } from '../team/RequestTimeModal'

/**
 * Home card for chasing timesheets, styled like "Review N invoices" (owner request 2026-11-10; replaces "Needs
 * attention"). "Remind" opens the request dialog with everyone outstanding preselected.
 */
export function RemindTeamCard() {
  const { store, me } = useDemo()
  const [open, setOpen] = useState(false)
  const outstanding = outstandingPeople(store, me.name)
  const n = outstanding.length

  return (
    <section aria-labelledby="remind-team-title" className="flex items-center justify-between gap-6 rounded-lg border border-line bg-surface px-6 py-5 shadow-card">
      <div className="min-w-0">
        <h2 id="remind-team-title" className="text-title-sm font-semibold tracking-title text-ink">
          {n ? `Remind ${n} ${n === 1 ? 'person' : 'people'} to submit` : 'Everyone’s submitted'}
        </h2>
        {/* Who's outstanding and when it's due (owner request 2026-11-10). */}
        {n > 0 && (
          <p className="pt-0.5 text-small text-ink-muted">
            {list(outstanding)} {n === 1 ? "hasn't" : "haven't"} submitted {periodLabel(currentPeriod).split(' ')[0]} time, due {timesheetDueLabel}.
          </p>
        )}
      </div>
      {n > 0 && (
        <DarkButton trailingIcon="bell-white" onClick={() => setOpen(true)}>
          Remind
        </DarkButton>
      )}
      {open && <RequestTimeModal initialRecipients={outstanding} onClose={() => setOpen(false)} />}
    </section>
  )
}
