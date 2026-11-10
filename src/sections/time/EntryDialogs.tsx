import { useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { uid, useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { Dialog, Modal } from '../../components/Modal'
import { useCommitEntry } from '../../hooks/useCommitEntry'
import { entryWarnings, isFinal, validateEntry, type Entry, type EntryForm, type EntryWarning, type FormErrors } from '../../data/store'
import { EntryFields, focusFirstError } from './EntryFields'
import { WarningConfirm } from './WarningConfirm'

const ID = 'edit-entry'
const REVIEW_STATES = ['In review', 'Awaiting employee', 'Ready to approve']

/** "Edit Time Entry." dialog (prototype code layer; not drawn in Figma). */
export function EditEntryDialog({ entry, onClose, onSaved, onLocked }: { entry: Entry; onClose: () => void; onSaved: (msg: string) => void; onLocked: () => void }) {
  const { store, me } = useDemo()
  const commit = useCommitEntry()
  const [form, setForm] = useState<EntryForm>({
    date: entry.date,
    projectId: entry.projectId,
    hours: String(entry.hours),
    description: entry.description,
    billable: entry.billable,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [warnings, setWarnings] = useState<EntryWarning[]>(() =>
    REVIEW_STATES.includes(store.invoiceStatus[entry.projectId])
      ? [{ field: 'date', kind: 'Submitted period', message: 'This billing period has already been submitted. Your changes may need review.' }]
      : [],
  )

  function finish(acknowledged: EntryWarning[]) {
    if (commit(form, false, acknowledged, entry.id) === 'locked') return onLocked()
    onSaved('Time entry updated.')
  }

  function save() {
    const next = validateEntry(form)
    setErrors(next)
    if (Object.keys(next).length) {
      setWarnings([])
      return focusFirstError(ID, next)
    }
    const w = entryWarnings(form, store.entries, me.name, store.threshold, entry.id)
    if (w.length) return setWarnings(w)
    finish([])
  }

  return (
    <Modal
      size="lg"
      eyebrow="Existing time record"
      title="Edit Time Entry."
      onClose={onClose}
      footer={
        <>
          <OutlineButton onClick={onClose}>Cancel</OutlineButton>
          <DarkButton onClick={save}>Save Changes</DarkButton>
        </>
      }
    >
      <div className="mt-5.5 border-t border-line-mapping pt-5">
        <EntryFields
          idPrefix={ID}
          form={form}
          projects={store.projects.filter((p) => p.people.includes(me.name))}
          errors={errors}
          warnings={warnings}
          onChange={(patch, field) => {
            setForm((f) => ({ ...f, ...patch }))
            if (field) setErrors((e) => ({ ...e, [field]: undefined }))
            setWarnings([])
          }}
        />
      </div>
      {warnings.length > 0 && (
        <WarningConfirm title="Want to double-check these changes?">
          <DarkButton onClick={() => finish(warnings)}>Confirm it’s correct</DarkButton>
        </WarningConfirm>
      )}
    </Modal>
  )
}

function CenteredDialog({ icon, iconTile, title, children, actions, onClose }: { icon: string; iconTile: string; title: string; children: React.ReactNode; actions: React.ReactNode; onClose: () => void }) {
  return (
    <Dialog labelledBy="centered-dialog-title" onClose={onClose} className="w-110 rounded-xl p-8 text-center">
      <span className={`mx-auto mb-3.25 grid size-11 place-items-center rounded-full ${iconTile}`}>
        <Icon name={icon} size={18} />
      </span>
      <h2 id="centered-dialog-title" className="mb-1.75 text-title tracking-title font-semibold">
        {title}
      </h2>
      {children}
      <div className="mt-6 flex justify-end gap-2">{actions}</div>
    </Dialog>
  )
}

/** "Delete this time entry?" confirmation (prototype code layer). */
export function DeleteEntryDialog({ entry, onClose, onDeleted, onLocked }: { entry: Entry; onClose: () => void; onDeleted: (msg: string) => void; onLocked: () => void }) {
  const { store, update, me } = useDemo()

  function confirm() {
    const status = store.invoiceStatus[entry.projectId]
    if (isFinal(status)) return onLocked()
    update((s) => {
      s.entries = s.entries.filter((e) => e.id !== entry.id)
      s.flags = s.flags.filter((f) => f.entryId !== entry.id)
      if (REVIEW_STATES.includes(status)) {
        s.invoiceStatus[entry.projectId] = 'In review'
        s.messages.unshift({
          id: uid(),
          projectId: entry.projectId,
          entryId: entry.id,
          from: me.name,
          to: s.projects.find((p) => p.id === entry.projectId)?.reviewer ?? 'Vanessa Hart',
          subject: 'Time entry deleted during invoice review',
          body: `${me.name} removed a submitted entry. The affected invoice now needs re-review.`,
          time: 'Just now',
          unreadBy: ['partner'],
          status: 'Open',
          replies: [],
        })
      }
      s.audit.unshift(`${me.name} deleted time entry ${entry.id}; deletion retained in audit history`)
    })
    onDeleted('Time entry deleted.')
  }

  return (
    <CenteredDialog
      icon="close-delete"
      iconTile="bg-delete-soft"
      title="Delete this time entry?"
      onClose={onClose}
      actions={
        <>
          <OutlineButton onClick={onClose}>Cancel</OutlineButton>
          <button
            type="button"
            onClick={confirm}
            className="h-10 rounded-sm bg-delete px-4 text-body font-semibold text-white shadow-card transition-shadow hover:shadow-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-delete"
          >
            Delete entry
          </button>
        </>
      }
    >
      <p className="text-small text-ink-muted">This will remove it from your submitted hours.</p>
      <div className="mt-4.25 rounded-md bg-filter-panel p-3 text-left">
        <b className="block text-small font-semibold">{entry.description}</b>
        <small className="mt-1 block text-caption text-ink-muted">
          {entry.date} · {entry.hours} hours · {entry.source === 'Excel' ? 'Excel import' : 'Direct entry'}
        </small>
      </div>
    </CenteredDialog>
  )
}

/** Entry on an approved/exported invoice: request an adjustment instead (prototype code layer). */
export function LockedEntryDialog({ entry, onClose, onSent }: { entry: Entry; onClose: () => void; onSent: (msg: string) => void }) {
  const { update, me } = useDemo()
  return (
    <CenteredDialog
      icon="invoice-protected"
      iconTile="bg-protected-soft"
      title="Request a billing correction"
      onClose={onClose}
      actions={
        <>
          <OutlineButton onClick={onClose}>Close</OutlineButton>
          <DarkButton
            onClick={() => {
              update((s) => {
                s.messages.unshift({
                  id: uid(),
                  projectId: entry.projectId,
                  entryId: entry.id,
                  from: me.name,
                  to: 'Vanessa Hart',
                  subject: 'Correction requested for invoiced time',
                  body: `${me.name} requested a correction to an entry on a finalized invoice.`,
                  time: 'Just now',
                  unreadBy: ['partner'],
                  status: 'Open',
                  replies: [],
                })
                s.audit.unshift(`${me.name} requested an adjustment for finalized entry ${entry.id}`)
              })
              onSent('Correction request sent to Vanessa.')
            }}
          >
            Request correction
          </DarkButton>
        </>
      }
    >
      <p className="text-small text-ink-muted">
        This entry is part of an approved or exported invoice, so its billing record cannot be changed or deleted here. Ask Vanessa to create an adjustment.
      </p>
    </CenteredDialog>
  )
}
