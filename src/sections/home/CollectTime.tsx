import { Link } from 'react-router'
import { Icon } from '../../components/Icon'
import { SectionHeading } from '../../components/SectionHeading'

const OPTIONS = [
  { to: '/time?mode=import', icon: 'upload', title: 'Upload Excel files', description: 'Import one file or the whole team folder' },
  { to: '/time', icon: 'clock-accent', title: 'Enter hours directly', description: 'Add a clean, consistent time entry' },
]

/** "Collect time" — two entry points into Time Entries (Figma 36:120–36:155). */
export function CollectTime() {
  return (
    <section aria-labelledby="collect-time">
      <SectionHeading id="collect-time" title="Collect time" description="Both methods feed the same billing records." />
      <div className="grid grid-cols-2 gap-3 pt-3">
        {OPTIONS.map((o) => (
          <Link
            key={o.title}
            to={o.to}
            className="group flex items-center gap-3 rounded-lg border border-line bg-surface shadow-card p-4 card-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-md bg-accent-tile transition-colors duration-200 group-hover:bg-brand-200">
              <Icon name={o.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-body font-semibold text-ink">{o.title}</span>
              <span className="block pt-0.5 text-small text-ink-muted">{o.description}</span>
            </span>
            <Icon name="chevron-right-card" size={18} className="transition-transform duration-200 ease-stripe group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  )
}
