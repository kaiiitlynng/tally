import { NavLink } from 'react-router'
import { useDemo } from './DemoContext'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { StepMarker } from './StepMarker'
import { invoicesNeedingReview, isUnread } from '../data/store'
import { WORKFLOW } from '../data/workflow'

interface NavItem {
  to: string
  label: string
  /** Icon file, rendered as a CSS mask so it inherits the link color. */
  icon: string
}

type Counts = Record<string, { n: number; sr: string }>

const HOME: NavItem = { to: '/', label: 'Home', icon: 'nav-home' }

const WORKSPACE: NavItem[] = [
  { to: '/messages', label: 'Messages', icon: 'nav-messages' },
  { to: '/team', label: 'Manage Team', icon: 'nav-team-reminders' },
  { to: '/settings', label: 'Settings', icon: 'nav-settings' },
]

// Employee nav (Figma 36:11564) reuses the partner icons; it has no billing workflow.
const EMPLOYEE_BILLING: NavItem[] = [
  HOME,
  { to: '/projects', label: 'My Projects', icon: 'nav-clients-projects' },
  { to: '/time', label: 'My Time', icon: 'nav-time-entries' },
]

const LINK = 'group relative flex h-10 items-center gap-3 rounded-sm px-3 text-body whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const linkTone = (isActive: boolean) => (isActive ? 'bg-hover font-semibold text-brand' : 'font-medium text-ink-nav hover:bg-hover hover:text-ink')

function ActiveBar() {
  return <span aria-hidden="true" className="absolute inset-y-2 -left-4 w-0.75 animate-fade rounded-r-xs bg-brand" />
}

function CountBadge({ count }: { count?: { n: number; sr: string } }) {
  if (!count?.n) return null
  // Count badge: prototype code layer (.nav-item em), in the notification color; #533afd on #e8e9ff is 5.17:1.
  return (
    <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-pill bg-notify px-1.5 text-caption font-semibold text-notify-ink tabular-nums">
      {count.n}
      <span className="sr-only"> {count.sr}</span>
    </span>
  )
}

function NavItemLink({ item, counts }: { item: NavItem; counts: Counts }) {
  return (
    <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => `${LINK} ${linkTone(isActive)}`}>
      {({ isActive }) => (
        <>
          {isActive && <ActiveBar />}
          {/* Mask, not <img>: the icon takes the link's text color (brand when active). */}
          <Icon tint name={item.icon} size={18} className="transition-transform duration-150 ease-stripe group-hover:scale-110 motion-reduce:transition-none" />
          {item.label}
          <CountBadge count={counts[item.to]} />
        </>
      )}
    </NavLink>
  )
}

function GroupLabel({ children, aside }: { children: string; aside?: string }) {
  return (
    <p className="flex items-baseline justify-between px-3 text-caption font-semibold tracking-group text-ink-label uppercase">
      {children}
      {aside && <span className="font-medium tracking-normal normal-case">{aside}</span>}
    </p>
  )
}

function NavGroup({ label, items, counts }: { label: string; items: NavItem[]; counts: Counts }) {
  return (
    <>
      <GroupLabel>{label}</GroupLabel>
      <ul className="flex flex-col gap-0.5 pt-2">
        {items.map((item) => (
          <li key={item.to}>
            <NavItemLink item={item} counts={counts} />
          </li>
        ))}
      </ul>
    </>
  )
}

/**
 * Partner Billing group as a vertical stepper: one row per step of the Home workflow tracker, each linking to
 * the page that does that step.
 */
function BillingWorkflow({ counts }: { counts: Counts }) {
  return (
    <>
      <GroupLabel>Billing</GroupLabel>
      <ol className="relative flex flex-col gap-0.5 pt-2">
        {/* One uniform rail through the step dots; no step is marked as current. */}
        <li aria-hidden="true" className="absolute top-7 bottom-5 left-6 w-0.5 -translate-x-1/2 rounded-pill bg-brand" />
        {WORKFLOW.map((step, i) => (
          <li key={step.id}>
            <NavLink to={step.page.to} className={({ isActive }) => `${LINK} ${linkTone(isActive)}`}>
              {({ isActive }) => (
                <>
                  {isActive && <ActiveBar />}
                  <StepMarker />
                  {step.page.label}
                  <span className="sr-only">{`, step ${i + 1} of ${WORKFLOW.length}`}</span>
                  <CountBadge count={counts[step.page.to]} />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ol>
    </>
  )
}

/** Left navigation rail (Figma 36:289). */
export function Sidebar() {
  const { role, me, store } = useDemo()
  const unread = store.messages.filter((m) => isUnread(m, me.name, role)).length
  const counts = {
    '/messages': { n: unread, sr: 'unread' },
    ...(role === 'partner' && { '/review': { n: invoicesNeedingReview(store), sr: 'invoices to review' } }),
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-sidebar flex-col overflow-y-auto border-r border-line-sidebar bg-sidebar px-4 pt-5 pb-4">
      <Logo />
      <nav aria-label="Main">
        {role === 'partner' ? (
          <>
            <NavItemLink item={HOME} counts={counts} />
            <div className="pt-5">
              <BillingWorkflow counts={counts} />
            </div>
          </>
        ) : (
          <NavGroup label="Billing" items={EMPLOYEE_BILLING} counts={counts} />
        )}
        <div className="px-3 pt-4" aria-hidden="true">
          <div className="h-px bg-line" />
        </div>
        <div className="pt-4">
          <NavGroup label="Workspace" items={role === 'partner' ? WORKSPACE : [WORKSPACE[0], WORKSPACE[2]]} counts={counts} />
        </div>
      </nav>

      <div className="mt-auto">
        <div className="flex items-center gap-2.5 border-t border-line px-1 pt-4">
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
