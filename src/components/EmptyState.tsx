import type { ReactNode } from 'react'
import { Icon } from './Icon'

/**
 * Centered empty state (Figma 36:7156 / 36:7453). Figma renders the icon flush-left, an export
 * artifact of the prototype's text-align:center; it is centered here.
 */
export function EmptyState({ icon, iconSize, title, children, size = 'lg' }: { icon: string; iconSize: number; title: string; children?: ReactNode; size?: 'sm' | 'lg' }) {
  return (
    <div className="flex flex-col items-center px-6.25 py-17.5 text-center text-ink-empty">
      <Icon name={icon} size={iconSize} />
      {size === 'lg' ? <h2 className="text-14">{title}</h2> : <b className="pt-2.25 text-8 font-bold">{title}</b>}
      {children && <p className={`text-8 ${size === 'sm' ? 'text-ink-muted' : ''}`}>{children}</p>}
    </div>
  )
}
