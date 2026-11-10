import { useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { SectionHeading } from '../../components/SectionHeading'
import { useCommitEntry } from '../../hooks/useCommitEntry'
import { entryWarnings, money, periodDefaultDate, validateEntry, type EntryForm, type EntryWarning, type FormErrors } from '../../data/store'
import { EntryFields, focusFirstError } from './EntryFields'
import { WarningConfirm } from './WarningConfirm'

const ID = 'entry'

/**
 * "New time entry" (Figma 36:1314 partner, 36:12790 employee). Validation and soft warnings are
 * ported from the prototype code layer; Figma only shows the empty form.
 */
export function TimeEntryForm({ initialProjectId, onSaved }: { initialProjectId?: string; onSaved: (message: string) => void }) {
  const { store, role, me, period } = useDemo()
  const commit = useCommitEntry()
  const projects = store.projects.filter((p) => role === 'partner' || p.people.includes(me.name))

  const blank = (): EntryForm => ({
    date: role === 'employee' ? periodDefaultDate(period) : '2025-05-28',
    projectId: initialProjectId ?? projects[0]?.id ?? '',
    hours: '',
    description: '',
    billable: true,
  })

  const [form, setForm] = useState<EntryForm>(blank)
  const [errors, setErrors] = useState<FormErrors>({})
  const [warnings, setWarnings] = useState<EntryWarning[]>([])
  const [pendingSubmit, setPendingSubmit] = useState(false)

  function finish(submit: boolean, acknowledged: EntryWarning[]) {
    commit(form, submit, acknowledged)
    onSaved(submit ? 'Time entry submitted successfully.' : 'Draft saved. You can finish it later.')
    setForm(blank())
    setErrors({})
    setWarnings([])
  }

  function save(submit: boolean) {
    const next = validateEntry(form)
    setErrors(next)
    if (Object.keys(next).length) {
      setWarnings([])
      focusFirstError(ID, next)
      return
    }
    const w = entryWarnings(form, store.entries, me.name, store.threshold)
    if (w.length) {
      setWarnings(w)
      setPendingSubmit(submit)
      return
    }
    finish(submit, [])
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
        save(submitter?.value !== 'draft')
      }}
      aria-labelledby="new-entry"
      className="rounded-16 border border-line bg-surface p-5"
    >
      <SectionHeading id="new-entry" title="New time entry" description="Choose from assigned projects to keep names consistent." />
      <div className="pt-2.5">
        <EntryFields
          idPrefix={ID}
          form={form}
          projects={projects}
          errors={errors}
          warnings={warnings}
          onChange={(patch, field) => {
            setForm((f) => ({ ...f, ...patch }))
            if (field) setErrors((e) => ({ ...e, [field]: undefined }))
            if (field === 'hours' || field === 'description') setWarnings([])
          }}
        />
      </div>

      {warnings.length > 0 && (
        <WarningConfirm title="Want to double-check this entry?">
          <OutlineButton
            onClick={() => {
              setWarnings([])
              document.getElementById(`${ID}-description`)?.focus()
            }}
          >
            Edit entry
          </OutlineButton>
          <DarkButton onClick={() => finish(pendingSubmit, warnings)}>Confirm it’s correct</DarkButton>
        </WarningConfirm>
      )}

      <div className="pt-4">
        <div className="flex items-center gap-2 border-t border-line-footer pt-3.5">
          <p className="flex-1 text-8 text-ink-muted">
            Rate applied by work date: <b className="font-bold">{money(store.rates[me.name])}/hr</b>
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
