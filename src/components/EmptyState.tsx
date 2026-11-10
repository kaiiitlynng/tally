import type { ReactNode } from 'react'
import { Icon } from './Icon'

/**
 * Centered empty state (Figma 36:7156 / 36:7453). Figma renders the icon flush-left, an export
 * artifact of the prototype's text-align:center; it is centered here.
 */
export function EmptyState({ icon, iconSize, title, children, size = 'lg' }: { icon: string; iconSize: number; title: string; children?: ReactNode; size?: 'sm' | 'lg' }) {
  return (
    <div className="flex flex-col items-center px-6.25 py-17.5 text-center text-ink-empty">
      <span className="mb-4 grid size-14 place-items-center rounded-lg bg-brand-50">
        <Icon name={icon} size={iconSize} />
      </span>
      {size === 'lg' ? <h2 className="text-lead font-semibold text-ink">{title}</h2> : <b className="text-body font-semibold text-ink">{title}</b>}
      {children && <p className="max-w-90 pt-1 text-small text-ink-muted">{children}</p>}
    </div>
  )
}
