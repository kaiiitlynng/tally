import { useDemo } from './DemoContext'
import { firm, partner } from '../data/store'

const billingMonth = 'May 2025'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark'

/** Sticky top bar (Figma 36:12). */
export function Header() {
  const { reset } = useDemo()

  return (
    <header className="sticky top-0 z-10 flex h-header items-center justify-between border-b border-line-header bg-header px-7.5 backdrop-blur-header">
      <div className="flex items-center gap-2">
        <span className="text-12 font-semibold text-ink">{firm}</span>
        <span className="text-14 text-ink-divider" aria-hidden="true">
          /
        </span>
        {/* No month-picker menu exists in Figma; rendered as a button with no menu yet. */}
        <button type="button" className={`rounded-10 text-12 text-ink-muted hover:text-ink ${FOCUS}`} aria-label={`Billing month: ${billingMonth}`}>
          {billingMonth} ⌄
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <div role="group" aria-label="View as" className="flex rounded-18 border border-line bg-segment p-0.75">
          <button
            type="button"
            aria-pressed="true"
            className={`h-6.5 rounded-14 bg-white px-2.5 text-9 text-ink drop-shadow-segment ${FOCUS}`}
          >
            View as Partner
          </button>
          {/* Employee view is out of scope for this pass (Partner view first). */}
          <button
            type="button"
            aria-pressed="false"
            disabled
            title="Employee view coming soon"
            className={`h-6.5 rounded-14 px-2.5 text-9 text-ink-segment disabled:cursor-not-allowed ${FOCUS}`}
          >
            View as Employee
          </button>
        </div>
        <button
          type="button"
          onClick={reset}
          className={`rounded-16 border border-line px-2.5 py-1.75 text-9 text-ink-subtle transition-colors hover:bg-segment ${FOCUS}`}
        >
          Reset demo
        </button>
        <button
          type="button"
          aria-label={`Account: ${partner.name}`}
          className={`grid size-7.75 place-items-center rounded-full text-10 font-semibold text-avatar-ink hover:bg-segment ${FOCUS}`}
        >
          {partner.initials}
        </button>
      </div>
    </header>
  )
}
