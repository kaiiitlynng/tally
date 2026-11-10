import type { ReactNode } from 'react'

/** Stripe Dashboard-style status badge: tinted fill, matching dark ink, leading status dot. */
const TONES = {
  accent: 'bg-accent-soft text-accent-ink',
  neutral: 'bg-neutral-soft text-ink-neutral',
  success: 'bg-success-pill text-success-ink',
  danger: 'bg-danger-soft text-danger-ink',
} as const

const SIZES = {
  /** Auto-width badge (Figma 36:197). */
  md: 'h-6 px-2',
} as const

export type PillTone = keyof typeof TONES

export function Pill({ tone, size = 'md', children }: { tone: PillTone; size?: keyof typeof SIZES; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-xs text-caption font-semibold whitespace-nowrap ${SIZES[size]} ${TONES[tone]}`}>
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
      {children}
    </span>
  )
}
