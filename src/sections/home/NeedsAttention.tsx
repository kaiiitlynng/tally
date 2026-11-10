import { Link } from 'react-router'
import { Icon } from '../../components/Icon'

const ITEMS = [
  { icon: 'review-doc-green', tile: 'bg-success-tile', title: '2 review questions', detail: 'Montrose v. Calder', action: 'Review', to: '/review/montrose' },
  { icon: 'clock-overdue', tile: 'bg-warn-tile', title: 'Maya is overdue', detail: 'Reminder sent in-app', action: 'View', to: '/team' },
]

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark'

/** Right-hand "Needs attention" card (Figma 36:249). */
export function NeedsAttention() {
  return (
    <aside aria-labelledby="needs-attention" className="w-aside shrink-0 self-start rounded-16 border border-line bg-surface p-4.5">
      <h3 id="needs-attention" className="text-14 text-ink">
        Needs attention
      </h3>
      <ul className="pt-1.75">
        {ITEMS.map((item) => (
          <li key={item.title} className="flex items-center gap-2.25 border-b border-line-row py-3.25">
            <span className={`grid size-8 shrink-0 place-items-center rounded-10 ${item.tile}`}>
              <Icon name={item.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-9 font-bold text-ink">{item.title}</span>
              <span className="block pt-0.5 text-7 text-ink-muted">{item.detail}</span>
            </span>
            <Link to={item.to} aria-label={`${item.action}: ${item.title}`} className={`rounded-10 text-8 text-ink underline hover:text-link ${FOCUS}`}>
              {item.action}
            </Link>
          </li>
        ))}
      </ul>
      {/* Prototype code layer routes this to Settings. */}
      <Link to="/settings" className={`mx-auto mt-3.25 flex w-fit items-center gap-1.5 rounded-10 text-8 text-link-soft hover:text-ink ${FOCUS}`}>
        <Icon name="sparkle" size={18} />
        View how Tally worked
      </Link>
    </aside>
  )
}
