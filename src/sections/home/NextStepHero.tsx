import { DarkLinkButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { completeness, invoicesNeedingReview, overduePeople } from '../../data/store'

/** "Your next step" (Figma 36:48), as a compact card under Home's primary actions. */
export function NextStepHero() {
  const { store } = useDemo()
  const review = invoicesNeedingReview(store)
  const stats = [
    { value: review, label: 'need review' },
    { value: overduePeople(store).length, label: 'timesheet missing' },
    { value: store.projects.filter((p) => completeness(store, p.id) === 'Complete').length, label: 'ready for billing' },
  ]

  return (
    <section aria-labelledby="next-step-title" className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-lg border border-line bg-surface px-6 py-5 shadow-card">
      <div className="min-w-0">
        <h2 id="next-step-title" className="text-title-sm font-semibold tracking-title text-ink">
          {review ? `Review ${review} invoices` : 'Collect team hours'}
        </h2>
        <p className="max-w-140 pt-1 text-small text-hero-ink">
          May time is nearly complete. Resolve the two Montrose questions, then approve the client-ready invoice.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-5">
        <dl className="flex divide-x divide-line">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse items-center px-3">
              <dt className="text-caption text-hero-stat-ink">{s.label}</dt>
              <dd className="font-display text-title font-bold tracking-stat-sm text-brand">{String(s.value).padStart(2, '0')}</dd>
            </div>
          ))}
        </dl>
        <DarkLinkButton to="/review">Review invoices</DarkLinkButton>
      </div>
    </section>
  )
}
