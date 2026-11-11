import { useEffect, useId, useRef, useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { allFlags, initials, type Flag } from '../../data/store'
import { dayText, flagCopy, type FlagAction } from './flagCopy'
import { TallyReasoning } from './TallyReasoning'

const BUTTON =
  'flex h-10 w-full items-center justify-center rounded-sm border px-3 text-small font-semibold active:scale-[0.98] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const PRIMARY = `${BUTTON} border-brand bg-brand text-white shadow-card hover:border-brand-hover hover:bg-brand-hover`
const SECONDARY = `${BUTTON} border-line-field bg-white text-ink shadow-card hover:bg-hover`

interface ReviewPanelProps {
  projectId: string
  flags: Flag[]
  approved: boolean
  sent: boolean
  onKeep: () => void
  onSend: () => void
  onExport: () => void
  onAccept: () => void
  onEdit: () => void
  onAsk: () => void
  onDismiss: () => void
  onApprove: () => void
}

/** "More options" disclosure: a button that reveals a short list of buttons. Esc or an outside click closes it. */
function MoreOptions({ items, run }: { items: { label: string; action: FlagAction }[]; run: (a: FlagAction) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listId = useId()
  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      ref.current?.querySelector<HTMLButtonElement>('button')?.focus()
    }
    document.addEventListener('mousedown', out)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', out)
      document.removeEventListener('keydown', esc)
    }
  }, [open])
  if (!items.length) return null

  return (
    <div ref={ref} className="flex flex-col items-center">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-small font-medium text-ink-muted transition-colors hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        More options
        <Icon name="chevron-down" width={10} height={6} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul id={listId} className="mt-1 w-full animate-pop rounded-md border border-line bg-menu p-1 shadow-menu">
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  run(item.action)
                }}
                className="flex h-9 w-full items-center rounded-sm px-2.5 text-left text-small text-ink hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * "Review with Tally" side panel (Figma 36:6576; empty/waiting states from the prototype code layer).
 * Simplified for non-technical reviewers (owner request 2026-11-10): one plain question per flag, the entry,
 * one sentence of why, before → after numbers, then two equal choices and a "More options" menu. Orange is
 * reserved for the primary button and the progress bar. All copy comes from flagCopy.ts.
 */
export function ReviewPanel({ projectId, flags, approved, sent, onKeep, onSend, onExport, onAccept, onEdit, onAsk, onDismiss, onApprove }: ReviewPanelProps) {
  const { store } = useDemo()
  const flag = flags[0]
  const entry = flag && store.entries.find((e) => e.id === flag.entryId)
  const total = allFlags(store).filter((f) => store.entries.find((e) => e.id === f.entryId)?.projectId === projectId).length
  const done = total - flags.length
  const remaining = flags.length - 1
  const first = entry?.employee.split(' ')[0]
  const reply =
    flag &&
    store.messages
      .find((m) => m.entryId === flag.entryId)
      ?.replies.filter((r) => r.from === entry?.employee)
      .at(-1)
  const copy = flag && entry ? flagCopy(store, flag, entry) : undefined
  const handlers: Record<FlagAction, () => void> = { accept: onAccept, dismiss: onDismiss, keep: onKeep, edit: onEdit, ask: onAsk }

  return (
    <aside aria-labelledby="review-panel-title" className="flex flex-col overflow-hidden border-l border-panel-line bg-panel">
      <div className="border-b border-line p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="review-panel-title" className="text-lead font-semibold text-ink">
            Review with Tally
          </h2>
          {flags.length > 0 && (
            <span className="text-caption text-ink-muted tabular-nums" aria-live="polite">
              {done + 1} of {total}
            </span>
          )}
        </div>
        {total > 0 && (
          <>
            <div className="mt-2.5 flex gap-1" aria-hidden="true">
              {Array.from({ length: total }, (_, i) => (
                <i key={i} className={`h-1 flex-1 rounded-full ${i <= done && flags.length ? 'bg-brand' : !flags.length ? 'bg-brand' : 'bg-step-track'}`} />
              ))}
            </div>
            {remaining > 0 && <p className="pt-1.5 text-right text-caption text-ink-muted">{remaining} more to review</p>}
          </>
        )}
      </div>

      {/* The decision, then "Tally's reasoning" at the foot; opening it lengthens the page. */}
      <div className="flex flex-1 flex-col">
        {flag && entry && copy ? (
          <div className="flex flex-col gap-4 p-4">
            <h3 className="text-title-sm font-semibold tracking-flag text-ink">{copy.question}</h3>

            <div className="rounded-md border border-line bg-surface-muted p-3">
              <p className="text-caption text-ink-muted">
                {entry.employee} · {dayText(entry.date)}
              </p>
              <p className="pt-1 text-small text-ink">“{entry.description}”</p>
            </div>

            <p className="text-small leading-flag text-ink">{copy.explanation}</p>

            {copy.rows.length > 0 && (
              <dl className="rounded-md border border-line bg-white px-3 py-1">
                {copy.rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 border-b border-line-row py-2 last:border-b-0">
                    <dt className="text-caption text-ink-muted">{row.label}</dt>
                    <dd className="flex items-baseline gap-2 text-small tabular-nums">
                      {row.after !== undefined ? (
                        <>
                          <span className="text-ink-muted">{row.before}</span>
                          <span aria-hidden="true" className="text-ink-muted">
                            →
                          </span>
                          <span className="sr-only">changes to</span>
                          <b className="font-semibold text-ink">{row.after}</b>
                        </>
                      ) : (
                        <b className="font-semibold text-ink">{row.before}</b>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {reply && (
              <div className="flex gap-2 rounded-md bg-bubble p-3">
                <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-segment text-caption font-semibold text-ink">
                  {initials(reply.from)}
                </span>
                <p className="text-small text-ink">
                  <span className="sr-only">{first} replied: </span>
                  {reply.body}
                </p>
              </div>
            )}

            {flag.status === 'Awaiting employee' ? (
              <div role="status" className="rounded-md border border-line bg-surface-muted p-3">
                <b className="block text-small font-semibold text-ink">Waiting on {first}</b>
                <p className="pt-0.5 text-caption text-ink-muted">The question is in Messages.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button type="button" onClick={handlers[copy.primary.action]} className={PRIMARY}>
                  {copy.primary.label}
                </button>
                <button type="button" onClick={handlers[copy.secondary.action]} className={SECONDARY}>
                  {copy.secondary.label}
                </button>
                <MoreOptions items={copy.more} run={(a) => handlers[a]()} />
              </div>
            )}
          </div>
        ) : (
          <div className="m-auto p-7.5 text-center" role="status">
            <span className="mx-auto grid place-items-center">
              <Icon name="check-done" size={25} />
            </span>
            <h3 className="mt-3.5 mb-1.25 text-title-sm font-semibold tracking-title text-ink">
              {sent ? 'Invoice sent' : approved ? 'Invoice approved' : 'All questions resolved'}
            </h3>
            {(sent || !approved) && <p className="mb-3.75 text-small leading-normal text-ink-muted">{sent ? 'Demo only: no email was sent.' : 'Ready for your approval.'}</p>}
            {!approved && <DarkButton onClick={onApprove}>Approve invoice</DarkButton>}
            {approved && (
              <div className={`flex justify-center gap-2 ${sent ? '' : 'mt-2.5'}`}>
                {!sent && <DarkButton onClick={onSend}>Send to client</DarkButton>}
                <OutlineButton onClick={onExport}>Export PDF</OutlineButton>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto">
          <TallyReasoning projectId={projectId} />
        </div>
      </div>
    </aside>
  )
}
