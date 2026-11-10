import { Link, useNavigate } from 'react-router'
import { DarkButton, OutlineButton } from '../../components/Button'
import { Pill } from '../../components/Pill'
import { CARD, CARD_AVATAR, CARD_META } from '../../components/projectCardStyles'
import { lastBilled } from '../../data/history'
import { projectTint } from '../../data/progress'
import { initials, tableDate, type Project } from '../../data/store'
import type { TimeIntent } from '../../pages/TimeEntries'

/**
 * Partner project card (Figma 36:758 content), laid out like the employee My Projects card (Figma 36:11839):
 * tinted card, title + client line, a ruled stats row, two actions, then reviewer and team.
 * `archived` = closed in an earlier cycle: shows completion and last billed cycle, links to that invoice.
 */
export function ProjectCard({ project: p, archived = false }: { project: Project; archived?: boolean }) {
  const navigate = useNavigate()
  const billed = archived ? lastBilled(p.id) : undefined
  const stats: [string, React.ReactNode][] = archived
    ? [
        ['PROJECT STATUS', <Pill tone="neutral">{p.status}</Pill>],
        ['COMPLETED', p.completedDate ? tableDate(p.completedDate) : 'Date not recorded'],
        ['LAST BILLED', billed?.label ?? '—'],
      ]
    : [
        ['PROJECT STATUS', <Pill tone={p.status === 'Active' ? 'success' : 'neutral'}>{p.status}</Pill>],
        ['TYPE', p.type],
        ['TIME DUE', p.deadline],
      ]

  return (
    <article className={`${CARD} ${projectTint(p.id)}`}>
      <h2 className="pb-1 text-title font-semibold text-ink">{p.name}</h2>
      <p className="text-caption text-ink-muted">
        {p.client} · {p.code}
      </p>

      <dl className="mt-4.25 grid grid-cols-3 gap-3 border-y border-card-rule py-3.5">
        {stats.map(([term, value], i) => (
          <div key={term} className={i ? 'border-l border-card-rule pl-3' : ''}>
            <dt className={CARD_META}>{term}</dt>
            <dd className="pt-1.5 text-body font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        {archived ? (
          billed && (
            <Link
              to={`/invoices?invoice=${billed.invoice.id}`}
              className="col-span-2 inline-flex h-10 items-center justify-center rounded-sm border border-line bg-surface px-4 text-body font-semibold text-ink shadow-card transition-colors hover:border-brand-200 hover:bg-hover hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View invoice
            </Link>
          )
        ) : (
          <>
            <DarkButton onClick={() => navigate(`/review/${p.id}`)}>Review invoice</DarkButton>
            <OutlineButton onClick={() => navigate('/time', { state: { intent: { projectId: p.id, mode: 'entries' } satisfies TimeIntent } })}>
              View entries
            </OutlineButton>
          </>
        )}
      </div>

      <footer className="mt-3.5 flex items-center justify-between border-t border-card-foot pt-3.25">
        <div>
          <small className="block text-caption tracking-meta text-ink-meta-soft">BILLING REVIEWER</small>
          <b className="block pt-1 text-body font-semibold">{p.reviewer}</b>
        </div>
        <div className="flex items-center gap-2.25">
          <ul className="flex pl-1" aria-label="Team members">
            {p.people.map((person) => (
              <li key={person} title={person} className={CARD_AVATAR}>
                {initials(person)}
              </li>
            ))}
          </ul>
          <small className="pl-1.25 text-caption text-ink-meta-soft">{p.people.length} team members</small>
        </div>
      </footer>
    </article>
  )
}
