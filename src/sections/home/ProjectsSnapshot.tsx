import { Link } from 'react-router'
import { DarkButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { currentPeriod, entryIsInPeriod } from '../../data/store'
import type { TimeIntent } from '../../pages/TimeEntries'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
/** Hours without a trailing ".0": 42.5, 9, 0. */
const hrs = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} hrs`

/**
 * "Projects" snapshot on Home (owner request 2026-11-10; replaces the "New project" card): up to three current
 * projects, active first, then most recent activity, each with hours logged this billing period. A row opens that
 * project's entries. "+ New project" opens the existing three-step flow; it's a primary button only when empty.
 */
export function ProjectsSnapshot({ onNew }: { onNew: () => void }) {
  const { store } = useDemo()
  const inPeriod = store.entries.filter((e) => entryIsInPeriod(e.date, currentPeriod))
  const lastActivity = (id: string) =>
    store.entries
      .filter((e) => e.projectId === id)
      .map((e) => e.date)
      .sort()
      .at(-1) ?? ''
  const rows = [...store.projects]
    .sort((a, b) => Number(b.status === 'Active') - Number(a.status === 'Active') || lastActivity(b.id).localeCompare(lastActivity(a.id)))
    .slice(0, 3)
    .map((p) => ({ ...p, hours: inPeriod.filter((e) => e.projectId === p.id).reduce((n, e) => n + e.hours, 0) }))

  return (
    <section aria-labelledby="home-projects" className="flex flex-col rounded-xl border border-hero-line bg-surface p-6 shadow-hero">
      <div className="flex items-center justify-between gap-3">
        <h2 id="home-projects" className="text-title-sm font-semibold tracking-title text-ink">
          Projects
        </h2>
        {rows.length > 0 && (
          <button type="button" onClick={onNew} className={`inline-flex h-8 items-center gap-1 rounded-sm px-2 text-small font-semibold text-link transition-colors hover:bg-hover ${FOCUS}`}>
            <span aria-hidden="true">+</span> New project
          </button>
        )}
      </div>

      {rows.length ? (
        <ul className="mt-3">
          {rows.map((p) => (
            <li key={p.id} className="border-b border-line-row last:border-b-0">
              <Link
                to="/time"
                state={{ intent: { projectId: p.id, mode: 'entries' } satisfies TimeIntent }}
                className={`-mx-2 flex items-center gap-4 rounded-sm px-2 py-3 transition-colors hover:bg-hover ${FOCUS}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body font-medium text-ink">{p.name}</span>
                  <span className="block truncate text-small text-ink-muted">{p.client}</span>
                </span>
                <span className="shrink-0 text-small text-ink tabular-nums">{hrs(p.hours)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-start justify-center gap-3 py-6">
          <p className="text-body text-ink-muted">No projects yet</p>
          <DarkButton leadingIcon="plus-white" onClick={onNew}>
            New project
          </DarkButton>
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-auto pt-3">
          <Link to="/clients" className={`group -ml-2 inline-flex items-center gap-1 rounded-sm px-2 py-1 text-small font-semibold text-link transition-colors hover:bg-hover ${FOCUS}`}>
            All projects
            <Icon name="arrow-right-small" size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </section>
  )
}
