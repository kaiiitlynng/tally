import type { ReactNode } from 'react'

interface PageTitleProps {
  title: string
  description?: string
  actions?: ReactNode
}

/**
 * H1 + description block at the top of every page (Figma 36:35).
 * stripe-design styling: large tight headline with the description set as the
 * muted second half of the same statement (the reference hero's two-tone headline).
 * The uppercase eyebrow above the H1 was removed at the owner's request (2026-11-10).
 */
export function PageTitle({ title, description, actions }: PageTitleProps) {
  return (
    <div className="flex items-end justify-between gap-6 pb-2">
      <div className="min-w-0">
        <h1 className="text-display font-semibold tracking-display text-ink">{title}</h1>
        {description && <p className="max-w-160 pt-2 text-lead text-ink-muted">{description}</p>}
      </div>
      {actions}
    </div>
  )
}
