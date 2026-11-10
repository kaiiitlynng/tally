import { useLocation, useNavigate } from 'react-router'
import { useDemo } from './DemoContext'
import { MonthPicker } from './MonthPicker'
import { firm, periodLabel, currentPeriod, type Role } from '../data/store'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark'

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
    <header className="sticky top-0 z-10 flex h-header items-center justify-between border-b border-line-header bg-header px-7.5 backdrop-blur-header">
      <div className="flex items-center gap-2">
        <span className="text-12 font-semibold text-ink">{firm}</span>
        {crumb && (
          <span className="text-14 text-ink-divider" aria-hidden="true">
            /
          </span>
        )}
        {crumb === 'picker' && <MonthPicker />}
        {crumb === 'static' && (
          // The prototype renders this as an inert button too; there is no partner month menu.
          <button type="button" className={`rounded-10 text-12 text-ink-muted hover:text-ink ${FOCUS}`} aria-label={`Billing month: ${periodLabel(currentPeriod)}`}>
            {periodLabel(currentPeriod)} ⌄
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <div role="group" aria-label="View as" className="flex rounded-18 border border-line bg-segment p-0.75">
          {(['partner', 'employee'] as const).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => switchRole(r)}
              className={`h-6.5 rounded-14 px-2.5 text-9 ${FOCUS} ${role === r ? 'bg-white text-ink drop-shadow-segment' : 'text-ink-segment hover:text-ink'}`}
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
          className={`rounded-16 border border-line px-2.5 py-1.75 text-9 text-ink-subtle transition-colors hover:bg-segment ${FOCUS}`}
        >
          Reset demo
        </button>
        <button
          type="button"
          aria-label={`Account: ${me.name}`}
          className={`grid size-7.75 place-items-center rounded-full text-10 font-semibold text-avatar-ink hover:bg-segment ${FOCUS}`}
        >
          {me.initials}
        </button>
      </div>
    </header>
  )
}
