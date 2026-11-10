import { Pill } from '../../components/Pill'
import { useDemo } from '../../components/DemoContext'
import { invoiceTotal, money } from '../../data/store'

const LINE = 'grid grid-cols-[51fr_85fr_212fr_38fr_47fr_59fr] gap-2 px-1.75 py-2.25'

/** Client-ready invoice preview (Figma 36:6437). */
export function InvoiceDocument({ projectId, highlight }: { projectId: string; highlight?: string }) {
  const { store } = useDemo()
  const p = store.projects.find((x) => x.id === projectId)!
  const status = store.invoiceStatus[projectId]
  const lines = store.entries
    .filter((e) => e.projectId === projectId && e.billable)
    .sort((a, b) => a.date.localeCompare(b.date) || a.employee.split(' ').at(-1)!.localeCompare(b.employee.split(' ').at(-1)!))

  return (
    <article aria-label={`Invoice ${p.code}`} className="flex min-h-180 w-156.25 flex-col bg-paper px-10 py-9 shadow-doc">
      <header className="flex items-center border-b-2 border-doc-rule pb-4.25">
        <span className="relative h-8.25 w-8.5 text-19 text-ink" aria-hidden="true">
          <span className="absolute top-1.5 left-0">H</span>
          <span className="absolute top-px left-4.5 h-6.25 w-px rotate-23 bg-doc-mark" />
          <span className="absolute top-1.5 left-5.25">K</span>
        </span>
        <span className="pl-2.25">
          <b className="block text-8 font-bold">HARTWELL &amp; KNOX</b>
          <small className="block text-6 tracking-doc-firm">FORENSIC ADVISORY</small>
        </span>
        <span className="ml-auto">
          <Pill tone={status === 'Approved' || status === 'Exported' ? 'success' : 'accent'}>{status}</Pill>
        </span>
      </header>

      <div className="flex justify-between py-6">
        <div>
          <p className="text-[6.4px] leading-[9.6px]">BILL TO{/* one-off 6.4px label */}</p>
          <h3 className="pt-1.5 text-12">{p.client}</h3>
          <p className="pt-1.5 text-8 leading-address text-ink-neutral">
            Attn: {p.contact}
            <br />
            {p.address}
          </p>
        </div>
        <dl className="w-62.5">
          {[
            ['INVOICE', p.code],
            ['PERIOD', 'May 1–31, 2025'],
            ['PROJECT', p.name],
          ].map(([t, d]) => (
            <div key={t} className="flex justify-between border-b border-doc-line p-1.75 text-8">
              <dt className="text-ink-dim">{t}</dt>
              <dd className="font-semibold">{d}</dd>
            </div>
          ))}
        </dl>
      </div>

      <table className="w-full text-8 leading-invoice">
        <thead>
          <tr className={`${LINE} border-b border-doc-row bg-doc-head text-6 tracking-doc-th text-ink-dim uppercase`}>
            <th className="text-left font-normal">Date</th>
            <th className="text-left font-normal">Employee</th>
            <th className="text-left font-normal">Description</th>
            <th className="text-right font-normal">Hours</th>
            <th className="text-right font-normal">Rate</th>
            <th className="text-right font-normal">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((e) => (
            <tr
              key={e.id}
              aria-current={highlight === e.id ? 'true' : undefined}
              className={`${LINE} ${highlight === e.id ? '-mx-0.5 rounded-[5px] border border-highlight-line bg-highlight' : 'border-b border-doc-row'}`}
            >
              <td>{e.date.slice(5)}</td>
              <td className="truncate">{e.employee}</td>
              <td className="truncate">{e.description}</td>
              <td className="text-right">{e.hours.toFixed(1)}</td>
              <td className="text-right">{money(e.rate)}</td>
              <td className="text-right">{money(e.hours * e.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="mt-4.5 flex items-center justify-end gap-7.5 border-t border-doc-mark pt-3.25">
        <span className="text-8">Professional services</span>
        <b className="text-14 font-bold">{money(invoiceTotal(store, projectId))}</b>
      </footer>
    </article>
  )
}
