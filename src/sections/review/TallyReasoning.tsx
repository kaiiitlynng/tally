import { useDemo } from '../../components/DemoContext'
import { allFlags, formatHours, invoiceLines, isOpen, type Flag } from '../../data/store'

const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`)
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

/** Short plain name for why a flag was raised. */
function reason(f: Flag) {
  if (f.change?.field === 'Hours') return 'a possible typo in the hours'
  if (f.kind === 'daily') return 'a day over your daily-hours limit'
  if (f.type === 'Vague description' || f.type === 'More detail helpful') return 'a description that needs more detail'
  return `a warning the employee confirmed (${f.type.toLowerCase()})`
}

/**
 * "Tally's reasoning": one collapsed dropdown at the foot of "Review with Tally" (owner request 2026-11-10).
 * Explains, in plain sentences built from this invoice's data, how Tally put the invoice together and why it
 * asked its questions: where the hours came from, how they tie out (spec item 9), rates, and the flags.
 */
export function TallyReasoning({ projectId }: { projectId: string }) {
  const { store } = useDemo()
  const lines = invoiceLines(store, projectId)
  const removed = store.removedLines.filter((r) => r.entry.projectId === projectId)
  const timesheet = lines.reduce((n, e) => n + (e.review?.original.hours ?? e.hours), 0) + removed.reduce((n, r) => n + (r.entry.review?.original.hours ?? r.entry.hours), 0)
  const invoiced = lines.filter((e) => !e.noCharge).reduce((n, e) => n + e.hours, 0)
  const adjusted = Math.round((timesheet - invoiced) * 100) / 100
  const custom = lines.filter((e) => e.rate !== store.rates[e.employee]).length
  const traced = lines.every((e) => e.source === 'Direct' || e.sourceRef)
  const fromExcel = lines.filter((e) => e.source === 'Excel').length
  const people = [...new Set(lines.map((e) => e.employee.split(' ')[0]))]
  const flags = allFlags(store).filter((f) => store.entries.find((e) => e.id === f.entryId)?.projectId === projectId)
  const settled = flags.filter((f) => !isOpen(f)).length

  const sentences = [
    `Tally gathered ${plural(lines.length, 'time entry', 'time entries')} from ${list(people)}: ${fromExcel} from Excel timesheets and ${lines.length - fromExcel} entered directly.`,
    adjusted === 0
      ? `The ${formatHours(timesheet)} hours people submitted match the ${formatHours(invoiced)} hours on the invoice exactly.`
      : `People submitted ${formatHours(timesheet)} hours; the invoice charges ${formatHours(invoiced)} because ${formatHours(Math.abs(adjusted))} ${Math.abs(adjusted) === 1 ? 'hour was' : 'hours were'} changed during review.`,
    custom === 0
      ? "Every line uses the person's standard rate from your firm's rate card."
      : `${plural(custom, 'line uses', 'lines use')} a rate that differs from your firm's rate card.`,
    traced
      ? 'Each line traces back to a spreadsheet row or a direct entry. Select a description on the invoice to see where it came from.'
      : 'Some lines have no source recorded, so check them before approving.',
    flags.length
      ? `Tally asked about ${plural(flags.length, 'entry', 'entries')}: ${list(flags.map(reason))}. ${settled ? `You've settled ${settled} so far.` : ''}`.trim()
      : 'Nothing looked unusual, so Tally had no questions.',
  ]

  return (
    <details className="group border-t border-line px-4 py-3.25">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-xs text-small font-semibold text-ink focus-visible:outline-2 focus-visible:outline-accent">
        <span className="inline-block w-2.75 text-caption text-hero-ink transition-transform group-open:rotate-90" aria-hidden="true">
          ▸
        </span>
        Tally&apos;s reasoning
      </summary>
      <ul className="mt-2.5 flex list-disc flex-col gap-1.5 pl-4 text-caption leading-normal text-ink marker:text-ink-muted">
        {sentences.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </details>
  )
}
