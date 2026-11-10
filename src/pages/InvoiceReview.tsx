import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { DarkButton, DarkLinkButton, OutlineButton } from '../components/Button'
import { uid, useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { Disclaimer, Modal } from '../components/Modal'
import { addReply, demoToday, isFinal, openFlagsFor, setFlagStatus, snapshotForReview, type Flag } from '../data/store'
import { InvoiceDocument } from '../sections/review/InvoiceDocument'
import { ReviewPanel } from '../sections/review/ReviewPanel'
import { SendInvoiceModal } from '../sections/review/SendInvoiceModal'

const LABEL = 'flex flex-col gap-1.5 text-small font-semibold text-ink'
const CONTROL = 'mb-1.5 w-full rounded-md border border-line-field bg-white p-2.75 text-small font-semibold text-ink placeholder:text-ink-placeholder focus:outline-2 focus:outline-accent'

/** Invoice review detail (Figma 36:6409); flag actions and dialogs follow the prototype code layer and spec items 1, 5, 9, 10. */
export default function InvoiceReview() {
  const { invoiceId = '' } = useParams()
  const navigate = useNavigate()
  const { store, update, me, toast } = useDemo()
  const [ask, setAsk] = useState<Flag | null>(null)
  const [askText, setAskText] = useState('')
  const [edit, setEdit] = useState<Flag | null>(null)
  const [editHours, setEditHours] = useState('')
  const [keep, setKeep] = useState<Flag | null>(null)
  const [keepNote, setKeepNote] = useState('')
  const [sending, setSending] = useState(false)

  const project = store.projects.find((p) => p.id === invoiceId)
  if (!project) return <Navigate to="/review" replace />

  const flags = openFlagsFor(store, invoiceId)
  const flag = flags[0]
  const status = store.invoiceStatus[invoiceId]
  const approved = isFinal(status)
  const entryFor = (f: Flag) => store.entries.find((e) => e.id === f.entryId)!
  const settle = (s: typeof store) => (s.invoiceStatus[invoiceId] = openFlagsFor(s, invoiceId).length ? 'In review' : 'Ready to approve')

  function resolve(decision: 'accept' | 'dismiss') {
    if (!flag) return
    update((s) => {
      setFlagStatus(s, flag.id, decision === 'accept' ? 'Resolved' : 'Dismissed')
      if (decision === 'accept' && flag.id === 'f1') {
        const entry = s.entries.find((e) => e.id === flag.entryId)!
        snapshotForReview(entry, me.initials)
        entry.original = `${entry.hours} hours`
        entry.hours = 2
      }
      s.audit.unshift(`${me.firstName} ${decision === 'accept' ? 'accepted' : 'dismissed'}: ${flag.title}`)
      settle(s)
    })
  }

  function keepAsIs() {
    if (!keep) return
    update((s) => {
      setFlagStatus(s, keep.id, 'Resolved', keepNote.trim())
      s.audit.unshift(`${me.firstName} kept ${keep.title.split(',')[0]} as is${keepNote.trim() ? `: “${keepNote.trim()}”` : ''}`)
      settle(s)
    })
    setKeep(null)
    setKeepNote('')
  }

  function sendAsk() {
    if (!ask) return
    const entry = entryFor(ask)
    const body =
      askText.trim() ||
      (ask.type === 'Vague description'
        ? `Could you clarify “${entry.description}”? We need a more specific description before billing.`
        : `Could you confirm your ${entry.hours}-hour entry on ${entry.date.slice(5)} (“${entry.description}”)? ${ask.title}.`)
    update((s) => {
      setFlagStatus(s, ask.id, 'Awaiting employee')
      // Follow-ups on the same entry continue its thread, so the conversation stays in one place.
      const thread = s.messages.find((m) => m.entryId === entry.id)
      if (thread) {
        addReply(s, thread.id, { from: me.name, body, time: 'Just now' })
        thread.status = 'Open'
        thread.unreadBy = ['employee']
      } else
        s.messages.unshift({
          id: uid(),
          projectId: invoiceId,
          entryId: entry.id,
          from: me.name,
          to: entry.employee,
          subject: `Clarify ${entry.date.slice(5)} time entry`,
          body,
          time: 'Just now',
          unreadBy: ['employee'],
          status: 'Open',
          replies: [],
        })
      s.invoiceStatus[invoiceId] = 'Awaiting employee'
      s.audit.unshift(`${me.firstName} asked ${entry.employee} about a linked entry`)
    })
    setAsk(null)
    setAskText('')
  }

  function applyEdit() {
    if (!edit) return
    update((s) => {
      const entry = s.entries.find((e) => e.id === edit.entryId)!
      snapshotForReview(entry, me.initials)
      entry.original = `${entry.hours} hours`
      entry.hours = Number(editHours) || entry.hours
      setFlagStatus(s, edit.id, 'Resolved')
      s.audit.unshift(`${me.firstName} edited the original entry; prior value preserved`)
      settle(s)
    })
    setEdit(null)
  }

  function approve() {
    update((s) => {
      s.invoiceStatus[invoiceId] = 'Approved'
      s.invoiceDates[invoiceId] = { approvedAt: demoToday }
      s.audit.unshift(`${me.firstName} approved ${project!.name} invoice`)
      if (s.ai.autoClear) {
        s.ai.lastCleared = new Date().toISOString()
        s.audit.unshift('Tally cleared temporary AI working data after approval')
      }
    })
  }

  return (
    <>
      <Link
        to="/review"
        className="group -ml-2 inline-flex h-8 items-center gap-1 rounded-sm px-2 text-small font-medium text-ink-muted transition-colors hover:bg-hover hover:text-brand focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span aria-hidden="true" className="transition-transform duration-150 group-hover:-translate-x-0.5">←</span> Ready for Review
      </Link>
      <div className="flex items-end justify-between gap-6 pt-3">
        <div>
          <h1 className="text-title-lg font-semibold tracking-title text-ink">{project.name}</h1>
          <p className="pt-1 text-body text-ink-muted">{project.client} · May 2025</p>
        </div>
        <div className="flex gap-2">
          <OutlineButton onClick={() => navigate('/review')}>Save &amp; close</OutlineButton>
          {!flags.length && !approved && (
            <DarkButton onClick={approve}>
              Approve Invoice <Icon name="check-white" size={18} />
            </DarkButton>
          )}
          {approved && <DarkLinkButton to="/invoices">View in Approved Invoices</DarkLinkButton>}
        </div>
      </div>

      <div className="mt-6 grid min-h-232.5 grid-cols-[1fr_320px] overflow-hidden rounded-lg border border-review-frame-line bg-review-frame shadow-card">
        <div className="flex justify-center overflow-x-auto px-4 py-6">
          <InvoiceDocument projectId={invoiceId} highlight={flag?.entryId} editable />
        </div>
        <ReviewPanel
          projectId={invoiceId}
          flags={flags}
          approved={approved}
          sent={status === 'Sent'}
          onAccept={() => resolve('accept')}
          onDismiss={() => resolve('dismiss')}
          onKeep={() => flag && setKeep(flag)}
          onAsk={() => flag && setAsk(flag)}
          onEdit={() => {
            if (!flag) return
            setEdit(flag)
            setEditHours(String(entryFor(flag).hours))
          }}
          onApprove={approve}
          onSend={() => setSending(true)}
          onExport={() => toast('PDF export prepared in the demo')}
        />
      </div>

      {ask && (
        <Modal title="Ask employee" confirmLabel="Send request" onConfirm={sendAsk} onClose={() => setAsk(null)}>
          <p className="mb-3 text-small text-ink-muted">
            To <b className="font-semibold text-ink">{entryFor(ask).employee}</b> · {entryFor(ask).date}
          </p>
          <label className={LABEL}>
            Message
            <textarea value={askText} onChange={(e) => setAskText(e.target.value)} placeholder="Explain what needs clarification…" className={`${CONTROL} min-h-21.25 resize-y`} />
          </label>
        </Modal>
      )}

      {edit && (
        <Modal title="Edit entry" confirmLabel="Save correction" onConfirm={applyEdit} onClose={() => setEdit(null)}>
          <label className={`${LABEL} mt-4`}>
            Billable hours
            <input type="number" step="0.1" min="0" value={editHours} onChange={(e) => setEditHours(e.target.value)} className={CONTROL} />
          </label>
          <Disclaimer>The original value will remain in the change history.</Disclaimer>
        </Modal>
      )}

      {keep && (
        <Modal title="Keep as is" confirmLabel="Keep hours" onConfirm={keepAsIs} onClose={() => setKeep(null)}>
          <p className="mt-2 text-small text-ink-muted">{keep.title}</p>
          <label className={`${LABEL} mt-4`}>
            Note for the record (optional)
            <textarea
              value={keepNote}
              onChange={(e) => setKeepNote(e.target.value)}
              placeholder="Why these hours are correct, e.g. a filing deadline"
              className={`${CONTROL} min-h-21.25 resize-y`}
            />
          </label>
          <Disclaimer>The note is saved to Tally activity.</Disclaimer>
        </Modal>
      )}

      {sending && <SendInvoiceModal projectId={invoiceId} onClose={() => setSending(false)} />}
    </>
  )
}
