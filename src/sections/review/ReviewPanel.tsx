import type { ReactNode } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { Pill, type PillTone } from '../../components/Pill'
import { allFlags, initials, money, shortDate, type Flag, type FlagStatus } from '../../data/store'
import { TieOutCard } from './TieOutCard'

const ACTION =
  'flex h-10 items-center justify-center gap-1.5 rounded-sm border px-2 text-small font-semibold whitespace-nowrap active:scale-[0.98] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const PRIMARY = `${ACTION} col-span-2 border-dark bg-dark text-white shadow-card hover:border-brand-hover hover:bg-brand-hover`
const SECONDARY = `${ACTION} border-line bg-white text-ink hover:border-brand-200 hover:bg-hover hover:text-brand`

const STATUS_TONE: Record<FlagStatus, PillTone> = {
  Open: 'accent',
  'Awaiting employee': 'neutral',
  'Response received': 'success',
  Resolved: 'success',
  Dismissed: 'neutral',
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-caption font-semibold text-ink-muted">{label}</p>
      <div className="pt-1">{children}</div>
    </div>
  )
}

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

/**
 * "Review with Tally" side panel (Figma 36:6576); empty/waiting states from the prototype code layer.
 * Laid out for one decision at a time (owner request 2026-11-10): progress through the questions, the invoice
 * line in question (same highlight as on the invoice), what Tally noticed, the proposed change as before → after
 * with its dollar impact, the employee's latest reply, then one primary action, secondary actions and a quiet
 * dismiss. Tie-out and activity sit at the bottom, collapsed.
 */
export function ReviewPanel({ projectId, flags, approved, sent, onKeep, onSend, onExport, onAccept, onEdit, onAsk, onDismiss, onApprove }: ReviewPanelProps) {
  const { store } = useDemo()
  const flag = flags[0]
  const entry = flag && store.entries.find((e) => e.id === flag.entryId)
  const total = allFlags(store).filter((f) => store.entries.find((e) => e.id === f.entryId)?.projectId === projectId).length
  const done = total - flags.length
  const first = entry?.employee.split(' ')[0]
  const reply = flag && store.messages.find((m) => m.entryId === flag.entryId)?.replies.filter((r) => r.from === entry?.employee).at(-1)

  return (
    <aside aria-labelledby="review-panel-title" className="flex flex-col overflow-hidden border-l border-panel-line bg-panel">
      <div className="border-b border-line p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="review-panel-title" className="text-lead font-semibold text-ink">
            Review with Tally
          </h2>
          {total > 0 && (
            <span className="text-caption text-ink-muted tabular-nums" aria-live="polite">
              {flags.length ? `Question ${done + 1} of ${total}` : `All ${total} resolved`}
            </span>
          )}
        </div>
        {total > 0 && (
          <div className="mt-2.5 flex gap-1" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <i key={i} className={`h-1 flex-1 rounded-full ${i < done ? 'bg-step-done-ink' : i === done ? 'bg-brand' : 'bg-step-track'}`} />
            ))}
          </div>
        )}
      </div>

      {flag && entry ? (
        <div className="flex flex-col gap-4 p-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-caption font-semibold text-flag-type">{flag.type}</span>
              <Pill tone={STATUS_TONE[flag.status]}>{flag.status}</Pill>
            </div>
            <h3 className="pt-1.5 text-title-sm font-semibold tracking-flag text-ink">{flag.title}</h3>
          </div>

          {/* Same yellow as the highlighted line on the invoice, so the two read as one thing. */}
          <Section label="Invoice line">
            <div className="rounded-md border border-highlight-line bg-highlight p-3">
              <div className="flex items-center justify-between gap-2 text-caption text-ink-muted">
                <span>
                  {shortDate(entry.date)} · {entry.employee}
                </span>
                <b className="text-small font-semibold text-ink tabular-nums">{entry.hours.toFixed(1)} h</b>
              </div>
              <p className="pt-1 text-small text-ink">“{entry.description}”</p>
            </div>
          </Section>

          <Section label="What Tally noticed">
            <p className="text-small leading-flag text-ink">{flag.noticed}</p>
            <p className="pt-1 text-small leading-flag text-ink-muted">{flag.why}</p>
          </Section>

          <Section label="Suggested change">
            <div className="rounded-md border border-line bg-surface-muted p-3">
              {flag.change ? (
                <p className="flex items-center gap-2 text-small">
                  <span className="text-caption text-ink-muted">{flag.change.field}</span>
                  <s className="text-ink-muted tabular-nums">{flag.change.from}</s>
                  <span aria-hidden="true" className="text-ink-muted">
                    →
                  </span>
                  <b className="text-lead font-semibold text-ink tabular-nums">{flag.change.to}</b>
                  <span className="sr-only">
                    , change {flag.change.field.toLowerCase()} from {flag.change.from} to {flag.change.to}
                  </span>
                </p>
              ) : (
                <p className="text-small leading-flag text-ink">{flag.suggestion}</p>
              )}
              {flag.impact !== 0 && (
                <p className="mt-2 flex items-center justify-between border-t border-line-row pt-2 text-caption text-ink-muted">
                  Invoice impact
                  <b className="text-small font-semibold text-ink tabular-nums">
                    {flag.impact > 0 ? '+' : '−'}
                    {money(Math.abs(flag.impact))}
                  </b>
                </p>
              )}
            </div>
          </Section>

          {reply && (
            <Section label={`${first} replied`}>
              <div className="flex gap-2 rounded-md bg-bubble p-3">
                <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-avatar text-caption font-semibold text-avatar-ink">
                  {initials(reply.from)}
                </span>
                <p className="text-small text-ink">{reply.body}</p>
              </div>
            </Section>
          )}

          {flag.status === 'Awaiting employee' ? (
            <div role="status" className="rounded-md border border-line bg-surface-muted p-3">
              <b className="block text-small font-semibold text-ink">Waiting on {first}</b>
              <p className="pt-0.5 text-caption text-ink-muted">The linked request is in Messages.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {flag.kind === 'daily' ? (
                <button type="button" onClick={onKeep} className={PRIMARY}>
                  Keep as is (add note)
                </button>
              ) : (
                <button type="button" onClick={onAccept} className={PRIMARY}>
                  <Icon name="check-white" size={18} /> Accept suggestion
                </button>
              )}
              <button type="button" onClick={onEdit} className={SECONDARY}>
                <Icon name="edit" size={18} /> {flag.kind === 'daily' ? 'Edit hours' : 'Edit directly'}
              </button>
              <button type="button" onClick={onAsk} className={SECONDARY}>
                <Icon name="message" size={18} /> Ask employee
              </button>
              {flag.kind !== 'daily' && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="col-span-2 h-8 rounded-sm text-small font-medium text-ink-muted transition-colors hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Dismiss flag
                </button>
              )}
            </div>
          )}

          {flags.length > 1 && (
            <Section label="Up next">
              <ul className="flex flex-col gap-1">
                {flags.slice(1).map((f) => (
                  <li key={f.id} className="truncate text-caption text-ink-muted">
                    {f.title}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      ) : (
        <div className="m-auto p-7.5 text-center" role="status">
          <span className="mx-auto grid place-items-center">
            <Icon name="check-done" size={25} />
          </span>
          <h3 className="mt-3.5 mb-1.25 text-title-sm font-semibold tracking-title text-ink">{sent ? 'Invoice sent' : approved ? 'Invoice approved' : 'All questions resolved'}</h3>
          <p className="mb-3.75 text-small leading-normal text-ink-muted">
            {sent
              ? 'A simulated send was recorded. No email was delivered.'
              : approved
                ? 'The approved invoice is available for preview and export.'
                : 'Tally recalculated the invoice. One final approval is all that remains.'}
          </p>
          {!approved && <DarkButton onClick={onApprove}>Approve Invoice</DarkButton>}
          {approved && (
            <div className="flex justify-center gap-2">
              {!sent && <DarkButton onClick={onSend}>Send to client</DarkButton>}
              <OutlineButton onClick={onExport}>Export PDF</OutlineButton>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto">
        <TieOutCard projectId={projectId} />
        <details className="group border-t border-line p-3.5">
          <summary className="cursor-pointer list-none text-caption text-hero-ink">
            <span className="inline-block w-2.75 transition-transform group-open:rotate-90" aria-hidden="true">
              ▸
            </span>
            View Tally activity
          </summary>
          {store.audit.slice(0, 5).map((line) => (
            <p key={line} className="flex items-center gap-1.5 pt-1 text-caption text-activity-ink">
              <Icon name="check-activity" size={13} />
              {line}
            </p>
          ))}
        </details>
      </div>
    </aside>
  )
}
