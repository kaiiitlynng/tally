import { useState } from 'react'
import { DarkButton, OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { invoiceTotal, isFinal, money, partner } from '../data/store'
import { InvoiceDocument } from '../sections/review/InvoiceDocument'
import { SendInvoiceModal } from '../sections/review/SendInvoiceModal'

const fmt = (iso?: string) => (iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '')

/**
 * Approved & Sent (was "Invoices"; Figma 36:7115 shows the empty state). Library, export and
 * send follow the code layer and spec item 10; export and send are simulated.
 */
export default function Invoices() {
  const { store, toast } = useDemo()
  const [selected, setSelected] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const done = store.projects.filter((p) => isFinal(store.invoiceStatus[p.id]))
  const current = selected ? store.projects.find((p) => p.id === selected) : undefined
  const sent = (id: string) => store.invoiceStatus[id] === 'Sent'

  return (
    <>
      <PageTitle eyebrow="Approved billing records" title="Approved & Sent" description="Preview approved invoices, export files, and see invoice history." />

      {done.length ? (
        <div className="mt-6 grid min-h-175 grid-cols-[320px_1fr] overflow-hidden rounded-lg border border-line bg-library">
          <aside aria-label="Approved and sent invoices" className="border-r border-line bg-library-aside">
            {done.map((p) => {
              const dates = store.invoiceDates[p.id] ?? {}
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={selected === p.id}
                  onClick={() => setSelected(p.id)}
                  className={`grid w-full grid-cols-[1fr_auto] gap-1.5 border-b border-line p-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                    selected === p.id ? 'bg-brand-50 shadow-[inset_3px_0_var(--color-brand)]' : 'hover:bg-brand-25'
                  }`}
                >
                  <span>
                    <b className="block text-small font-semibold">{p.name}</b>
                    <small className="block pt-0.75 text-caption text-ink-muted">{p.client} · May 2025</small>
                  </span>
                  <span className="text-small font-semibold">{money(invoiceTotal(store, p.id))}</span>
                  <span className="col-span-2 flex items-center gap-1.5">
                    <Pill tone="success">{sent(p.id) ? 'Sent' : 'Approved'}</Pill>
                    <small className="text-caption text-ink-muted">
                      {sent(p.id) ? `Sent ${fmt(dates.sentAt)}` : `Approved ${fmt(dates.approvedAt)}`}
                    </small>
                  </span>
                </button>
              )
            })}
          </aside>
          <section className="overflow-auto p-4.5">
            {current ? (
              <>
                <div className="mx-auto mb-3 flex w-156.25 items-center gap-1.75">
                  <div className="mr-auto">
                    <b className="block text-small font-semibold">Invoice preview</b>
                    <p className="pt-0.5 text-caption text-ink-muted">
                      Approved by {partner.name}
                      {sent(current.id) && ` · Sent to ${current.contact} on ${fmt(store.invoiceDates[current.id]?.sentAt)}`}
                    </p>
                  </div>
                  <OutlineButton onClick={() => toast('Excel export prepared in the demo')} className="gap-2">
                    <Icon name="download-dark" size={18} /> Excel
                  </OutlineButton>
                  <OutlineButton onClick={() => toast('PDF export prepared in the demo')} className="gap-2">
                    <Icon name="download-dark" size={18} /> PDF
                  </OutlineButton>
                  {!sent(current.id) && <DarkButton onClick={() => setSending(true)}>Send to client</DarkButton>}
                </div>
                <div className="flex justify-center">
                  <InvoiceDocument projectId={current.id} />
                </div>
              </>
            ) : (
              <EmptyState icon="invoice-empty" iconSize={28} title="Select an approved invoice">
                Preview and export options will appear here.
              </EmptyState>
            )}
          </section>
        </div>
      ) : (
        <div className="pt-6">
          <EmptyState icon="invoice-empty" iconSize={18} title="No approved invoices yet">
            Approve an invoice in Ready for Review and it will appear here.
          </EmptyState>
        </div>
      )}
      {sending && current && <SendInvoiceModal projectId={current.id} onClose={() => setSending(false)} />}
    </>
  )
}
