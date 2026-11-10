import { useLocation, useNavigate } from 'react-router'
import { useDemo } from './DemoContext'
import { MonthPicker } from './MonthPicker'
import { NotificationBell } from './NotificationBell'
import { firm, periodLabel, currentPeriod, type Role } from '../data/store'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** Sticky top bar (Figma 36:12 partner, 36:11420 employee). */
export function Header() {
  const { reset, role, setRole, me } = useDemo()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const switchRole = (next: Role) => {
    if (next === role) return
    setRole(next)
    navigate('/')
  }

  // Employee "My Projects" has no billing-month crumb; "My Time" gets the month picker (prototype Shell).
  const crumb = role === 'employee' && pathname === '/projects' ? null : role === 'employee' && pathname === '/time' ? 'picker' : 'static'

  return (
    <header className="sticky top-0 z-10 flex h-header items-center justify-between border-b border-line-header bg-header px-8">
      <div className="flex items-center gap-2">
        <span className="text-body font-semibold text-ink">{firm}</span>
        {crumb && (
          <span className="text-lead text-line" aria-hidden="true">
            /
          </span>
        )}
        {crumb === 'picker' && <MonthPicker />}
        {crumb === 'static' && (
          // The prototype renders this as an inert button too; there is no partner month menu.
          <button type="button" className={`rounded-sm px-2 py-1 text-body text-ink-muted transition-colors hover:bg-brand-25 hover:text-ink ${FOCUS}`} aria-label={`Billing month: ${periodLabel(currentPeriod)}`}>
            {periodLabel(currentPeriod)} ⌄
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <div role="group" aria-label="View as" className="flex rounded-sm bg-surface-muted p-0.75 ring-1 ring-line">
          {(['partner', 'employee'] as const).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => switchRole(r)}
              className={`h-8 rounded-xs px-3 text-small font-medium transition-[background-color,color,box-shadow] duration-150 ${FOCUS} ${role === r ? 'bg-white text-brand shadow-segment' : 'text-ink-segment hover:text-ink'}`}
            >
              {r === 'partner' ? 'View as Partner' : 'View as Employee'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            reset()
            navigate('/')
          }}
          className={`h-8 rounded-sm border border-line px-3 text-small font-medium text-ink-subtle transition-colors hover:border-brand-200 hover:bg-brand-25 hover:text-brand ${FOCUS}`}
        >
          Reset demo
        </button>
        {role === 'partner' && <NotificationBell />}
        <button
          type="button"
          aria-label={`Account: ${me.name}`}
          className={`grid size-8 place-items-center rounded-full bg-avatar text-caption font-semibold text-avatar-ink transition-shadow hover:ring-4 hover:ring-brand-50 ${FOCUS}`}
        >
          {me.initials}
        </button>
      </div>
    </header>
  )
}
