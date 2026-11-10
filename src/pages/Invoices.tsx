import { useState } from 'react'
import { DarkButton, OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { invoiceTotal, money, partner } from '../data/store'
import { InvoiceDocument } from '../sections/review/InvoiceDocument'

/**
 * Invoices (Figma 36:7115 shows the empty state). The approved-invoice library and export
 * follow the prototype code layer; exports are simulated, no file is produced.
 */
export default function Invoices() {
  const { store, update } = useDemo()
  const [selected, setSelected] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const approved = store.projects.filter((p) => ['Approved', 'Exported'].includes(store.invoiceStatus[p.id]))

  function exportIt(format: 'Excel' | 'PDF') {
    if (!selected) return
    update((s) => {
      s.invoiceStatus[selected] = 'Exported'
    })
    setNotice(`${format} export prepared in the demo`)
  }

  return (
    <>
      <PageTitle eyebrow="Approved billing records" title="Invoices" description="Preview approved invoices, export files, and see invoice history." />

      {notice && (
        <div role="status" className="mt-4 flex items-center gap-2 rounded-11 border border-done-line bg-banner px-3.5 py-2.75 text-9 text-banner-ink">
          <Icon name="check-foot" size={18} />
          {notice}
        </div>
      )}

      {approved.length ? (
        <div className="mt-6 grid min-h-175 grid-cols-[320px_1fr] overflow-hidden rounded-16 border border-line bg-library">
          <aside aria-label="Approved invoices" className="border-r border-line bg-library-aside">
            {approved.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={selected === p.id}
                onClick={() => setSelected(p.id)}
                className={`grid w-full grid-cols-[1fr_auto] gap-1.75 border-b border-line p-3.75 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-dark ${
                  selected === p.id ? 'bg-white' : 'hover:bg-white/60'
                }`}
              >
                <span>
                  <b className="block text-9 font-bold">{p.name}</b>
                  <small className="block pt-0.75 text-7 text-ink-muted">{p.client} · May 2025</small>
                </span>
                <span className="text-9 font-semibold">{money(invoiceTotal(store, p.id))}</span>
                <span>
                  <Pill tone="success">{store.invoiceStatus[p.id]}</Pill>
                </span>
              </button>
            ))}
          </aside>
          <section className="overflow-auto p-4.5">
            {selected ? (
              <>
                <div className="mx-auto mb-3 flex w-156.25 items-center gap-1.75">
                  <div className="mr-auto">
                    <b className="block text-10 font-bold">Invoice preview</b>
                    <p className="pt-0.5 text-7 text-ink-muted">Approved by {partner.name}</p>
                  </div>
                  <OutlineButton onClick={() => exportIt('Excel')} className="gap-2">
                    <Icon name="download-dark" size={18} /> Excel
                  </OutlineButton>
                  <DarkButton onClick={() => exportIt('PDF')} leadingIcon="download-white">
                    PDF
                  </DarkButton>
                </div>
                <div className="flex justify-center">
                  <InvoiceDocument projectId={selected} />
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
            Approve an invoice in Review Invoices and it will appear here.
          </EmptyState>
        </div>
      )}
    </>
  )
}
