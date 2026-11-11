import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { DarkButton, OutlineButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Pill } from '../../components/Pill'
import { CARD_AVATAR, CARD_META } from '../../components/projectCardStyles'
import { lastBilled } from '../../data/history'
import { projectTint } from '../../data/progress'
import { completeness, initials, submittedThisPeriod, type Project } from '../../data/store'
import { RequestTimeModal } from '../team/RequestTimeModal'
import type { TimeIntent } from '../../pages/TimeEntries'

const BUTTON_W = 'h-9 w-36 text-small'

/**
 * Partner project card (Figma 36:758 content), compact (owner request 2026-11-10): title, client line, status and
 * time due (or last billed), two actions, team avatars. Status is one of "Completed", "In progress" or a problem
 * that needs action ("Time missing"; the Remind button names who). Type and reviewer were removed.
 * `archived` = closed in an earlier cycle: links to its last invoice.
 */
export function ProjectCard({ project: p, archived = false }: { project: Project; archived?: boolean }) {
  const navigate = useNavigate()
  const { store, me } = useDemo()
  const [reminding, setReminding] = useState(false)
  // Time still missing: the invoice can't be reviewed yet, so the status says who it's waiting on.
  const missing = !archived && completeness(store, p.id) === 'Time missing'
  const waitingOn = p.people.filter((n) => n !== me.name && store.team.some((m) => m.name === n) && !submittedThisPeriod(store, n))
  const billed = archived ? lastBilled(p.id) : undefined
  const completed = archived || p.status === 'Completed'

  const status = missing ? (
    <Pill tone="danger" icon="warning-caution">
      Time missing
    </Pill>
  ) : (
    <Pill tone={completed ? 'success' : 'neutral'}>{completed ? 'Completed' : 'In progress'}</Pill>
  )
  const stats: [string, React.ReactNode][] = [
    ['Status', status],
    archived ? ['Last billed', billed?.label ?? '—'] : ['Time due', p.deadline],
  ]

  return (
    <article className={`flex flex-col rounded-lg border p-4 shadow-card ${projectTint(p.id)}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-title-sm font-semibold tracking-title text-ink">{p.name}</h2>
          <p className="pt-0.5 text-caption text-ink-muted">
            {p.client} · {p.code}
          </p>
        </div>
        <ul className="flex shrink-0 pl-1.5" aria-label="Team members">
          {p.people.map((person) => (
            <li key={person} title={person} className={CARD_AVATAR}>
              {initials(person)}
            </li>
          ))}
        </ul>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-card-rule pt-3">
        {stats.map(([term, value], i) => (
          <div key={term} className={i ? 'border-l border-card-rule pl-3' : ''}>
            <dt className={CARD_META}>{term}</dt>
            <dd className="pt-1 text-small font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Fixed-width buttons, left-aligned, not stretched across the card. */}
      <div className="mt-auto flex gap-2 pt-5">
        {archived ? (
          billed && (
            <Link
              to={`/invoices?invoice=${billed.invoice.id}`}
              className="inline-flex h-9 w-36 items-center justify-center rounded-sm border border-line bg-surface px-3 text-small font-semibold text-ink shadow-card transition-colors hover:border-brand-200 hover:bg-hover hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View invoice
            </Link>
          )
        ) : (
          <>
            {missing ? (
              <DarkButton className={BUTTON_W} trailingIcon="bell-white" iconSize={16} disabled={!waitingOn.length} onClick={() => setReminding(true)}>
                {waitingOn.length === 1 ? `Remind ${waitingOn[0].split(' ')[0]}` : 'Remind team'}
              </DarkButton>
            ) : (
              <DarkButton className={BUTTON_W} onClick={() => navigate(`/review/${p.id}`)}>
                Review invoice
              </DarkButton>
            )}
            <OutlineButton className={BUTTON_W} onClick={() => navigate('/time', { state: { intent: { projectId: p.id, mode: 'entries' } satisfies TimeIntent } })}>
              View entries
            </OutlineButton>
          </>
        )}
      </div>
      {reminding && <RequestTimeModal initialRecipients={waitingOn} onClose={() => setReminding(false)} />}
    </article>
  )
}
