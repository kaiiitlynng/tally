import { DarkLinkButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { completeness, invoicesNeedingReview, overduePeople } from '../../data/store'

/** "Your next step" hero card (Figma 36:48), with the stripe-design ribbon drifting behind the stats. */
export function NextStepHero() {
  const { store } = useDemo()
  const review = invoicesNeedingReview(store)
  const stats = [
    { value: review, label: 'need review' },
    { value: overduePeople(store).length, label: 'timesheet missing' },
    { value: store.projects.filter((p) => completeness(store, p.id) === 'Complete').length, label: 'ready for billing' },
  ]

  return (
    <section
      aria-labelledby="next-step-title"
      className="relative isolate flex min-h-48 items-center justify-between gap-8 overflow-hidden rounded-xl border border-hero-line bg-hero px-8 py-8 shadow-hero"
    >
      {/* Decorative: two ribbons, the second offset and fainter, slowly drifting (paused for reduced motion). */}
      <span aria-hidden="true" className="pointer-events-none absolute -top-24 -right-32 -z-10 h-44 w-200 origin-center animate-ribbon ribbon" />
      <span aria-hidden="true" className="pointer-events-none absolute top-20 -right-48 -z-10 h-24 w-200 origin-center animate-ribbon ribbon opacity-50 [animation-delay:-8s]" />

      <div className="max-w-140">
        <h2 id="next-step-title" className="text-title-lg font-semibold tracking-title text-ink">
          {review ? `Review ${review} invoices` : 'Collect team hours'}
        </h2>
        <p className="pt-2 pb-6 text-lead text-hero-ink">
          May time is nearly complete. Resolve the two Montrose questions, then approve the client-ready invoice.
        </p>
        <DarkLinkButton to="/review">Review invoices</DarkLinkButton>
      </div>

      <dl className="flex shrink-0 divide-x divide-line rounded-lg border border-line bg-surface shadow-raised">
        {stats.map((s) => (
          <div key={s.label} className="flex min-w-30 flex-col-reverse items-center gap-1 px-4 py-5">
            <dt className="text-caption font-medium text-hero-stat-ink">{s.label}</dt>
            <dd className="font-display text-display font-bold tracking-stat text-brand">{String(s.value).padStart(2, '0')}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
