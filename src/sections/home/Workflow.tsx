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
  current: 'border-dark bg-dark text-white',
  upcoming: 'border-line-step bg-step-idle text-ink-dim',
}

/** Five-step billing progress tracker (Figma 36:86). */
export function Workflow() {
  return (
    <section aria-label="Billing progress" className="rounded-15 border border-line bg-surface">
      <ol className="relative flex px-5 pt-4.75 pb-5">
        {/* Connector runs between the first and last step centres (Figma: 10% inset each side). */}
        <li aria-hidden="true" className="absolute inset-x-[10%] top-7.75 h-px bg-line-track" />
        {STEPS.map((step, i) => (
          <li
            key={step.label}
            aria-current={step.state === 'current' ? 'step' : undefined}
            className="relative flex flex-1 flex-col items-center gap-2"
          >
            <span className={`grid size-6.25 place-items-center rounded-full border text-8 ${DOT[step.state]}`}>
              {step.state === 'done' ? <Icon name="check-green" size={13} /> : i + 1}
            </span>
            <span className={`text-9 ${step.state === 'current' ? 'font-semibold text-ink' : 'font-medium text-ink-dim'}`}>
              {step.label}
              {step.state === 'done' && <span className="sr-only"> (done)</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
