import { onTabListKeyDown } from './tabKeys'

/**
 * Segmented tablist (WAI-ARIA tabs, automatic activation; arrow keys via onTabListKeyDown).
 * Pair with a role="tabpanel" whose id is `${idPrefix}-panel`.
 */
export function SegmentedTabs<T extends string>({
  label,
  tabs,
  value,
  onChange,
  idPrefix,
  className = '',
}: {
  label: string
  tabs: readonly { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  idPrefix: string
  className?: string
}) {
  return (
    <div role="tablist" aria-label={label} onKeyDown={onTabListKeyDown} className={`inline-flex gap-0.75 rounded-sm bg-surface-muted p-0.75 ring-1 ring-line ${className}`}>
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          id={`${idPrefix}-tab-${t.id}`}
          aria-selected={value === t.id}
          aria-controls={`${idPrefix}-panel`}
          tabIndex={value === t.id ? 0 : -1}
          onClick={() => onChange(t.id)}
          className={`h-8 rounded-xs px-3 text-small font-medium transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-accent ${
            value === t.id ? 'bg-white font-semibold text-brand shadow-segment' : 'text-ink-tab hover:text-ink'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/** "Current Projects" / "Past Projects" (Figma 36:11817 / 36:12137), shared by My Projects and Clients & Projects. */
export const PROJECT_TABS = [
  { id: 'current', label: 'Current projects' },
  { id: 'past', label: 'Past projects' },
] as const
