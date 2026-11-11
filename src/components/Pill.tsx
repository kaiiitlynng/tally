import type { ReactNode } from 'react'
import { Icon } from './Icon'

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

/** `icon` replaces the status dot (tinted to the pill's text color), e.g. a warning on a problem status. */
export function Pill({ tone, size = 'md', icon, children }: { tone: PillTone; size?: keyof typeof SIZES; icon?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-xs text-caption font-semibold whitespace-nowrap ${SIZES[size]} ${TONES[tone]}`}>
      {icon ? <Icon tint name={icon} size={12} /> : <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  )
}
