import { useEffect, useRef, useState } from 'react'
import { useDemo } from './DemoContext'
import { monthNames, periodLabel } from '../data/store'

/** "May 2025 Entries ⌄" billing-month picker for My Time (prototype code layer; not drawn in Figma). */
export function MonthPicker() {
  const { period, setPeriod } = useDemo()
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(period.year)
  const ref = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    selectedRef.current?.focus()
    const dismiss = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', dismiss)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', dismiss)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const yearBtn = 'grid size-7.5 place-items-center rounded-sm border border-line bg-white text-title-sm text-ink hover:bg-segment focus-visible:outline-2 focus-visible:outline-accent'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setViewYear(period.year)
          setOpen((o) => !o)
        }}
        className="rounded-md text-body text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {periodLabel(period)} Entries ⌄
      </button>
      {open && (
        <div role="dialog" aria-label="Choose billing month" className="absolute top-full left-0 z-40 mt-2.5 w-65 rounded-lg border border-line-step bg-modal p-3.25 shadow-popover animate-pop">
          <div className="mb-2.5 grid grid-cols-[32px_1fr_32px] items-center">
            <button type="button" aria-label="Previous year" onClick={() => setViewYear((y) => y - 1)} className={yearBtn}>
              ‹
            </button>
            <b className="text-center text-body">{viewYear}</b>
            <button type="button" aria-label="Next year" onClick={() => setViewYear((y) => y + 1)} className={yearBtn}>
              ›
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.25">
            {monthNames.map((m, i) => {
              const selected = period.year === viewYear && period.month === i + 1
              return (
                <button
                  key={m}
                  ref={selected ? selectedRef : undefined}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setPeriod({ year: viewYear, month: i + 1 })
                    setOpen(false)
                  }}
                  className={`h-8 rounded-sm text-small focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-success-line ${
                    selected ? 'bg-success-soft font-semibold text-success-ink' : 'text-ink-nav hover:bg-segment'
                  }`}
                >
                  {m.slice(0, 3)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
