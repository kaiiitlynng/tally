import { useNavigate } from 'react-router'
import { DarkButton, OutlineButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { Dialog } from '../../components/Modal'
import { Pill } from '../../components/Pill'
import { projectProgress } from '../../data/progress'
import { currentPeriod, formatHours, initials, periodLabel, type Project } from '../../data/store'
import type { TimeIntent } from '../../pages/TimeEntries'

/** Project details side drawer, opened from a card title (prototype code layer; not drawn in Figma). */
export function ProjectDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const { store, me } = useDemo()
  const navigate = useNavigate()
  const progress = projectProgress(store, project, me.name)
  const toTime = (mode: TimeIntent['mode']) => navigate('/time', { state: { intent: { projectId: project.id, mode } } })

  const rows: [string, string][] = [
    ['Project type', project.type],
    ['Billing reviewer', project.reviewer],
    ['Billing period', periodLabel(currentPeriod)],
    ['Timesheet deadline', progress.dueLabel],
    ['My recorded hours', `${formatHours(progress.hours)} hrs`],
    ['Submission status', progress.statusText],
  ]
  const statusTone = progress.status === 'Submitted' ? 'success' : progress.status === 'Needs correction' || progress.status === 'Overdue' ? 'accent' : 'neutral'

  return (
    <Dialog labelledBy="drawer-title" onClose={onClose} placement="right" className="w-107.5 p-6.25">
      <div className="flex items-center justify-between border-b border-line pb-3.75">
        <div>
          <p className="text-small font-semibold tracking-eyebrow text-eyebrow uppercase">{periodLabel(currentPeriod)} billing period</p>
          <h2 id="drawer-title" className="mt-1 text-title tracking-title font-semibold">
            {project.name}
          </h2>
        </div>
        <button type="button" aria-label="Close project details" onClick={onClose} className="rounded-md p-1 hover:bg-segment focus-visible:outline-2 focus-visible:outline-accent">
          <Icon name="close" size={18} />
        </button>
      </div>
      <p className="mt-3.75 mb-3 text-small text-ink-muted">
        {project.client} · {project.code}
      </p>
      <div className="mb-4.5 flex gap-1.5">
        <Pill tone={project.status === 'Active' ? 'success' : 'neutral'}>{project.status}</Pill>
        <Pill tone={statusTone}>{progress.status}</Pill>
      </div>
      <dl className="border-t border-line">
        {rows.map(([t, d]) => (
          <div key={t} className="grid grid-cols-[130px_1fr] gap-3 border-b border-drawer-row py-2.75 text-small">
            <dt className="text-ink-muted">{t}</dt>
            <dd className="text-right font-semibold">{d}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5.25">
        <small className="block text-caption tracking-meta text-ink-meta-soft">ASSIGNED TEAM</small>
        <ul>
          {project.people.map((person) => (
            <li key={person} className="grid grid-cols-[34px_1fr_auto] items-center gap-2.25 border-b border-drawer-row py-2.25">
              <span className="grid size-8 place-items-center rounded-full bg-member text-caption" aria-hidden="true">
                {initials(person)}
              </span>
              <b className="text-small font-semibold">{person}</b>
              {person === project.reviewer && <em className="text-caption text-reviewer-ink not-italic">Billing reviewer</em>}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5.5 grid gap-1.75">
        {project.status === 'Active' && (
          <DarkButton leadingIcon="plus-white-sm" iconSize={14} onClick={() => toTime('log')}>
            Log hours
          </DarkButton>
        )}
        <OutlineButton onClick={() => toTime('entries')}>View my entries</OutlineButton>
        <OutlineButton onClick={() => navigate('/messages')} className="gap-2">
          <Icon name="message" size={14} /> Message reviewer
        </OutlineButton>
      </div>
    </Dialog>
  )
}
