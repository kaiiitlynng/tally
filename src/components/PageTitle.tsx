import type { ReactNode } from 'react'

interface PageTitleProps {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}

/** Eyebrow + H1 + description block at the top of every page (Figma 36:35). */
export function PageTitle({ eyebrow, title, description, actions }: PageTitleProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-9 font-semibold tracking-eyebrow text-eyebrow uppercase">{eyebrow}</p>
        <h1 className="pt-0.75 text-32 font-medium tracking-display text-ink">{title}</h1>
        <p className="pt-1.75 text-13 text-ink-muted">{description}</p>
      </div>
      {actions}
    </div>
  )
}
