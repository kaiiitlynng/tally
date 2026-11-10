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
      <div className="grid grid-cols-2 gap-2.75 pt-2.5">
        {OPTIONS.map((o) => (
          <Link
            key={o.title}
            to={o.to}
            className="group flex items-center gap-3 rounded-15 border border-line bg-surface p-4 transition-colors hover:border-hero-line hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark"
          >
            <span className="grid size-10.75 shrink-0 place-items-center rounded-13 bg-accent-tile">
              <Icon name={o.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-11 font-bold text-ink">{o.title}</span>
              <span className="block py-0.75 text-8 text-ink-muted">{o.description}</span>
            </span>
            <Icon name="chevron-right-card" size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  )
}
