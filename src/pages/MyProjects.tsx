import { useState } from 'react'
import { useNavigate } from 'react-router'
import { DarkButton, OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { PROJECT_TABS, SegmentedTabs } from '../components/SegmentedTabs'
import { CARD, CARD_AVATAR as AVATAR, CARD_META as META } from '../components/projectCardStyles'
import { archivedProjects, lastBilled } from '../data/history'
import { projectProgress, projectTint, type DeadlineState } from '../data/progress'
import { initials, tableDate, type Project } from '../data/store'
import { ProjectDrawer } from '../sections/employee/ProjectDrawer'
import type { TimeIntent } from './TimeEntries'

const DEADLINE_INK: Record<DeadlineState, string> = {
  submitted: 'text-success-ink',
  urgent: 'text-deadline-urgent',
  correction: 'text-deadline-urgent',
  overdue: 'text-deadline-overdue',
  normal: 'text-ink',
}

/** My Projects (Figma 36:11817 current, 36:12137 past). The details drawer follows the code layer. */
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
  const toTime = (projectId: string, mode: TimeIntent['mode']) => navigate('/time', { state: { intent: { projectId, mode } } })

  return (
    <>
      <PageTitle title="My Projects" description="View your projects and manage your timesheets." />

      <SegmentedTabs label="Project history" tabs={PROJECT_TABS} value={tab} onChange={setTab} idPrefix="my-projects" className="mt-4" />

      <div id="my-projects-panel" role="tabpanel" aria-labelledby={`my-projects-tab-${tab}`}>
      {shown.length ? (
        <div className="grid grid-cols-2 gap-3.5 pt-3.75">
          {shown.map((p) => {
            const progress = projectProgress(store, p, me.name)
            return (
              <article key={p.id} className={`${CARD} ${projectTint(p.id)}`}>
                {isArchived(p) ? (
                  <h2 className="pb-1 text-title font-semibold text-ink">{p.name}</h2>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDetails(p)}
                    className="self-start rounded-md pb-1 text-left text-title font-semibold text-ink hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {p.name}
                  </button>
                )}
                <p className="text-caption text-ink-muted">
                  {p.client} · {p.code}
                </p>

                {tab === 'current' ? (
                  <>
                    <div className="mt-4.25 grid grid-cols-2 gap-2.5 border-y border-card-rule py-3.25">
                      <div>
                        <small className={META}>SUBMISSION STATUS</small>
                        <button
                          type="button"
                          disabled={!progress.corrections}
                          onClick={() => navigate('/messages')}
                          className={`mt-1 flex min-h-6.75 items-center gap-1.5 text-title-sm font-semibold disabled:cursor-default ${DEADLINE_INK[progress.deadlineState]}`}
                        >
                          {progress.deadlineState === 'submitted' && <Icon name="check-submitted-lg" size={16} />}
                          {progress.deadlineDisplay}
                          {progress.corrections > 0 && <Icon name="arrow-right-small" size={14} />}
                        </button>
                      </div>
                      <div className="border-l border-card-rule pl-3">
                        <small className={META}>TIMESHEET DUE</small>
                        <b className="block pt-1.5 text-body font-semibold">{progress.dueLabel}</b>
                      </div>
                    </div>
                    <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                      <DarkButton leadingIcon="plus-white-sm" iconSize={14} onClick={() => toTime(p.id, 'log')}>
                        Log hours
                      </DarkButton>
                      <OutlineButton onClick={() => toTime(p.id, 'entries')}>
                        View entries
                      </OutlineButton>
                    </div>
                    <footer className="mt-3.5 flex items-center justify-between border-t border-card-foot pt-3.25">
                      <div>
                        <small className="block text-caption tracking-meta text-ink-meta-soft">BILLING REVIEWER</small>
                        <b className="block pt-1 text-body font-semibold">{p.reviewer}</b>
                      </div>
                      <div className="flex items-center gap-2.25">
                        <ul className="flex pl-1" aria-label="Team members">
                          {p.people.map((person) => (
                            <li key={person} title={person} className={AVATAR}>
                              {initials(person)}
                            </li>
                          ))}
                        </ul>
                        <small className="pl-1.25 text-caption text-ink-meta-soft">{p.people.length} team members</small>
                      </div>
                    </footer>
                  </>
                ) : (
                  <>
                    <div className="mt-4.25 grid grid-cols-[122fr_152fr_152fr] gap-3 border-y border-card-rule py-3.5">
                      <div>
                        <small className={META}>PROJECT STATUS</small>
                        <div className="pt-1.5">
                          <Pill tone="neutral">{p.status}</Pill>
                        </div>
                      </div>
                      <div className="border-l border-card-rule pl-3">
                        <small className={META}>COMPLETED</small>
                        <b className="block pt-1.75 text-caption font-semibold">{p.completedDate ? tableDate(p.completedDate) : 'Date not recorded'}</b>
                      </div>
                      <div className="border-l border-card-rule pl-3">
                        <small className={META}>FINAL TIMESHEET</small>
                        <b className="block pt-1.75 text-caption font-semibold">{isArchived(p) || progress.submitted ? 'Submitted' : progress.status}</b>
                      </div>
                    </div>
                    {isArchived(p) ? (
                      // Closed in an earlier cycle: its entries aren't in this demo, so no "View entries".
                      <p className="mt-4 text-small text-ink-muted">Last billed {lastBilled(p.id)?.label}</p>
                    ) : (
                      <OutlineButton className="mt-4 w-full" onClick={() => toTime(p.id, 'entries')}>
                        View entries
                      </OutlineButton>
                    )}
                  </>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        // Empty state from the code layer (.empty-projects).
        <div className="mt-3.75 rounded-lg border border-dashed border-line-dashed bg-surface px-5 py-13.75 text-center text-ink-empty">
          <Icon name="folder-empty" size={18} className="mx-auto" />
          <h2 className="font-semibold mt-2.5 mb-1 text-lead text-ink">No {tab} projects</h2>
          <p className="text-caption">{tab === 'current' ? "You don't have any active project assignments." : 'Completed and archived projects will appear here.'}</p>
        </div>
      )}
      </div>

      {details && <ProjectDrawer project={details} onClose={() => setDetails(null)} />}
    </>
  )
}
