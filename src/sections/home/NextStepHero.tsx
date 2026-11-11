import { DarkLinkButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { invoicesNeedingReview } from '../../data/store'

/** "Your next step" (Figma 36:48), as a compact card under Home's primary actions. Stats and body copy removed (owner, 2026-11-10). */
export function NextStepHero() {
  const { store } = useDemo()
  const review = invoicesNeedingReview(store)

  return (
    <section aria-labelledby="next-step-title" className="flex items-center justify-between gap-6 rounded-lg border border-line bg-surface px-6 py-5 shadow-card">
      <h2 id="next-step-title" className="text-title-sm font-semibold tracking-title text-ink">
        {review ? `Review ${review} invoices` : 'Collect team hours'}
      </h2>
      <DarkLinkButton to="/review">Review</DarkLinkButton>
    </section>
  )
}
