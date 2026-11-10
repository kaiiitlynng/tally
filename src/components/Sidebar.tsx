import { NavLink } from 'react-router'
import { useDemo } from './DemoContext'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { invoicesNeedingReview, type Role } from '../data/store'

interface NavItem {
  to: string
  label: string
  /** Icon file, rendered as a CSS mask so it inherits the link color. */
  icon: string
}

const BILLING: NavItem[] = [
  { to: '/', label: 'Home', icon: 'nav-home' },
  { to: '/clients', label: 'Clients & Projects', icon: 'nav-clients-projects' },
  { to: '/time', label: 'Time Entries', icon: 'nav-time-entries' },
  { to: '/review', label: 'Ready for Review', icon: 'nav-review-invoices' },
  { to: '/invoices', label: 'Approved & Sent', icon: 'nav-invoices' },
]

const WORKSPACE: NavItem[] = [
  { to: '/messages', label: 'Messages', icon: 'nav-messages' },
  { to: '/team', label: 'Team & Reminders', icon: 'nav-team-reminders' },
  { to: '/settings', label: 'Settings', icon: 'nav-settings' },
]

const NAV: Record<Role, { billing: NavItem[]; workspace: NavItem[] }> = {
  partner: { billing: BILLING, workspace: WORKSPACE },
  // Employee nav (Figma 36:11564) reuses the partner icons.
  employee: {
    billing: [BILLING[0], { ...BILLING[1], to: '/projects', label: 'My Projects' }, { ...BILLING[2], label: 'My Time' }],
    workspace: [WORKSPACE[0]],
  },
}

function NavGroup({ label, items, counts }: { label: string; items: NavItem[]; counts: Record<string, { n: number; sr: string }> }) {
  return (
    <>
      <p className="px-3 text-caption font-semibold tracking-group text-ink-label uppercase">{label}</p>
      <ul className="flex flex-col gap-0.5 pt-2">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group relative flex h-10 items-center gap-3 rounded-sm px-3 text-body whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isActive ? 'bg-brand-50 font-semibold text-brand' : 'font-medium text-ink-nav hover:bg-brand-25 hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span aria-hidden="true" className="absolute inset-y-2 -left-4 w-0.75 animate-fade rounded-r-xs bg-brand" />}
                  {/* Mask, not <img>: the icon takes the link's text color (brand when active). */}
                  <Icon tint name={item.icon} size={18} className="transition-transform duration-150 ease-stripe group-hover:scale-110 motion-reduce:transition-none" />
                  {item.label}
                  {counts[item.to]?.n > 0 && (
                    // Count badge: prototype code layer (.nav-item em); white on #533afd is 6.6:1.
                    <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-pill bg-brand px-1.5 text-caption font-semibold text-white tabular-nums">
                      {counts[item.to].n}
                      <span className="sr-only"> {counts[item.to].sr}</span>
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
  const counts = {
    '/messages': { n: unread, sr: 'unread' },
    ...(role === 'partner' && { '/review': { n: invoicesNeedingReview(store), sr: 'invoices to review' } }),
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-sidebar flex-col overflow-y-auto border-r border-line-sidebar bg-sidebar px-4 pt-5 pb-4">
      <Logo />
      <nav aria-label="Main">
        <NavGroup label="Billing" items={nav.billing} counts={counts} />
        <div className="px-3 pt-4" aria-hidden="true">
          <div className="h-px bg-line" />
        </div>
        <div className="pt-4">
          <NavGroup label="Workspace" items={nav.workspace} counts={counts} />
        </div>
      </nav>

      <div className="mt-auto">
        <div className="relative overflow-hidden rounded-md border border-line bg-surface shadow-card-muted p-3 pt-4">
          {/* Thin Stripe ribbon along the top edge marks this as the demo, not product chrome. */}
          <span aria-hidden="true" className="ribbon absolute inset-x-0 top-0 h-1" />
          <p className="text-small font-semibold text-ink">Interactive prototype</p>
          <p className="pt-0.5 text-caption text-ink-muted">Synthetic data · no emails sent</p>
        </div>
        <div className="mt-3 flex items-center gap-2.5 border-t border-line px-1 pt-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-avatar text-caption font-semibold text-avatar-ink">
            {me.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-body font-semibold text-ink">{me.name}</p>
            <p className="truncate text-caption text-ink-muted">{me.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
