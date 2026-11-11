import { DarkLinkButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { allFlags, completeness, invoicesNeedingReview, isOpen } from '../../data/store'

/** "Your next step" (Figma 36:48), as a compact card under Home's primary actions. Stats and body copy removed (owner, 2026-11-10). */
export function NextStepHero() {
  const { store } = useDemo()
  const review = invoicesNeedingReview(store)
  // One line on what's waiting: how many entries Tally flagged and what kind (owner request 2026-11-10).
  const open = allFlags(store).filter((f) => isOpen(f) && completeness(store, store.entries.find((e) => e.id === f.entryId)?.projectId ?? '') !== 'Time missing')
  const kinds = [
    ...new Set(
      open.map((f) =>
        f.change?.field === 'Hours' ? 'possible typos' : f.kind === 'daily' ? `days over ${store.threshold} hours` : /description|detail/i.test(f.type) ? 'vague descriptions' : f.type.toLowerCase(),
      ),
    ),
  ]
  const detail = open.length
    ? `${open.length} flagged ${open.length === 1 ? 'entry' : 'entries'} to check: ${kinds.join(', ')}.`
    : review
      ? 'No flagged entries. The invoices are ready to approve.'
      : ''

  return (
    <section aria-labelledby="next-step-title" className="flex items-center justify-between gap-6 rounded-lg border border-line bg-surface px-6 py-5 shadow-card">
      <div className="min-w-0">
        <h2 id="next-step-title" className="text-title-sm font-semibold tracking-title text-ink">
          {review ? `Review ${review} invoices` : 'Collect team hours'}
        </h2>
        {detail && <p className="pt-0.5 text-small text-ink-muted">{detail}</p>}
      </div>
      <DarkLinkButton to="/review">Review</DarkLinkButton>
    </section>
  )
}
