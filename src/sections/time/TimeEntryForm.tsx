import { useState, type FormEvent, type Ref } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { Field, Select, SegmentedRadio, TextArea, TextInput } from '../../components/Field'
import { SectionHeading } from '../../components/SectionHeading'
import { uid, useDemo } from '../../components/DemoContext'
import { money, partner, type Entry } from '../../data/store'

const TREATMENTS = ['Billable', 'Nonbillable'] as const

/** "New time entry" form (Figma 36:1314). */
export function TimeEntryForm({ dateRef }: { dateRef?: Ref<HTMLInputElement> }) {
  const { store, update } = useDemo()
  const { projects } = store
  const rate = store.rates[partner.name]
  const [date, setDate] = useState('')
  const [projectId, setProjectId] = useState(projects[0].id)
  const [hours, setHours] = useState('')
  const [treatment, setTreatment] = useState<(typeof TREATMENTS)[number]>('Billable')
  const [description, setDescription] = useState('')

  function save(status: Entry['status']) {
    update((s) => {
      s.entries.push({
        id: uid(),
        date,
        employee: partner.name,
        projectId,
        hours: Number(hours),
        rate,
        description,
        billable: treatment === 'Billable',
        status,
        source: 'Direct',
      })
      s.audit.unshift(`${partner.name} ${status === 'Submitted' ? 'submitted' : 'saved'} a direct time entry`)
    })
    setDate('')
    setHours('')
    setDescription('')
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    save(submitter?.value === 'draft' ? 'Draft' : 'Submitted')
  }

  return (
    <form onSubmit={onSubmit} aria-labelledby="new-entry" className="rounded-16 border border-line bg-surface p-5">
      <SectionHeading id="new-entry" title="New time entry" description="Choose from assigned projects to keep names consistent." />

      <div className="grid grid-cols-2 gap-3.5 pt-2.5">
        <Field label="Date" htmlFor="entry-date">
          <TextInput id="entry-date" ref={dateRef} type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Project" htmlFor="entry-project">
          <Select id="entry-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Hours worked" htmlFor="entry-hours">
          <TextInput
            id="entry-hours"
            type="number"
            inputMode="decimal"
            min="0.1"
            max="24"
            step="0.1"
            required
            placeholder="0.0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </Field>
        <div className="flex flex-col gap-1.5">
          <span id="entry-treatment" className="text-8 font-semibold text-ink-field">
            Billing treatment
          </span>
          <SegmentedRadio name="treatment" options={TREATMENTS} value={treatment} onChange={setTreatment} labelledBy="entry-treatment" />
        </div>
        <Field label="Task description" htmlFor="entry-description" className="col-span-2">
          <TextArea
            id="entry-description"
            required
            placeholder="What did you work on? Be specific enough for the client."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </div>

      <div className="pt-4">
        <div className="flex items-center gap-2 border-t border-line-footer pt-3.5">
          <p className="flex-1 text-8 text-ink-muted">
            Rate applied by work date: <b className="font-bold">{money(rate)}/hr</b>
          </p>
          <OutlineButton type="submit" value="draft">
            Save draft
          </OutlineButton>
          <DarkButton type="submit" value="submit">
            Save &amp; submit
          </DarkButton>
        </div>
      </div>
    </form>
  )
}
