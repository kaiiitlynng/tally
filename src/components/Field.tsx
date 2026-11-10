import type { ComponentProps, ReactNode } from 'react'
import { Icon } from './Icon'

const CONTROL =
  'w-full rounded-sm border border-line-field bg-white text-body text-ink shadow-card transition-[border-color,box-shadow] duration-150 placeholder:text-ink-placeholder hover:border-ink-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-accent/25 aria-invalid:border-error-line aria-invalid:bg-error-soft'

/** Error / caution line under a field (prototype code layer .field-error / .field-warning). */
export function FieldMessage({ tone, id, children }: { tone: 'error' | 'caution'; id?: string; children: ReactNode }) {
  return (
    <span id={id} role={tone === 'error' ? 'alert' : undefined} className={`flex items-start gap-1.5 text-caption font-medium ${tone === 'error' ? 'text-error-ink' : 'text-caution-ink'}`}>
      <Icon name={tone === 'error' ? 'warning-error' : 'warning-caution'} size={13} className="mt-px" />
      {children}
    </span>
  )
}

interface FieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
  className?: string
  error?: string
  warnings?: string[]
}

/** Label + control stack (Figma "Label", e.g. 36:1325) with optional validation messages. */
export function Field({ label, htmlFor, children, className, error, warnings = [] }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <label htmlFor={htmlFor} className="text-small font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <FieldMessage tone="error" id={htmlFor ? `${htmlFor}-error` : undefined}>
          {error}
        </FieldMessage>
      )}
      {warnings.map((w) => (
        <FieldMessage key={w} tone="caution">
          {w}
        </FieldMessage>
      ))}
    </div>
  )
}

export function TextInput(props: ComponentProps<'input'>) {
  return <input {...props} className={`h-10 px-3 ${CONTROL} ${props.className ?? ''}`} />
}

export function TextArea(props: ComponentProps<'textarea'>) {
  return <textarea {...props} className={`h-24 min-h-24 resize-y px-3 py-2.5 ${CONTROL} ${props.className ?? ''}`} />
}

/** Native select styled as the Figma dropdown (36:1331), with the exported chevron. 37.5px in Figma → 38px. */
export function Select({ children, className, ...props }: ComponentProps<'select'>) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <select {...props} className={`h-10 appearance-none pr-9 pl-3 ${CONTROL}`}>
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 grid w-5 place-items-center pr-2.5">
        <Icon name="chevron-down" width={10} height={6} />
      </span>
    </div>
  )
}

/** Two-option segmented radio group (Figma "Billing treatment", 36:1344). */
export function SegmentedRadio<T extends string>({
  name,
  options,
  value,
  onChange,
  labelledBy,
}: {
  name: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  labelledBy: string
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex rounded-sm border border-line bg-toggle p-0.75">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex h-8 flex-1 cursor-pointer items-center justify-center rounded-xs text-small font-semibold transition-[background-color,color,box-shadow] duration-150 has-focus-visible:outline-2 has-focus-visible:outline-accent ${
            value === opt ? 'bg-white text-brand shadow-segment' : 'text-ink-field hover:text-ink'
          }`}
        >
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="sr-only" />
          {opt}
        </label>
      ))}
    </div>
  )
}
