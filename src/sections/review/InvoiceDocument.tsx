import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDemo } from '../../components/DemoContext'
import { archivedInvoiceTotal, projectById, type ArchivedInvoice } from '../../data/history'
import {
  currentPeriod,
  formatHours,
  invoiceAdjustments,
  invoiceLines,
  invoiceTotal,
  isFinal,
  money,
  periodLabel,
  periodRange,
  snapshotForReview,
  sourceOf,
  type BillingPeriod,
  type Entry,
  type Project,
} from '../../data/store'

// Date / Employee / Description / Hours / Rate / Amount / actions (Figma 36:6486 + a 24px action column).
const LINE = 'grid grid-cols-[44px_84px_minmax(0,1fr)_40px_60px_76px_24px] items-center gap-2 px-2 py-2.5 whitespace-nowrap'
const INPUT = 'w-full rounded-sm border border-line-field bg-white px-1.5 py-1 text-caption text-ink focus:outline-2 focus:outline-accent'
const REASONS = ['Duplicate', 'Not billable to client', 'Wrong project', 'Other'] as const
const MENU_ITEM = 'block w-full rounded-sm px-2 py-1.5 text-left text-caption hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent'

function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && close()
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('mousedown', out)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', out)
      document.removeEventListener('keydown', esc)
    }
  }, [open, close])
  return ref
}

/** "Edited by VH" marker; hover or focus shows original vs new values (spec item 1). */
function EditedMarker({ entry }: { entry: Entry }) {
  const o = entry.review!.original
  const changes = [
    o.hours !== entry.hours && `Hours ${formatHours(o.hours)} → ${formatHours(entry.hours)}`,
    o.rate !== entry.rate && `Rate ${money(o.rate)} → ${money(entry.rate)}`,
    o.description !== entry.description && `Description “${o.description}” → “${entry.description}”`,
    o.noCharge !== Boolean(entry.noCharge) && (entry.noCharge ? 'Marked no charge' : 'Charged again'),
  ].filter(Boolean) as string[]
  const id = `edited-${entry.id}`
  return (
    <span className="group/edit relative ml-1 inline-block">
      <span tabIndex={0} aria-describedby={id} className="rounded-xs bg-chip px-1 text-caption text-chip-ink focus-visible:outline-2 focus-visible:outline-accent">
        Edited by {entry.review!.by}
      </span>
      <span
        role="tooltip"
        id={id}
        className="pointer-events-none absolute top-full left-0 z-20 mt-1 hidden w-max max-w-60 rounded-sm border border-line bg-menu p-2 text-caption leading-normal whitespace-normal text-ink shadow-menu animate-pop group-focus-within/edit:block group-hover/edit:block"
      >
        {changes.length ? changes.map((c) => <span key={c} className="block">{c}</span>) : 'No net change'}
      </span>
    </span>
  )
}

function LineActions({ entry, onEdit }: { entry: Entry; onEdit: () => void }) {
  const { update, me } = useDemo()
  const [open, setOpen] = useState<'menu' | 'delete' | null>(null)
  const [reason, setReason] = useState('')
  const [other, setOther] = useState('')
  const ref = useDismiss(open !== null, () => setOpen(null))
  const label = `${entry.date.slice(5)} ${entry.employee}`

  function toggleNoCharge() {
    update((s) => {
      const e = s.entries.find((x) => x.id === entry.id)!
      snapshotForReview(e, me.initials)
      e.noCharge = !e.noCharge
      s.audit.unshift(`${me.firstName} ${e.noCharge ? 'marked as no charge' : 'charged again'}: ${label}`)
    })
    setOpen(null)
  }

  function remove() {
    const why = reason === 'Other' ? `Other: ${other.trim()}` : reason
    update((s) => {
      const e = s.entries.find((x) => x.id === entry.id)!
      s.removedLines.push({ entry: structuredClone(e), reason: why, by: me.initials })
      s.entries = s.entries.filter((x) => x.id !== entry.id)
      s.audit.unshift(`${me.firstName} removed ${label} from the invoice (${why})`)
    })
  }

  const canDelete = reason && (reason !== 'Other' || other.trim())

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Actions for ${label} line`}
        aria-haspopup="menu"
        aria-expanded={open === 'menu'}
        onClick={() => setOpen(open ? null : 'menu')}
        className="size-6 rounded-sm text-caption font-semibold tracking-[1px] opacity-0 group-focus-within/line:opacity-100 group-hover/line:opacity-100 hover:bg-hover focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-accent aria-expanded:opacity-100"
      >
        •••
      </button>
      {open === 'menu' && (
        <div role="menu" className="absolute top-6 right-0 z-20 w-34 rounded-md border border-line bg-menu p-1 shadow-menu animate-pop">
          <button role="menuitem" type="button" className={MENU_ITEM} onClick={() => (setOpen(null), onEdit())}>
            Edit
          </button>
          <button role="menuitem" type="button" className={MENU_ITEM} onClick={toggleNoCharge}>
            {entry.noCharge ? 'Charge again' : "Don't charge"}
          </button>
          <button role="menuitem" type="button" className={`${MENU_ITEM} text-delete`} onClick={() => setOpen('delete')}>
            Delete
          </button>
        </div>
      )}
      {open === 'delete' && (
        <div role="dialog" aria-label={`Delete ${label} line`} className="absolute top-6 right-0 z-20 w-52 rounded-md border border-line bg-menu p-2.5 text-left shadow-menu animate-pop">
          <label htmlFor={`reason-${entry.id}`} className="block text-caption font-semibold text-filter-label">
            Reason (required)
          </label>
          <select
            id={`reason-${entry.id}`}
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 h-7 w-full rounded-sm border border-line bg-white px-1.5 text-caption focus:outline-2 focus:outline-accent"
          >
            <option value="">Choose a reason</option>
            {REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          {reason === 'Other' && (
            <input
              aria-label="Other reason"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Describe the reason"
              className="mt-1.5 h-7 w-full rounded-sm border border-line bg-white px-1.5 text-caption focus:outline-2 focus:outline-accent"
            />
          )}
          <div className="mt-2 flex justify-end gap-1.5">
            <button type="button" onClick={() => setOpen(null)} className="rounded-lg border border-line px-2 py-1 text-caption hover:bg-hover">
              Cancel
            </button>
            <button
              type="button"
              disabled={!canDelete}
              onClick={remove}
              className="rounded-sm bg-delete px-2.5 py-1 text-caption font-semibold text-white disabled:border-ink-divider disabled:bg-segment disabled:text-ink-muted"
            >
              Delete line
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function EditRow({ entry, onDone }: { entry: Entry; onDone: () => void }) {
  const { store, update, me } = useDemo()
  const [hours, setHours] = useState(String(entry.hours))
  const [description, setDescription] = useState(entry.description)
  const [rate, setRate] = useState(String(entry.rate))
  const firmRate = store.rates[entry.employee]
  const h = Number(hours)
  const r = Number(rate)
  const valid = h > 0 && h <= 24 && r > 0 && description.trim().length > 0

  function save() {
    if (!valid) return
    update((s) => {
      const e = s.entries.find((x) => x.id === entry.id)!
      snapshotForReview(e, me.initials)
      const changes = [
        e.hours !== h && `hours ${formatHours(e.hours)} → ${formatHours(h)}`,
        e.rate !== r && `rate ${money(e.rate)} → ${money(r)}`,
        e.description !== description.trim() && 'description',
      ].filter(Boolean)
      e.hours = h
      e.rate = r
      e.description = description.trim()
      s.audit.unshift(`${me.firstName} edited ${entry.date.slice(5)} ${entry.employee}: ${changes.join(', ') || 'no change'}; original kept`)
    })
    onDone()
  }

  return (
    <tr className="border-b border-doc-row bg-filter-panel">
      <td colSpan={7} className="block">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            save()
          }}
          onKeyDown={(e) => e.key === 'Escape' && onDone()}
        >
          <div className={LINE}>
            <span>{entry.date.slice(5)}</span>
            <span className="truncate">{entry.employee}</span>
            <input aria-label="Description" autoFocus value={description} onChange={(e) => setDescription(e.target.value)} className={INPUT} />
            <input aria-label="Hours" inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} className={INPUT} />
            <input aria-label="Rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={INPUT} />
            <span>{valid ? money(h * r) : ''}</span>
            <span />
          </div>
          <div className="flex items-center justify-end gap-1.5 px-1.75 pb-2">
            {r !== firmRate && r > 0 && (
              <span className="mr-auto rounded-xs bg-accent-soft px-1 text-caption text-accent-ink">custom · firm rate {money(firmRate)}</span>
            )}
            {!valid && <span className="mr-auto text-caption text-error-ink">Hours (0–24), rate and description are required.</span>}
            <button type="button" onClick={onDone} className="rounded-lg border border-line bg-white px-2.5 py-1 text-caption hover:bg-hover">
              Cancel
            </button>
            <button type="submit" disabled={!valid} className="rounded-sm bg-dark px-2.5 py-1 text-caption font-semibold text-white disabled:border-ink-divider disabled:bg-segment disabled:text-ink-muted">
              Save
            </button>
          </div>
        </form>
      </td>
    </tr>
  )
}

/**
 * The paper itself: letterhead, bill-to, period, line table head and total. Rows come from the caller so the
 * live (editable) invoice and archived (read-only) invoices share one layout.
 */
function InvoicePaper({
  project: p,
  period,
  total,
  children,
  footnote,
}: {
  project: Project
  period: BillingPeriod
  total: number
  children: ReactNode
  footnote?: ReactNode
}) {
  return (
    <article aria-label={`Invoice ${p.code}, ${periodLabel(period)}`} className="flex min-h-180 w-full max-w-160 min-w-0 flex-col rounded-xs bg-paper px-8 py-9 shadow-doc">
      <header className="flex items-center border-b-2 border-doc-rule pb-4.25">
        <span className="relative h-8.25 w-8.5 text-title-sm text-ink" aria-hidden="true">
          <span className="absolute top-1.5 left-0">H</span>
          <span className="absolute top-px left-4.5 h-6.25 w-px rotate-23 bg-doc-mark" />
          <span className="absolute top-1.5 left-5.25">K</span>
        </span>
        <span className="pl-2.25">
          <b className="block text-caption font-semibold">HARTWELL &amp; KNOX</b>
          <small className="block text-caption tracking-doc-firm">FORENSIC ADVISORY</small>
        </span>
      </header>

      <div className="flex justify-between py-6">
        <div>
          <p className="text-caption">BILL TO{/* one-off 6.4px label */}</p>
          <p className="pt-1.5 text-body">{p.client}</p>
          <p className="pt-1.5 text-caption leading-address text-ink-neutral">
            Attn: {p.contact}
            <br />
            {p.address}
          </p>
        </div>
        <dl className="w-62.5">
          {[
            ['INVOICE', p.code],
            ['PERIOD', periodRange(period)],
            ['PROJECT', p.name],
          ].map(([t, d]) => (
            <div key={t} className="flex justify-between gap-3 border-b border-doc-line p-1.75 text-caption">
              <dt className="text-ink-dim">{t}</dt>
              <dd className="text-right font-semibold">{d}</dd>
            </div>
          ))}
        </dl>
      </div>

      <table className="w-full text-caption leading-invoice">
        <thead>
          <tr className={`${LINE} border-b border-doc-row bg-doc-head text-caption tracking-doc-th text-ink-dim uppercase`}>
            <th className="text-left font-normal">Date</th>
            <th className="text-left font-normal">Employee</th>
            <th className="truncate text-left font-normal">Description</th>
            <th className="text-left font-normal">Hours</th>
            <th className="text-left font-normal">Rate</th>
            <th className="text-left font-normal">Amount</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>

      <footer className="mt-4.5 border-t border-doc-mark pt-3.25">
        <div className="flex items-center justify-end gap-7.5">
          <span className="text-caption">Professional services</span>
          <b className="text-lead font-semibold">{money(total)}</b>
        </div>
        {footnote}
      </footer>
    </article>
  )
}

/**
 * Client-ready invoice preview for the current cycle (Figma 36:6437). With `editable`, each line gets Edit /
 * Mark non-billable / Delete, an "Edited by" marker and a click-to-see source row (spec items 1 and 9).
 */
export function InvoiceDocument({ projectId, highlight, editable = false }: { projectId: string; highlight?: string; editable?: boolean }) {
  const { store } = useDemo()
  const p = store.projects.find((x) => x.id === projectId)!
  const status = store.invoiceStatus[projectId]
  const lines = invoiceLines(store, projectId)
  const adjustments = invoiceAdjustments(store, projectId)
  const canEdit = editable && !isFinal(status)
  const [editing, setEditing] = useState<string | null>(null)
  const [source, setSource] = useState<string | null>(null)

  return (
    <InvoicePaper
      project={p}
      period={currentPeriod}
      total={invoiceTotal(store, projectId)}
      footnote={
        adjustments.count > 0 && (
          <p className="pt-1 text-right text-caption text-ink-muted">
            Adjustments: {adjustments.count} {adjustments.count === 1 ? 'adjustment' : 'adjustments'} · {adjustments.net < 0 ? '−' : '+'}
            {money(Math.abs(adjustments.net))}
          </p>
        )
      }
    >
      {lines.map((e) => {
        if (editing === e.id) return <EditRow key={e.id} entry={e} onDone={() => setEditing(null)} />
        const flagged = highlight === e.id
        const custom = e.rate !== store.rates[e.employee]
        return [
          <tr
            key={e.id}
            aria-current={flagged ? 'true' : undefined}
            className={`group/line ${LINE} ${flagged ? '-mx-0.5 rounded-sm border border-highlight-line bg-highlight' : 'border-b border-doc-row'} ${
              e.noCharge ? 'text-ink-dim' : ''
            }`}
          >
            <td>{e.date.slice(5)}</td>
            <td className="truncate">{e.employee}</td>
            <td className="min-w-0 whitespace-normal">
              {editable ? (
                <button
                  type="button"
                  aria-expanded={source === e.id}
                  onClick={() => setSource(source === e.id ? null : e.id)}
                  className="block max-w-full truncate text-left hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {e.description}
                </button>
              ) : (
                <span className="block truncate">{e.description}</span>
              )}
              {e.noCharge && <span className="ml-1 rounded-xs bg-neutral-soft px-1 text-caption text-ink-neutral">No charge</span>}
              {editable && e.review && <EditedMarker entry={e} />}
            </td>
            <td>{e.hours.toFixed(1)}</td>
            <td>
              {money(e.rate)}
              {editable && custom && <span className="block text-caption text-accent-ink">custom</span>}
            </td>
            <td className={e.noCharge ? 'line-through' : undefined}>{money(e.hours * e.rate)}</td>
            <td className="text-right">{canEdit && <LineActions entry={e} onEdit={() => setEditing(e.id)} />}</td>
          </tr>,
          source === e.id && (
            <tr key={`${e.id}-source`} className="border-b border-doc-row bg-filter-panel px-1.75 py-1.5 text-caption text-ink-muted block">
              <td>Source: {sourceOf(e)}</td>
            </tr>
          ),
        ]
      })}
    </InvoicePaper>
  )
}

/** A closed cycle's invoice, read-only: no line actions, source rows or edit markers. */
export function ArchivedInvoiceDocument({ invoice, period }: { invoice: ArchivedInvoice; period: BillingPeriod }) {
  const { store } = useDemo()
  const p = projectById(store, invoice.projectId)!
  return (
    <InvoicePaper project={p} period={period} total={archivedInvoiceTotal(invoice)}>
      {invoice.lines.map((l, i) => (
        <tr key={i} className={`${LINE} border-b border-doc-row`}>
          <td>{l.date.slice(5)}</td>
          <td className="truncate">{l.employee}</td>
          <td className="truncate">{l.description}</td>
          <td>{l.hours.toFixed(1)}</td>
          <td>{money(l.rate)}</td>
          <td>{money(l.hours * l.rate)}</td>
          <td />
        </tr>
      ))}
    </InvoicePaper>
  )
}
