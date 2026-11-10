import { NavLink } from 'react-router'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { partner } from '../data/store'

interface NavItem {
  to: string
  label: string
  /** Inactive icon (stroke #6F6B64). */
  icon: string
  /** White icon used on the dark active pill, exported from the frame where that item is active. */
  activeIcon: string
}

const BILLING: NavItem[] = [
  { to: '/', label: 'Home', icon: 'nav-home', activeIcon: 'nav-home-active' },
  { to: '/clients', label: 'Clients & Projects', icon: 'nav-clients-projects', activeIcon: 'nav-clients-projects-active' },
  { to: '/time', label: 'Time Entries', icon: 'nav-time-entries', activeIcon: 'nav-time-entries-active' },
  { to: '/review', label: 'Review Invoices', icon: 'nav-review-invoices', activeIcon: 'nav-review-invoices-active' },
  { to: '/invoices', label: 'Invoices', icon: 'nav-invoices', activeIcon: 'nav-invoices-active' },
]

const WORKSPACE: NavItem[] = [
  { to: '/messages', label: 'Messages', icon: 'nav-messages', activeIcon: 'nav-messages-active' },
  { to: '/team', label: 'Team & Reminders', icon: 'nav-team-reminders', activeIcon: 'nav-team-reminders-active' },
  { to: '/settings', label: 'Settings', icon: 'nav-settings', activeIcon: 'nav-settings-active' },
]

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <>
      <p className="px-3 text-10 tracking-group text-ink-label uppercase">{label}</p>
      <ul className="flex flex-col gap-0.5 pt-2">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex w-48 items-center gap-2.75 rounded-10 px-3 py-2.5 text-13 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark ${
                  isActive ? 'bg-dark text-white' : 'text-ink-nav hover:bg-segment hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={isActive ? item.activeIcon : item.icon} size={18} />
                  {item.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  )
}

/** Left navigation rail (Figma 36:289). */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-sidebar flex-col overflow-y-auto border-r border-line-sidebar bg-sidebar px-4 pt-6.5 pb-4.5 backdrop-blur-sidebar">
      <Logo />
      <nav aria-label="Main">
        <NavGroup label="Billing" items={BILLING} />
        <div className="px-2.75 pt-3.5" aria-hidden="true">
          <div className="h-px bg-line" />
        </div>
        <div className="pt-3.5">
          <NavGroup label="Workspace" items={WORKSPACE} />
        </div>
      </nav>

      <div className="mt-auto">
        <div className="flex items-start gap-2.25 rounded-12 bg-surface-muted p-3">
          <span className="mt-1 size-1.75 shrink-0 rounded-full bg-success-dot ring-4 ring-success-ring" aria-hidden="true" />
          <div>
            <p className="text-10 font-bold text-ink">Interactive prototype</p>
            <p className="py-0.5 text-8 text-ink-muted">Synthetic data · no emails sent</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2.25 border-t border-line px-1 pt-4">
          <span className="grid size-7.75 shrink-0 place-items-center rounded-full bg-avatar text-10 font-semibold text-avatar-ink">
            {partner.initials}
          </span>
          <div>
            <p className="text-11 font-bold text-ink">{partner.name}</p>
            <p className="py-px text-9 text-ink-muted">{partner.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
