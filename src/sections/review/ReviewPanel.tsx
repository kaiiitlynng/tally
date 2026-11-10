import type { ReactNode } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { Pill } from '../../components/Pill'
import { money, type Flag } from '../../data/store'
import { TieOutCard } from './TieOutCard'

const ACTION =
  'flex h-10 items-center justify-center gap-1.5 rounded-sm border px-2 text-small font-semibold whitespace-nowrap active:scale-[0.98] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-md bg-note p-3">
      <b className="block text-caption font-semibold text-ink">{title}</b>
      <p className="py-1 text-small leading-flag text-ink-neutral">{children}</p>
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

/** "Review with Tally" side panel (Figma 36:6576); empty/waiting states from the prototype code layer. */
export function ReviewPanel({ projectId, flags, approved, sent, onKeep, onSend, onExport, onAccept, onEdit, onAsk, onDismiss, onApprove }: ReviewPanelProps) {
  const { store } = useDemo()
  const flag = flags[0]

  return (
    <aside aria-labelledby="review-panel-title" className="flex flex-col overflow-hidden border-l border-panel-line bg-panel">
      <TieOutCard projectId={projectId} />
      <div className="flex items-center border-b border-line p-4">
        <div>
          <h2 id="review-panel-title" className="font-semibold text-lead text-ink">
            Review with Tally
          </h2>
          <p className="py-0.75 text-caption text-ink-muted" aria-live="polite">
            {flags.length} item{flags.length === 1 ? '' : 's'} need attention
          </p>
        </div>
      </div>

      {flag ? (
        <div className="p-4.5">
          <div className="flex items-center justify-between">
            <Pill tone={flag.status === 'Response received' ? 'success' : 'accent'}>{flag.status}</Pill>
            <span className="text-caption text-flag-type">{flag.type}</span>
          </div>
          <h3 className="pt-3.5 text-title-sm font-semibold tracking-flag text-ink">{flag.title}</h3>
          <div className="flex flex-col gap-2.25 pt-3.5">
            <Note title="What Tally noticed">{flag.noticed}</Note>
            <Note title="Why it matters">{flag.why}</Note>
            <div className="rounded-md border border-suggest-line bg-suggest p-3">
              <p className="text-caption text-suggest-label">SUGGESTED NEXT STEP</p>
              <p className="pt-1 text-small leading-flag text-ink-neutral">{flag.suggestion}</p>
              {flag.impact !== 0 && (
                <b className="block pt-2 text-body font-semibold text-impact">
                  {flag.impact > 0 ? '+' : '−'}
                  {money(Math.abs(flag.impact))} invoice impact
                </b>
              )}
            </div>
          </div>

          {flag.status === 'Awaiting employee' ? (
            <div className="mt-3.5 flex items-center gap-2.25 rounded-md bg-waiting p-3 text-waiting-ink">
              <Icon name="clock-waiting" size={18} />
              <div>
                <b className="block text-small font-semibold">Waiting on employee</b>
                <p className="pt-0.75 text-caption">The linked request is in Messages.</p>
              </div>
            </div>
          ) : flag.kind === 'daily' ? (
            <div className="grid grid-cols-2 gap-2 pt-4">
              <button type="button" onClick={onKeep} className={`${ACTION} col-span-2 border-dark bg-dark text-white shadow-card hover:border-brand-hover hover:bg-brand-hover`}>
                Keep as is (add note)
              </button>
              <button type="button" onClick={onEdit} className={`${ACTION} border-line bg-white text-ink hover:border-brand-200 hover:bg-brand-25 hover:text-brand`}>
                <Icon name="edit" size={18} /> Edit hours
              </button>
              <button type="button" onClick={onAsk} className={`${ACTION} border-line bg-white text-ink hover:border-brand-200 hover:bg-brand-25 hover:text-brand`}>
                <Icon name="message" size={18} /> Ask employee
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-4">
              <button type="button" onClick={onAccept} className={`${ACTION} col-span-2 border-dark bg-dark text-white shadow-card hover:border-brand-hover hover:bg-brand-hover`}>
                <Icon name="check-white" size={18} /> Accept suggestion
              </button>
              <button type="button" onClick={onEdit} className={`${ACTION} border-line bg-white text-ink hover:border-brand-200 hover:bg-brand-25 hover:text-brand`}>
                <Icon name="edit" size={18} /> Edit directly
              </button>
              <button type="button" onClick={onAsk} className={`${ACTION} border-line bg-white text-ink hover:border-brand-200 hover:bg-brand-25 hover:text-brand`}>
                <Icon name="message" size={18} /> Ask employee
              </button>
              <button type="button" onClick={onDismiss} className={`${ACTION} col-span-2 border-line bg-white text-ink hover:border-brand-200 hover:bg-brand-25 hover:text-brand`}>
                Dismiss flag
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="m-auto p-7.5 text-center" role="status">
          <span className="mx-auto grid size-13.75 place-items-center rounded-full bg-success-pill">
            <Icon name="check-done" size={25} />
          </span>
          <h3 className="font-semibold mt-3.5 mb-1.25 text-title-sm tracking-title text-ink">{sent ? 'Invoice sent' : approved ? 'Invoice approved' : 'All questions resolved'}</h3>
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

      <details className="group mt-auto border-t border-line p-3.5">
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
    </aside>
  )
}
