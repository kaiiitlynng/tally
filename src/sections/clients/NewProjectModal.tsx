import { useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { uid, useDemo } from '../../components/DemoContext'
import { Field, Select, TextInput } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'

const TITLES = ['Client information', 'Project details', 'Billing configuration']
const CATEGORIES = ['Consulting', 'Accounting and advisory', 'Legal services', 'Engineering', 'Creative agency']

/** Three-step "New Project" flow (prototype code layer; not drawn in Figma). */
export function NewProjectModal({ onClose, onCreated, initialName = '' }: { onClose: () => void; onCreated: (id: string) => void; initialName?: string }) {
  const { update } = useDemo()
  const [step, setStep] = useState(1)
  const [missing, setMissing] = useState<string[]>([])
  const [form, setForm] = useState({
    client: '',
    name: initialName,
    code: '2025-022',
    type: 'Consulting',
    contact: '',
    email: '',
    address: '',
    deadline: 'June 3',
  })
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  function next() {
    // The prototype silently refuses to save without a client and project name; say why instead.
    const required = step === 1 ? (!form.client.trim() ? ['client'] : []) : step === 2 ? (!form.name.trim() ? ['name'] : []) : []
    setMissing(required)
    if (required.length) return document.getElementById(`np-${required[0]}`)?.focus()
    if (step < 3) return setStep(step + 1)
    const id = uid()
    update((s) => {
      s.projects.push({ ...form, id, people: ['Vanessa Hart', 'Nora Chen'], reviewer: 'Vanessa Hart', status: 'Active' })
      s.invoiceStatus[id] = 'Draft'
      s.audit.unshift(`Vanessa created ${form.name}`)
    })
    onCreated(id)
  }

  return (
    <Modal
      size="lg"
      eyebrow={`Step ${step} of 3`}
      title={TITLES[step - 1]}
      onClose={onClose}
      footer={
        <>
          {step > 1 && <OutlineButton onClick={() => setStep(step - 1)}>Back</OutlineButton>}
          <DarkButton onClick={next}>
            {step < 3 ? 'Continue' : 'Create project'}
          </DarkButton>
        </>
      }
    >
      <div className="mt-3 mb-6 flex gap-1.25" aria-hidden="true">
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
            <Select id="np-type" value={form.type} onChange={(e) => set({ type: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <div className="col-span-2 flex flex-col gap-1.5">
            <span className="text-small font-semibold text-ink">Assigned employees</span>
            <div className="rounded-md border border-line-field bg-white p-2.75 text-small">Nora Chen, Vanessa Hart</div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Billing frequency" htmlFor="np-frequency">
            <Select id="np-frequency">
              <option>Monthly</option>
              <option>Biweekly</option>
              <option>Project milestone</option>
            </Select>
          </Field>
          <Field label="Invoice template" htmlFor="np-template">
            <Select id="np-template">
              <option>Professional services</option>
              <option>Detailed project</option>
            </Select>
          </Field>
          <Field label="Time due" htmlFor="np-deadline">
            <TextInput id="np-deadline" value={form.deadline} onChange={(e) => set({ deadline: e.target.value })} />
          </Field>
          <Field label="Rate policy" htmlFor="np-rates">
            <Select id="np-rates">
              <option>Use standard firm rates</option>
              <option>Custom project rates</option>
            </Select>
          </Field>
          <div className="col-span-2 flex items-center gap-2.5 rounded-md bg-rate-note p-3 text-done-ink">
            <Icon name="check-rate" size={18} />
            <span>
              <b className="block text-small font-semibold">Standard rates will apply by work date</b>
              <small className="mt-0.75 block text-caption">Historical entries keep the rate effective when work occurred.</small>
            </span>
          </div>
        </div>
      )}
    </Modal>
  )
}
