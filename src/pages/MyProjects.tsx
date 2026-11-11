import { useState } from 'react'
import { useNavigate } from 'react-router'
import { DarkButton, OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { PROJECT_TABS, SegmentedTabs } from '../components/SegmentedTabs'
import { CARD_AVATAR as AVATAR, CARD_META as META } from '../components/projectCardStyles'
import { archivedProjects, lastBilled } from '../data/history'
import { projectProgress, projectTint } from '../data/progress'
import { initials, tableDate, type Project } from '../data/store'
import { ProjectDrawer } from '../sections/employee/ProjectDrawer'
import type { TimeIntent } from './TimeEntries'

/**
 * My Projects (Figma 36:11817 current, 36:12137 past). Cards match the partner's Clients & Projects cards
 * (owner request 2026-11-10): title + client line + team, Status and one date, fixed-width actions. The project
 * name opens the details drawer (code layer).
 */
export default function MyProjects() {
  const { store, me } = useDemo()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'current' | 'past'>('current')
  const [details, setDetails] = useState<Project | null>(null)

  const mine = store.projects.filter((p) => p.people.includes(me.name))
  // Past = projects completed this cycle plus closed projects from earlier cycles (read-only archive).
  const archived = archivedProjects.filter((p) => p.people.includes(me.name))
  const shown = tab === 'current' ? mine.filter((p) => p.status === 'Active') : [...mine.filter((p) => p.status !== 'Active'), ...archived]
  const isArchived = (p: Project) => archived.includes(p)
  const toTime = (projectId: string, mode: TimeIntent['mode'], period?: string) => navigate('/time', { state: { intent: { projectId, mode, period } satisfies TimeIntent } })
  // A closed project opens on the month it was last billed (or all time); current projects on the current period.
  const periodOf = (p: Project) => {
    if (!archived.includes(p)) return undefined
    const billed = lastBilled(p.id)?.period
    return billed ? `${billed.year}-${String(billed.month).padStart(2, '0')}` : 'all'
  }

  return (
    <>
      <PageTitle title="My Projects" />

      <SegmentedTabs label="Project history" tabs={PROJECT_TABS} value={tab} onChange={setTab} idPrefix="my-projects" className="mt-4" />

      <div id="my-projects-panel" role="tabpanel" aria-labelledby={`my-projects-tab-${tab}`}>
        {shown.length ? (
          <div className="grid grid-cols-2 gap-3.5 pt-3.75">
            {shown.map((p) => {
              const progress = projectProgress(store, p, me.name)
              const past = tab === 'past'
              // Same three-way status as the partner's cards: done, in progress, or a problem that needs action.
              const status = past ? (
                <Pill tone="success">Completed</Pill>
              ) : progress.status === 'Submitted' ? (
                <Pill tone="success">Submitted</Pill>
              ) : progress.status === 'Needs correction' || progress.status === 'Overdue' ? (
                <Pill tone="danger" icon="warning-caution">
                  {progress.status}
                </Pill>
              ) : (
                <Pill tone="neutral">In progress</Pill>
              )
              const second: [string, string] = past
                ? isArchived(p)
                  ? ['Last billed', lastBilled(p.id)?.label ?? '—']
                  : ['Completed', p.completedDate ? tableDate(p.completedDate) : '—']
                : ['Timesheet due', progress.dueLabel]
              return (
                <article key={p.id} className={`flex flex-col rounded-lg border p-4 shadow-card ${projectTint(p.id)}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-title-sm font-semibold tracking-title text-ink">
                        {isArchived(p) ? (
                          p.name
                        ) : (
                          <button type="button" onClick={() => setDetails(p)} className="rounded-xs text-left hover:underline focus-visible:outline-2 focus-visible:outline-accent">
                            {p.name}
                          </button>
                        )}
                      </h2>
                      <p className="pt-0.5 text-caption text-ink-muted">
                        {p.client} · {p.code}
                      </p>
                    </div>
                    <ul className="flex shrink-0 pl-1.5" aria-label="Team members">
                      {p.people.map((person) => (
                        <li key={person} title={person} className={AVATAR}>
                          {initials(person)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-card-rule pt-3">
                    <div>
                      <dt className={META}>Status</dt>
                      <dd className="pt-1 text-small font-semibold text-ink">{status}</dd>
                    </div>
                    <div className="border-l border-card-rule pl-3">
                      <dt className={META}>{second[0]}</dt>
                      <dd className="pt-1 text-small font-semibold text-ink">{second[1]}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto flex gap-2 pt-5">
                    {!past && (
                      <DarkButton className="h-9 w-36 text-small" leadingIcon="plus-white-sm" iconSize={14} onClick={() => toTime(p.id, 'log')}>
                        Log hours
                      </DarkButton>
                    )}
                    <OutlineButton className="h-9 w-36 text-small" onClick={() => toTime(p.id, 'entries', periodOf(p))}>
                      View entries
                    </OutlineButton>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          // Empty state from the code layer (.empty-projects).
          <div className="mt-3.75 rounded-lg border border-dashed border-line-dashed bg-surface px-5 py-13.75 text-center text-ink-empty">
            <Icon name="folder-empty" size={18} className="mx-auto" />
            <h2 className="mt-2.5 mb-1 text-lead font-semibold text-ink">No {tab} projects</h2>
            <p className="text-caption">{tab === 'current' ? "You don't have any active project assignments." : 'Completed and archived projects will appear here.'}</p>
          </div>
        )}
      </div>

      {details && <ProjectDrawer project={details} onClose={() => setDetails(null)} />}
    </>
  )
}
