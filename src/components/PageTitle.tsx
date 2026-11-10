import type { ReactNode } from 'react'

interface PageTitleProps {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

/**
 * Eyebrow + H1 + description block at the top of every page (Figma 36:35).
 * stripe-design styling: brand-colored eyebrow, large tight headline with the description set as the
 * muted second half of the same statement (the reference hero's two-tone headline).
 * The uppercase, tracked eyebrow is kept (audit 001 #18): it names the billing context the page belongs to
 * ("MAY BILLING CYCLE", "ASSIGNED TO VANESSA"), information the H1 does not repeat.
 */
export function PageTitle({ eyebrow, title, description, actions }: PageTitleProps) {
  return (
    <div className="flex items-end justify-between gap-6 pb-2">
      <div className="min-w-0">
        {eyebrow && <p className="text-caption font-semibold tracking-eyebrow text-eyebrow uppercase">{eyebrow}</p>}
        <h1 className="pt-2 text-display font-semibold tracking-display text-ink">{title}</h1>
        <p className="max-w-160 pt-2 text-lead text-ink-muted">{description}</p>
      </div>
      {actions}
    </div>
  )
}
