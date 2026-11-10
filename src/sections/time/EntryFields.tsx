import { Field, SegmentedRadio, Select, TextArea, TextInput } from '../../components/Field'
import type { EntryForm, EntryWarning, FormErrors, Project } from '../../data/store'

const TREATMENTS = ['Billable', 'Nonbillable'] as const

interface EntryFieldsProps {
  idPrefix: string
  form: EntryForm
  onChange: (patch: Partial<EntryForm>, field?: keyof FormErrors) => void
  errors: FormErrors
  warnings: EntryWarning[]
  projects: Project[]
}

/** Date / Project / Hours / Billing treatment / Description grid (Figma 36:1324). */
export function EntryFields({ idPrefix, form, onChange, errors, warnings, projects }: EntryFieldsProps) {
  const warn = (field: EntryWarning['field']) => warnings.filter((w) => w.field === field).map((w) => w.message)
  const id = (name: string) => `${idPrefix}-${name}`

  return (
    <div className="grid grid-cols-2 gap-3.5">
      <Field label="Date" htmlFor={id('date')} warnings={warn('date')}>
        <TextInput id={id('date')} type="date" value={form.date} onChange={(e) => onChange({ date: e.target.value })} />
      </Field>
      <Field label="Project" htmlFor={id('project')} error={errors.projectId}>
        <Select
          id={id('project')}
          aria-invalid={Boolean(errors.projectId)}
          aria-describedby={errors.projectId ? `${id('project')}-error` : undefined}
          value={form.projectId}
          onChange={(e) => onChange({ projectId: e.target.value }, 'projectId')}
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Hours worked" htmlFor={id('hours')} error={errors.hours} warnings={warn('hours')}>
        <TextInput
          id={id('hours')}
          inputMode="decimal"
          placeholder="0.0"
          aria-invalid={Boolean(errors.hours)}
          aria-describedby={errors.hours ? `${id('hours')}-error` : undefined}
          value={form.hours}
          onChange={(e) => onChange({ hours: e.target.value }, 'hours')}
        />
      </Field>
      <div className="flex flex-col gap-1.5">
        <span id={id('treatment')} className="text-small font-semibold text-ink">
          Billing treatment
        </span>
        <SegmentedRadio
          name={id('treatment')}
          options={TREATMENTS}
          value={form.billable ? 'Billable' : 'Nonbillable'}
          onChange={(v) => onChange({ billable: v === 'Billable' })}
          labelledBy={id('treatment')}
        />
      </div>
      <Field label="Task description" htmlFor={id('description')} className="col-span-2" error={errors.description} warnings={warn('description')}>
        <TextArea
          id={id('description')}
          placeholder="What did you work on? Be specific enough for the client."
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? `${id('description')}-error` : undefined}
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value }, 'description')}
        />
      </Field>
    </div>
  )
}

/** Focus the first invalid field (Project → Hours → Description), as the prototype does. */
export function focusFirstError(idPrefix: string, errors: FormErrors) {
  const target = errors.projectId ? 'project' : errors.hours ? 'hours' : errors.description ? 'description' : null
  if (target) window.setTimeout(() => document.getElementById(`${idPrefix}-${target}`)?.focus())
}
