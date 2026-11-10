import { NavLink } from 'react-router'
import { useDemo } from './DemoContext'
import { Icon } from './Icon'
import { Logo } from './Logo'
import type { Role } from '../data/store'

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

const NAV: Record<Role, { billing: NavItem[]; workspace: NavItem[] }> = {
  partner: { billing: BILLING, workspace: WORKSPACE },
  // Employee nav (Figma 36:11564) reuses the partner icons.
  employee: {
    billing: [BILLING[0], { ...BILLING[1], to: '/projects', label: 'My Projects' }, { ...BILLING[2], label: 'My Time' }],
    workspace: [WORKSPACE[0]],
  },
}

function NavGroup({ label, items, unread }: { label: string; items: NavItem[]; unread: number }) {
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
                  {item.to === '/messages' && unread > 0 && (
                    // Unread badge: prototype code layer (.nav-item em); not drawn in Figma.
                    <span className="ml-auto grid h-5.25 min-w-5.25 place-items-center rounded-12 bg-orange px-1.5 text-11 text-white">
                      {unread}
                      <span className="sr-only"> unread</span>
                    </span>
                  )}
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
  const { role, me, store } = useDemo()
  const unread = store.messages.filter((m) => m.unreadBy.includes(role)).length
  const nav = NAV[role]

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-sidebar flex-col overflow-y-auto border-r border-line-sidebar bg-sidebar px-4 pt-6.5 pb-4.5 backdrop-blur-sidebar">
      <Logo />
      <nav aria-label="Main">
        <NavGroup label="Billing" items={nav.billing} unread={unread} />
        <div className="px-2.75 pt-3.5" aria-hidden="true">
          <div className="h-px bg-line" />
        </div>
        <div className="pt-3.5">
          <NavGroup label="Workspace" items={nav.workspace} unread={unread} />
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
            {me.initials}
          </span>
          <div>
            <p className="text-11 font-bold text-ink">{me.name}</p>
            <p className="py-px text-9 text-ink-muted">{me.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
