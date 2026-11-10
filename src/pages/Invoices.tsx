import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { DarkButton, OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { archivedInvoiceTotal, findArchivedInvoice, pastCycles, projectById } from '../data/history'
import { invoiceTotal, isFinal, money, partner, periodLabel } from '../data/store'
import { ArchivedInvoiceDocument, InvoiceDocument } from '../sections/review/InvoiceDocument'
import { SendInvoiceModal } from '../sections/review/SendInvoiceModal'

const fmt = (iso?: string) => (iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '')
const cycleKey = (c: (typeof pastCycles)[number]) => `${c.period.year}-${c.period.month}`

const ROW = 'grid w-full grid-cols-[1fr_auto] gap-1.5 border-b border-line p-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent'
const rowTone = (on: boolean) => (on ? 'bg-brand-50 shadow-[inset_3px_0_var(--color-brand)]' : 'hover:bg-hover')

/**
 * Approved Invoices (was "Approved & Sent", originally "Invoices"; Figma 36:7115 shows the empty state). Library, export and send follow the
 * code layer and spec item 10; export and send are simulated. Current-cycle invoices come first with no cycle
 * label (the current cycle is implied); closed cycles follow under "Past cycles", grouped by month, read-only.
 * `?invoice=<id>` preselects an invoice (a project id for the current cycle, an archive id for past ones).
 */
export default function Invoices() {
  const { store, toast } = useDemo()
  const [params] = useSearchParams()
  const [selected, setSelected] = useState<string | null>(() => params.get('invoice'))
  const [sending, setSending] = useState(false)
  // Most recent closed cycle starts open, plus whichever cycle holds a deep-linked invoice.
  const [open, setOpen] = useState<Set<string>>(() => {
    const keys = new Set([cycleKey(pastCycles[0])])
    const linked = params.get('invoice')
    const hit = pastCycles.find((c) => c.invoices.some((inv) => inv.id === linked))
    if (hit) keys.add(cycleKey(hit))
    return keys
  })

  const done = store.projects.filter((p) => isFinal(store.invoiceStatus[p.id]))
  const current = selected ? done.find((p) => p.id === selected) : undefined
  const archived = selected && !current ? findArchivedInvoice(selected) : undefined
  const sent = (id: string) => store.invoiceStatus[id] === 'Sent'

  const toggle = (key: string) =>
    setOpen((s) => {
      const next = new Set(s)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const exportButtons = (
    <>
      <OutlineButton onClick={() => toast('Excel export prepared in the demo')} className="gap-2">
        <Icon name="download-dark" size={18} /> Excel
      </OutlineButton>
      <OutlineButton onClick={() => toast('PDF export prepared in the demo')} className="gap-2">
        <Icon name="download-dark" size={18} /> PDF
      </OutlineButton>
    </>
  )

  return (
    <>
      <PageTitle title="Approved Invoices" description="Preview approved invoices, export files, and see invoice history." />

      <div className="mt-6 grid min-h-175 grid-cols-[320px_1fr] overflow-hidden rounded-lg border border-line bg-library shadow-card">
        <aside aria-label="Approved and sent invoices" className="overflow-y-auto border-r border-line bg-library-aside">
          {done.length ? (
            done.map((p) => {
              const dates = store.invoiceDates[p.id] ?? {}
              return (
                <button key={p.id} type="button" aria-pressed={selected === p.id} onClick={() => setSelected(p.id)} className={`${ROW} ${rowTone(selected === p.id)}`}>
                  <span>
                    <b className="block text-small font-semibold">{p.name}</b>
                    <small className="block pt-0.75 text-caption text-ink-muted">{p.client}</small>
                  </span>
                  <span className="text-small font-semibold">{money(invoiceTotal(store, p.id))}</span>
                  <span className="col-span-2 flex items-center gap-1.5">
                    <Pill tone="success">{sent(p.id) ? 'Sent' : 'Approved'}</Pill>
                    <small className="text-caption text-ink-muted">{sent(p.id) ? `Sent ${fmt(dates.sentAt)}` : `Approved ${fmt(dates.approvedAt)}`}</small>
                  </span>
                </button>
              )
            })
          ) : (
            // Kept inline (not full-page) so past cycles below stay reachable.
            <div className="border-b border-line px-4 py-5">
              <b className="block text-body font-semibold text-ink">No approved invoices yet</b>
              <p className="pt-1 text-small text-ink-muted">Approve an invoice in Ready for Review and it will appear here.</p>
            </div>
          )}

          <h2 className="px-4 pt-6 pb-2 text-caption font-semibold tracking-eyebrow text-ink-label uppercase">Past cycles</h2>
          {pastCycles.map((cycle) => {
            const key = cycleKey(cycle)
            const isOpen = open.has(key)
            const total = cycle.invoices.reduce((n, inv) => n + archivedInvoiceTotal(inv), 0)
            return (
              <section key={key} aria-label={periodLabel(cycle.period)}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`cycle-${key}`}
                  onClick={() => toggle(key)}
                  className="flex w-full items-center gap-2 border-y border-line bg-surface-muted px-4 py-2.5 text-left transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                >
                  <Icon name="chevron-down" width={10} height={6} className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                  <b className="text-small font-semibold text-ink">{periodLabel(cycle.period)}</b>
                  <span className="ml-auto text-caption text-ink-muted tabular-nums">
                    {cycle.invoices.length} invoices · {money(total)}
                  </span>
                </button>
                <div id={`cycle-${key}`} hidden={!isOpen}>
                  {cycle.invoices.map((inv) => {
                    const p = projectById(store, inv.projectId)!
                    return (
                      <button key={inv.id} type="button" aria-pressed={selected === inv.id} onClick={() => setSelected(inv.id)} className={`${ROW} ${rowTone(selected === inv.id)}`}>
                        <span>
                          <b className="block text-small font-semibold">{p.name}</b>
                          <small className="block pt-0.75 text-caption text-ink-muted">{p.client}</small>
                        </span>
                        <span className="text-small font-semibold">{money(archivedInvoiceTotal(inv))}</span>
                        <span className="col-span-2 flex items-center gap-1.5">
                          <Pill tone={inv.status === 'Sent' ? 'success' : 'neutral'}>{inv.status}</Pill>
                          <small className="text-caption text-ink-muted">{inv.sentAt ? `Sent ${fmt(inv.sentAt)}` : `Approved ${fmt(inv.approvedAt)}`}</small>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </aside>

        <section className="overflow-auto p-5">
          {current ? (
            <>
              <div className="mx-auto mb-3 flex max-w-160 items-center gap-2">
                <div className="mr-auto">
                  <b className="block text-small font-semibold">Invoice preview</b>
                  <p className="pt-0.5 text-caption text-ink-muted">
                    Approved by {partner.name}
                    {sent(current.id) && ` · Sent to ${current.contact} on ${fmt(store.invoiceDates[current.id]?.sentAt)}`}
                  </p>
                </div>
                {exportButtons}
                {!sent(current.id) && <DarkButton onClick={() => setSending(true)}>Send to client</DarkButton>}
              </div>
              <div className="flex justify-center">
                <InvoiceDocument projectId={current.id} />
              </div>
            </>
          ) : archived ? (
            <>
              <div className="mx-auto mb-3 flex max-w-160 items-center gap-2">
                <div className="mr-auto">
                  <b className="block text-small font-semibold">Invoice preview</b>
                  <p className="pt-0.5 text-caption text-ink-muted">
                    {periodLabel(archived.period)} · Approved by {partner.name}
                    {archived.invoice.sentAt && ` · Sent to ${projectById(store, archived.invoice.projectId)?.contact} on ${fmt(archived.invoice.sentAt)}`}
                  </p>
                </div>
                {exportButtons}
              </div>
              <div className="flex justify-center">
                <ArchivedInvoiceDocument invoice={archived.invoice} period={archived.period} />
              </div>
            </>
          ) : (
            <EmptyState icon="invoice-empty" iconSize={28} title="Select an approved invoice">
              Preview and export options will appear here.
            </EmptyState>
          )}
        </section>
      </div>
      {sending && current && <SendInvoiceModal projectId={current.id} onClose={() => setSending(false)} />}
    </>
  )
}
