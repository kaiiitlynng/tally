import { useNavigate } from 'react-router'
import { DarkButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { PageTitle } from '../components/PageTitle'
import { projectOutline } from '../data/progress'
import { completeness, currentPeriod, isFinal, periodRange } from '../data/store'

/**
 * Ready for Review (was "Review Invoices", Figma 36:5983), as compact white cards (owner request 2026-11-10)
 * outlined in each project's Clients & Projects color: project and billing period, then Review. Projects
 * still missing time (Clients & Projects flags them) and invoices already approved (Approved Invoices) aren't listed.
 * The whole card opens the review; the button stays the keyboard target.
 */
export default function ReviewInvoices() {
  const { store } = useDemo()
  const navigate = useNavigate()
  const ready = store.projects.filter((p) => completeness(store, p.id) !== 'Time missing' && !isFinal(store.invoiceStatus[p.id]))

  return (
    <>
      <PageTitle title="Ready for Review" />
      {ready.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,15.5rem)] gap-3.5 pt-6">
          {ready.map((p) => {
            return (
              <article key={p.id} onClick={() => navigate(`/review/${p.id}`)} className={`flex cursor-pointer flex-col rounded-lg border-2 bg-surface p-4 shadow-card card-lift ${projectOutline(p.id)}`}>
                <h2 className="line-clamp-2 text-title-sm font-semibold tracking-title text-ink">{p.name}</h2>
                <p className="pt-0.5 text-caption whitespace-nowrap text-ink-muted">{periodRange(currentPeriod, false)}</p>
                {/* Cards in a row share a height; mt-auto keeps every Review button on the same line. */}
                <div className="mt-auto pt-5">
                  <DarkButton
                    className="h-9 w-36 text-small"
                    arrow
                    aria-label={`Review ${p.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/review/${p.id}`)
                    }}
                  >
                    Review
                  </DarkButton>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="pt-6 text-small text-ink-muted">No invoices are ready yet.</p>
      )}
    </>
  )
}
