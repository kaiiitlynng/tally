import { DarkLinkButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Pill } from '../../components/Pill'
import { invoicesNeedingReview } from '../../data/store'

/** "Your next step" hero card (Figma 36:48). */
export function NextStepHero() {
  const { store } = useDemo()
  const review = invoicesNeedingReview(store)
  const stats = [
    { value: String(review).padStart(2, '0'), label: 'need review' },
    { value: '01', label: 'timesheet missing' },
    { value: '02', label: 'ready for billing' },
  ]

  return (
    <section
      aria-labelledby="next-step-title"
      className="flex min-h-47.5 items-center justify-between gap-8 rounded-22 border border-hero-line bg-hero px-7.5 py-7 drop-shadow-hero"
    >
      <div className="max-w-155">
        <div className="pt-0.5">
          <Pill tone="accent">Your next step</Pill>
        </div>
        <h2 id="next-step-title" className="pt-3.5 text-28 font-medium tracking-title text-ink">
          {review ? `Review ${review} invoices` : 'Collect team hours'}
        </h2>
        <p className="pt-1.75 pb-4.5 text-11 text-hero-ink">
          May time is nearly complete. Resolve the two Montrose questions, then approve the client-ready invoice.
        </p>
        <DarkLinkButton to="/review">Review invoices</DarkLinkButton>
      </div>

      <dl className="flex shrink-0 gap-1.25">
        {stats.map((s) => (
          <div key={s.label} className="flex min-w-26.25 flex-col-reverse items-center border-l border-line-stat px-2.5 py-4.5">
            <dt className="text-8 text-hero-stat-ink">{s.label}</dt>
            <dd className="font-display text-30 font-bold tracking-stat text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
