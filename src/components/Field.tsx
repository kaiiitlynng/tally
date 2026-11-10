import type { ComponentProps, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Icon } from './Icon'

const CONTROL =
  'w-full rounded-10 border border-line-field bg-white text-10 font-semibold text-ink placeholder:text-ink-placeholder focus:border-ink-field focus:outline-2 focus:outline-offset-1 focus:outline-dark/20'

/** Label + control stack (Figma "Label", e.g. 36:1325). */
export function Field({ label, htmlFor, children, className }: { label: string; htmlFor?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <label htmlFor={htmlFor} className="text-8 font-semibold text-ink-field">
        {label}
      </label>
      {children}
    </div>
  )
}

export function TextInput(props: ComponentProps<'input'>) {
  return <input {...props} className={`h-9.75 px-2.75 ${CONTROL} ${props.className ?? ''}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`h-21.25 min-h-21.25 resize-y p-2.75 leading-[15px] ${CONTROL} ${props.className ?? ''}`} />
}

/** Native select styled as the Figma dropdown (36:1331), with the exported chevron. */
export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={`h-9.5 appearance-none pr-8 pl-3.75 ${CONTROL}`}>
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
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex rounded-10 border border-line-field bg-toggle p-0.75">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex h-6.5 flex-1 cursor-pointer items-center justify-center rounded-7 text-8 font-semibold text-ink-field has-focus-visible:outline-2 has-focus-visible:outline-dark ${
            value === opt ? 'bg-white drop-shadow-toggle' : 'hover:text-ink'
          }`}
        >
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="sr-only" />
          {opt}
        </label>
      ))}
    </div>
  )
}
