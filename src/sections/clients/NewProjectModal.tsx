import { useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { uid, useDemo } from '../../components/DemoContext'
import { Field, FieldMessage, Select, TextInput } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import { timesheetDueLabel } from '../../data/store'

export const NEW_PROJECT_STEPS = ['Client information', 'Project details', 'Billing']
const CATEGORIES = ['Consulting', 'Accounting and advisory', 'Legal services', 'Engineering', 'Creative agency']
const FREQUENCIES = ['Monthly', 'Biweekly', 'Project milestone']
const TEMPLATES = ['Professional services', 'Detailed project']
/** Select value that reveals a free-text field. */
const OTHER = '__other'
const UPLOAD = '__upload'

/**
 * Three-step "New Project" flow (prototype code layer; not drawn in Figma). Owner additions (2026-11-10): pick
 * the assigned employees, "Other…" with free text for category and billing frequency, upload a custom invoice
 * template (kept as a file name only; nothing is uploaded), and per-person rates for "Custom project rates".
 */
export function NewProjectModal({ onClose, onCreated, initialName = '' }: { onClose: () => void; onCreated: (id: string) => void; initialName?: string }) {
  const { store, update, me } = useDemo()
  const team = store.team.map((m) => m.name)
  const [step, setStep] = useState(1)
  const [missing, setMissing] = useState<string[]>([])
  const [form, setForm] = useState({
    client: '',
    name: initialName,
    code: '2025-022',
    category: CATEGORIES[0],
    otherCategory: '',
    contact: '',
    email: '',
    address: '',
    deadline: timesheetDueLabel,
    frequency: FREQUENCIES[0],
    otherFrequency: '',
    template: TEMPLATES[0],
    templateFile: '',
    customRates: false,
  })
  // The partner reviews every project, so they're always assigned; everyone else is a choice.
  const [people, setPeople] = useState<string[]>(() => [me.name, ...team.filter((n) => n === 'Nora Chen')])
  const [rates, setRates] = useState<Record<string, string>>({})
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  const category = form.category === OTHER ? form.otherCategory.trim() : form.category
  const frequency = form.frequency === OTHER ? form.otherFrequency.trim() : form.frequency
  const template = form.template === UPLOAD ? form.templateFile : form.template

  function check(): string[] {
    if (step === 1) return form.client.trim() ? [] : ['client']
    if (step === 2) return [!form.name.trim() && 'name', form.category === OTHER && !category && 'otherCategory'].filter(Boolean) as string[]
    return [
      form.frequency === OTHER && !frequency && 'otherFrequency',
      form.template === UPLOAD && !form.templateFile && 'templateFile',
      ...(form.customRates ? people.filter((p) => !(Number(rates[p]) > 0)).map((p) => `rate-${p}`) : []),
    ].filter(Boolean) as string[]
  }

  function next() {
    const required = check()
    setMissing(required)
    if (required.length) return document.getElementById(`np-${required[0]}`)?.focus()
    if (step < 3) return setStep(step + 1)
    const id = uid()
    update((s) => {
      s.projects.push({
        id,
        client: form.client,
        name: form.name,
        code: form.code,
        type: category,
        contact: form.contact,
        email: form.email,
        address: form.address,
        deadline: form.deadline,
        people,
        reviewer: me.name,
        status: 'Active',
        frequency,
        template,
        customRates: form.customRates ? Object.fromEntries(people.map((p) => [p, Number(rates[p])])) : undefined,
      })
      s.invoiceStatus[id] = 'Draft'
      s.audit.unshift(`${me.firstName} created ${form.name}`)
    })
    onCreated(id)
  }

  return (
    <Modal
      size="lg"
      title={NEW_PROJECT_STEPS[step - 1]}
      onClose={onClose}
      footer={
        <>
          {step > 1 && <OutlineButton onClick={() => setStep(step - 1)}>Back</OutlineButton>}
          <DarkButton onClick={next}>{step < 3 ? 'Continue' : 'Create project'}</DarkButton>
        </>
      }
    >
      <div className="mb-6 flex gap-1.25" role="img" aria-label={`Step ${step} of 3`}>
        {[1, 2, 3].map((n) => (
          <i key={n} className={`h-0.75 flex-1 rounded-full ${n <= step ? 'bg-orange' : 'bg-step-track'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Client or organization" htmlFor="np-client" className="col-span-2" error={missing.includes('client') ? 'Please enter the client name.' : undefined}>
            <TextInput id="np-client" autoFocus aria-invalid={missing.includes('client')} value={form.client} onChange={(e) => set({ client: e.target.value })} placeholder="e.g. Beacon Engineering" />
          </Field>
          <Field label="Billing contact" htmlFor="np-contact">
            <TextInput id="np-contact" value={form.contact} onChange={(e) => set({ contact: e.target.value })} placeholder="Full name" />
          </Field>
          <Field label="Billing email" htmlFor="np-email">
            <TextInput id="np-email" type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="billing@example.com" />
          </Field>
          <Field label="Billing address" htmlFor="np-address" className="col-span-2">
            <TextInput id="np-address" value={form.address} onChange={(e) => set({ address: e.target.value })} placeholder="Street, city, state, ZIP" />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Project name" htmlFor="np-name" className="col-span-2" error={missing.includes('name') ? 'Please enter a project name.' : undefined}>
            <TextInput id="np-name" autoFocus aria-invalid={missing.includes('name')} value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Structural design review" />
          </Field>
          <Field label="Project identifier" htmlFor="np-code">
            <TextInput id="np-code" value={form.code} onChange={(e) => set({ code: e.target.value })} />
          </Field>
          <Field label="Category" htmlFor="np-type">
            <Select id="np-type" value={form.category} onChange={(e) => set({ category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
              <option value={OTHER}>Other…</option>
            </Select>
          </Field>
          {form.category === OTHER && (
            <Field label="Custom category" htmlFor="np-otherCategory" className="col-span-2" error={missing.includes('otherCategory') ? 'Please name the category.' : undefined}>
              <TextInput id="np-otherCategory" autoFocus value={form.otherCategory} aria-invalid={missing.includes('otherCategory')} onChange={(e) => set({ otherCategory: e.target.value })} placeholder="e.g. Expert witness" />
            </Field>
          )}
          <fieldset className="col-span-2">
            <legend className="text-small font-semibold text-ink">Assigned employees</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {team.map((person) => {
                const on = people.includes(person)
                const locked = person === me.name
                return (
                  <label
                    key={person}
                    className={`flex h-9 items-center gap-1.5 rounded-pill border px-3.5 text-small font-medium transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                      on ? 'border-brand bg-brand-50 text-brand' : 'border-line bg-white text-ink hover:border-brand-200 hover:bg-hover'
                    } ${locked ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      disabled={locked}
                      onChange={() => setPeople(on ? people.filter((p) => p !== person) : [...people, person])}
                    />
                    {on && <Icon tint name="check-sort" size={12} />}
                    {person}
                    {locked && <span className="text-caption text-ink-muted">(reviewer)</span>}
                  </label>
                )
              })}
            </div>
          </fieldset>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Billing frequency" htmlFor="np-frequency">
            <Select id="np-frequency" value={form.frequency} onChange={(e) => set({ frequency: e.target.value })}>
              {FREQUENCIES.map((f) => (
                <option key={f}>{f}</option>
              ))}
              <option value={OTHER}>Other…</option>
            </Select>
          </Field>
          <Field label="Invoice template" htmlFor="np-template">
            <Select id="np-template" value={form.template} onChange={(e) => set({ template: e.target.value })}>
              {TEMPLATES.map((t) => (
                <option key={t}>{t}</option>
              ))}
              <option value={UPLOAD}>Upload custom template…</option>
            </Select>
          </Field>
          {form.frequency === OTHER && (
            <Field label="Custom frequency" htmlFor="np-otherFrequency" className="col-span-2" error={missing.includes('otherFrequency') ? 'Please describe the billing frequency.' : undefined}>
              <TextInput id="np-otherFrequency" value={form.otherFrequency} aria-invalid={missing.includes('otherFrequency')} onChange={(e) => set({ otherFrequency: e.target.value })} placeholder="e.g. Quarterly" />
            </Field>
          )}
          {form.template === UPLOAD && (
            <div className="col-span-2">
              <label htmlFor="np-templateFile" className="text-small font-semibold text-ink">
                Template file
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-sm border border-line bg-surface px-4 text-small font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-hover has-focus-visible:outline-2 has-focus-visible:outline-accent">
                  <Icon name="upload-dark" size={16} /> Choose file
                  <input
                    id="np-templateFile"
                    type="file"
                    accept=".docx,.pdf,.xlsx"
                    className="sr-only"
                    onChange={(e) => set({ templateFile: e.target.files?.[0]?.name ?? '' })}
                  />
                </label>
                <span className="truncate text-small text-ink-muted">{form.templateFile || 'Word, PDF or Excel'}</span>
              </div>
              {missing.includes('templateFile') && <FieldMessage tone="error">Please choose a template file.</FieldMessage>}
            </div>
          )}
          <Field label="Time due" htmlFor="np-deadline">
            <TextInput id="np-deadline" value={form.deadline} onChange={(e) => set({ deadline: e.target.value })} />
          </Field>
          <Field label="Rate policy" htmlFor="np-rates">
            <Select id="np-rates" value={form.customRates ? 'custom' : 'standard'} onChange={(e) => set({ customRates: e.target.value === 'custom' })}>
              <option value="standard">Use standard firm rates</option>
              <option value="custom">Custom project rates</option>
            </Select>
          </Field>
          {form.customRates ? (
            <fieldset className="col-span-2">
              <legend className="text-small font-semibold text-ink">Hourly rate on this project</legend>
              <div className="mt-1.5 grid grid-cols-2 gap-2.5">
                {people.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-small text-ink">
                    <span className="w-28 truncate">{p}</span>
                    <span aria-hidden="true">$</span>
                    <input
                      id={`np-rate-${p}`}
                      type="number"
                      min="0"
                      inputMode="decimal"
                      aria-label={`${p} hourly rate on this project`}
                      aria-invalid={missing.includes(`rate-${p}`)}
                      value={rates[p] ?? ''}
                      onChange={(e) => setRates({ ...rates, [p]: e.target.value })}
                      placeholder={String(store.rates[p] ?? '')}
                      className="h-9 w-24 rounded-sm border border-line-field bg-white px-2 text-small focus:outline-2 focus:outline-accent aria-invalid:border-error-line"
                    />
                  </label>
                ))}
              </div>
              {missing.some((m) => m.startsWith('rate-')) && <FieldMessage tone="error">Enter an hourly rate above zero for everyone assigned.</FieldMessage>}
            </fieldset>
          ) : (
            <div className="col-span-2 flex items-center gap-2.5 rounded-md bg-rate-note p-3 text-done-ink">
              <Icon name="check-rate" size={18} />
              <b className="text-small font-semibold">Standard rates will apply by work date</b>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
