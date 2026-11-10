import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { formatHours, invoiceLines } from '../../data/store'

/**
 * "Tie-out" trust card above "Review with Tally" (spec item 9). Timesheet hours are what people submitted
 * (original values, including lines removed in review); invoice hours are what is charged now.
 */
export function TieOutCard({ projectId }: { projectId: string }) {
  const { store } = useDemo()
  const lines = invoiceLines(store, projectId)
  const removed = store.removedLines.filter((r) => r.entry.projectId === projectId)
  const timesheet = lines.reduce((n, e) => n + (e.review?.original.hours ?? e.hours), 0) + removed.reduce((n, r) => n + (r.entry.review?.original.hours ?? r.entry.hours), 0)
  const invoiced = lines.filter((e) => !e.noCharge).reduce((n, e) => n + e.hours, 0)
  const adjusted = Math.round((timesheet - invoiced) * 100) / 100
  const custom = lines.filter((e) => e.rate !== store.rates[e.employee]).length
  const traced = lines.every((e) => e.source === 'Direct' || e.sourceRef)

  const Row = ({ ok, children }: { ok: boolean; children: React.ReactNode }) => (
    <li className="flex items-start gap-1.5 text-caption">
      <span className="mt-px w-3.25 shrink-0">{ok && <Icon name="check-activity" size={13} />}</span>
      <span className={ok ? 'text-ink' : 'text-caution-ink'}>{children}</span>
    </li>
  )

  return (
    <section aria-labelledby="tie-out" className="border-b border-line px-4 py-3.25">
      <h2 id="tie-out" className="text-small font-semibold text-ink">
        Tie-out
      </h2>
      <ul className="mt-1.5 flex flex-col gap-1">
        <Row ok>
          Hours from timesheets: {formatHours(timesheet)} · Hours on invoice: {formatHours(invoiced)}
          {adjusted !== 0 && <span className="text-ink-muted"> ({formatHours(Math.abs(adjusted))} adjusted in review)</span>}
        </Row>
        <Row ok={custom === 0}>{custom === 0 ? 'Rates match firm rate card' : `${custom} custom ${custom === 1 ? 'rate' : 'rates'}`}</Row>
        <Row ok={traced}>Every entry traced to a source file or direct entry</Row>
      </ul>
      <p className="mt-1.5 text-caption text-ink-muted">Select a line description to see its source.</p>
    </section>
  )
}
