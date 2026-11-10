import { Link } from 'react-router'
import { useDemo } from './DemoContext'
import { Icon } from './Icon'
import { Pill } from './Pill'
import { completeness, invoiceTotal, isFinal, money, openFlagsFor } from '../data/store'

// Column widths from Figma (36:165 / 36:6025): 190 / 86 / 86 / 55 / 80 / 92 / 55 px of 643px.
const COLS = ['29.5%', '13.3%', '13.3%', '8.6%', '12.4%', '14.3%', '8.6%']
const HEADERS = ['Project', 'Billing period', 'Draft amount', 'Open flags', 'Completeness', 'Status']
const TH = 'h-10 bg-table-head text-left align-middle text-caption font-semibold tracking-th text-ink-th uppercase'
const TD = 'h-16 border-t border-line-row align-middle text-body text-ink'

/** Project invoice list used on Home ("Open") and Review Invoices ("Review"). */
export function InvoiceTable({ actionLabel }: { actionLabel: 'Open' | 'Review' }) {
  const { store } = useDemo()

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          {COLS.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {HEADERS.map((h, i) => (
              <th key={h} scope="col" className={`${TH} ${i === 0 ? 'pl-4' : ''}`}>
                {h}
              </th>
            ))}
            <th scope="col" className={`${TH} pr-4`}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {store.projects.map((p) => {
            const flags = openFlagsFor(store, p.id).length
            const status = store.invoiceStatus[p.id]
            const tone = isFinal(status) ? 'success' : flags ? 'accent' : 'neutral'
            return (
              <tr key={p.id} className="group transition-colors duration-150 hover:bg-brand-25">
                <th scope="row" className={`${TD} pl-4 text-left font-normal`}>
                  <span className="block truncate font-semibold">{p.name}</span>
                  <span className="block truncate pt-0.5 text-caption text-ink-muted">{p.client}</span>
                </th>
                <td className={TD}>May 1–31</td>
                <td className={`${TD} font-semibold`}>{money(invoiceTotal(store, p.id))}</td>
                <td className={TD}>{flags}</td>
                <td className={TD}>{completeness(store, p.id)}</td>
                <td className={TD}>
                  <Pill tone={tone}>{status}</Pill>
                </td>
                <td className={`${TD} pr-4 text-right`}>
                  <Link
                    to={`/review/${p.id}`}
                    aria-label={`${actionLabel} ${p.name}`}
                    className="inline-flex h-8 items-center gap-1 rounded-sm px-2 text-small font-semibold text-link transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {actionLabel}
                    <Icon name="arrow-right-small" size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
