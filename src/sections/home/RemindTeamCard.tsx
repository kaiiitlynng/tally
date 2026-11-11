import { useState } from 'react'
import { DarkButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { outstandingPeople } from '../../data/store'
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
      <h2 id="remind-team-title" className="text-title-sm font-semibold tracking-title text-ink">
        {n ? `Remind ${n} ${n === 1 ? 'person' : 'people'} to submit` : 'Everyone’s submitted'}
      </h2>
      {n > 0 && (
        <DarkButton trailingIcon="bell-white" onClick={() => setOpen(true)}>
          Remind
        </DarkButton>
      )}
      {open && <RequestTimeModal initialRecipients={outstanding} onClose={() => setOpen(false)} />}
    </section>
  )
}
