import { Icon } from '../../components/Icon'

type StepState = 'done' | 'current' | 'upcoming'

const STEPS: { label: string; state: StepState }[] = [
  { label: 'Set up projects', state: 'done' },
  { label: 'Collect time', state: 'done' },
  { label: 'Tally prepares', state: 'done' },
  { label: 'Review', state: 'current' },
  { label: 'Approve & export', state: 'upcoming' },
]

const DOT: Record<StepState, string> = {
  done: 'border-success-line bg-success-soft',
  current: 'border-brand bg-brand text-white ring-4 ring-brand-50',
  upcoming: 'border-line-step bg-step-idle text-ink-dim',
}

/** Five-step billing progress tracker (Figma 36:86). */
export function Workflow() {
  return (
    <section aria-label="Billing progress" className="rounded-lg border border-line bg-surface shadow-card">
      <ol className="relative flex px-5 pt-5 pb-5">
        {/* Connector runs between the first and last step centres (Figma: 10% inset each side). */}
        <li aria-hidden="true" className="absolute inset-x-[10%] top-8.25 h-0.5 rounded-pill bg-line-track" />
        {/* Filled portion of the track up to the current step (3 of 4 gaps), drawn in on load. */}
        <li aria-hidden="true" className="absolute top-8.25 left-[10%] h-0.5 w-[60%] origin-left animate-grow rounded-pill bg-success-line" />
        {STEPS.map((step, i) => (
          <li
            key={step.label}
            aria-current={step.state === 'current' ? 'step' : undefined}
            className="relative flex flex-1 flex-col items-center gap-2"
          >
            <span className={`relative grid size-7 place-items-center rounded-full border text-caption font-semibold ${DOT[step.state]}`}>
              {step.state === 'current' && (
                <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-brand opacity-30 motion-reduce:hidden" />
              )}
              {step.state === 'done' ? <Icon name="check-green" size={14} /> : i + 1}
            </span>
            <span className={`text-small ${step.state === 'current' ? 'font-semibold text-brand' : 'font-medium text-ink-dim'}`}>
              {step.label}
              {step.state === 'done' && <span className="sr-only"> (done)</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
