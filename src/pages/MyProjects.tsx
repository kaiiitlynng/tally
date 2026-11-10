import { useState } from 'react'
import { useNavigate } from 'react-router'
import { DarkButton, OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { onTabListKeyDown } from '../components/tabKeys'
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
const META = 'block text-caption font-semibold tracking-meta text-ink-meta'
const AVATAR = '-mr-1.5 grid size-8 place-items-center rounded-full border-2 border-member-ring bg-member text-caption font-semibold text-brand'

/** My Projects (Figma 36:11817 current, 36:12137 past). The details drawer follows the code layer. */
export default function MyProjects() {
  const { store, me } = useDemo()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'current' | 'past'>('current')
  const [details, setDetails] = useState<Project | null>(null)

  const mine = store.projects.filter((p) => p.people.includes(me.name))
  const shown = mine.filter((p) => (tab === 'current' ? p.status === 'Active' : p.status !== 'Active'))
  const toTime = (projectId: string, mode: TimeIntent['mode']) => navigate('/time', { state: { intent: { projectId, mode } } })

  return (
    <>
      <PageTitle title="My Projects" description="View your projects and manage your timesheets." />

      <div role="tablist" aria-label="Project history" onKeyDown={onTabListKeyDown} className="mt-4.25 inline-flex gap-0.75 rounded-sm bg-surface-muted p-0.75 ring-1 ring-line">
        {(['current', 'past'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            tabIndex={tab === t ? 0 : -1}
            onClick={() => setTab(t)}
            className={`h-8 rounded-xs px-3 text-small font-medium transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-accent ${
              tab === t ? 'bg-white font-semibold text-brand shadow-segment' : 'text-ink-tab hover:text-ink'
            }`}
          >
            {t === 'current' ? 'Current Projects' : 'Past Projects'}
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="grid grid-cols-2 gap-3.5 pt-3.75">
          {shown.map((p) => {
            const progress = projectProgress(store, p, me.name)
            return (
              <article key={p.id} className={`flex flex-col rounded-lg border border-line p-5 shadow-card ${projectTint(p.id)}`}>
                <button
                  type="button"
                  onClick={() => setDetails(p)}
                  className="self-start rounded-md pb-1 text-left text-title font-semibold text-ink hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {p.name}
                </button>
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
                        <b className="block pt-1.75 text-caption font-semibold">{progress.submitted ? 'Submitted' : progress.status}</b>
                      </div>
                    </div>
                    <OutlineButton className="mt-4 w-full" onClick={() => toTime(p.id, 'entries')}>
                      View entries
                    </OutlineButton>
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

      {details && <ProjectDrawer project={details} onClose={() => setDetails(null)} />}
    </>
  )
}
