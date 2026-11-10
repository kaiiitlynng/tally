import { Link } from 'react-router'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { HeldRowItem } from './HeldRowItem'
import { allFlags, isOpen, overduePeople, projectName } from '../../data/store'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** Right-hand "Needs attention" card (Figma 36:249). */
export function NeedsAttention() {
  const { store } = useDemo()
  const openFlags = allFlags(store).filter(isOpen)
  const flaggedProjects = [...new Set(openFlags.map((f) => store.entries.find((e) => e.id === f.entryId)?.projectId).filter(Boolean))] as string[]

  // Both rows come from live data, so they disappear once the flags are resolved or the timesheet arrives.
  const ITEMS = [
    ...(openFlags.length
      ? [
          {
            icon: 'review-doc-green',
            tile: 'bg-success-tile',
            title: `${openFlags.length} review question${openFlags.length === 1 ? '' : 's'}`,
            detail: flaggedProjects.map((id) => projectName(store, id)).join(', '),
            action: 'Review',
            to: `/review/${flaggedProjects[0]}`,
          },
        ]
      : []),
    ...overduePeople(store).map((person) => ({
      icon: 'clock-overdue',
      tile: 'bg-warn-tile',
      title: `${person.split(' ')[0]} is overdue`,
      detail: store.reminderLog.some((l) => l.includes(person) && /reminder/i.test(l)) ? 'Reminder sent in-app' : '',
      action: 'View',
      to: '/team',
    })),
  ]
  return (
    <aside aria-labelledby="needs-attention" className="w-aside shrink-0 self-start rounded-lg border border-line bg-surface shadow-card p-5">
      <h3 id="needs-attention" className="text-lead font-semibold text-ink">
        Needs attention
      </h3>
      <ul className="pt-1.75">
        {store.heldRows.map((row) => (
          <HeldRowItem key={row.id} row={row} />
        ))}
        {ITEMS.map((item) => (
          <li key={item.title} className="flex items-center gap-3 border-b border-line-row py-3.5">
            <span className={`grid size-9 shrink-0 place-items-center rounded-md ${item.tile}`}>
              <Icon name={item.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-body font-semibold text-ink">{item.title}</span>
              {item.detail && <span className="block pt-0.5 text-small text-ink-muted">{item.detail}</span>}
            </span>
            <Link to={item.to} aria-label={`${item.action}: ${item.title}`} className={`inline-flex h-8 items-center rounded-sm px-2.5 text-small font-semibold text-link transition-colors hover:bg-brand-50 ${FOCUS}`}>
              {item.action}
            </Link>
          </li>
        ))}
      </ul>
      {/* Prototype code layer routes this to Settings. */}
      <Link to="/settings" className={`mx-auto mt-3 flex w-fit items-center rounded-sm px-2 py-1 text-small text-link-soft underline-offset-4 transition-colors hover:text-link hover:underline ${FOCUS}`}>
        View how Tally worked
      </Link>
    </aside>
  )
}
