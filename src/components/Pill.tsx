import type { ReactNode } from 'react'

const TONES = {
  accent: 'bg-accent-soft text-accent-ink',
  neutral: 'bg-neutral-soft text-ink-neutral',
  success: 'bg-success-pill text-success-ink',
  danger: 'bg-danger-soft text-danger-ink',
} as const

const SIZES = {
  /** 22px auto-width pill (Figma 36:197). */
  md: 'h-5.5 px-2.25',
  /** 26px fixed-width status block used in time tables (Figma 36:1409). */
  lg: 'h-6.5 w-30.5 justify-center px-2',
} as const

export type PillTone = keyof typeof TONES

export function Pill({ tone, size = 'md', children }: { tone: PillTone; size?: keyof typeof SIZES; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-12 text-8 font-semibold whitespace-nowrap ${SIZES[size]} ${TONES[tone]}`}>
      {children}
    </span>
  )
}
