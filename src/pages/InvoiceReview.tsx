import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { DarkButton, DarkLinkButton, OutlineButton } from '../components/Button'
import { uid, useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { Disclaimer, Modal } from '../components/Modal'
import { openFlagsFor, partner, type Flag } from '../data/store'
import { InvoiceDocument } from '../sections/review/InvoiceDocument'
import { ReviewPanel } from '../sections/review/ReviewPanel'

const LABEL = 'flex flex-col gap-1.5 text-8 font-semibold text-ink-field'
const CONTROL = 'mb-1.5 w-full rounded-10 border border-line-field bg-white p-2.75 text-10 font-semibold text-ink placeholder:text-ink-placeholder focus:outline-2 focus:outline-dark/20'

/** Invoice review detail (Figma 36:6409); flag actions and modals follow the prototype code layer. */
export default function InvoiceReview() {
  const { invoiceId = '' } = useParams()
  const navigate = useNavigate()
  const { store, update } = useDemo()
  const [ask, setAsk] = useState<Flag | null>(null)
  const [askText, setAskText] = useState('')
  const [edit, setEdit] = useState<Flag | null>(null)
  const [editHours, setEditHours] = useState('')

  const project = store.projects.find((p) => p.id === invoiceId)
  if (!project) return <Navigate to="/review" replace />

  const flags = openFlagsFor(store, invoiceId)
  const flag = flags[0]
  const status = store.invoiceStatus[invoiceId]
  const approved = status === 'Approved' || status === 'Exported'
  const entryFor = (f: Flag) => store.entries.find((e) => e.id === f.entryId)!

  function resolve(decision: 'accept' | 'dismiss') {
    if (!flag) return
    update((s) => {
      const f = s.flags.find((x) => x.id === flag.id)!
      f.status = decision === 'accept' ? 'Resolved' : 'Dismissed'
      if (decision === 'accept' && flag.id === 'f1') {
        const entry = s.entries.find((e) => e.id === flag.entryId)!
        entry.original = `${entry.hours} hours`
        entry.hours = 2
      }
      s.audit.unshift(`Vanessa ${decision === 'accept' ? 'accepted' : 'dismissed'}: ${flag.title}`)
      s.invoiceStatus[invoiceId] = openFlagsFor(s, invoiceId).length ? 'In review' : 'Ready to approve'
    })
  }

  function sendAsk() {
    if (!ask) return
    const entry = entryFor(ask)
    update((s) => {
      s.flags.find((x) => x.id === ask.id)!.status = 'Awaiting employee'
      s.messages.unshift({
        id: uid(),
        projectId: invoiceId,
        entryId: entry.id,
        from: partner.name,
        to: entry.employee,
        subject: `Clarify ${entry.date.slice(5)} time entry`,
        body: askText || `Could you clarify “${entry.description}”? We need a more specific description before billing.`,
        time: 'Just now',
        unreadBy: ['employee'],
        status: 'Open',
        replies: [],
      })
      s.invoiceStatus[invoiceId] = 'Awaiting employee'
      s.audit.unshift(`Vanessa asked ${entry.employee} about a linked entry`)
    })
    setAsk(null)
    setAskText('')
  }

  function applyEdit() {
    if (!edit) return
    update((s) => {
      const entry = s.entries.find((e) => e.id === edit.entryId)!
      entry.original = `${entry.hours} hours`
      entry.hours = Number(editHours) || entry.hours
      s.flags.find((x) => x.id === edit.id)!.status = 'Resolved'
      s.audit.unshift('Vanessa edited the original entry; prior value preserved')
      s.invoiceStatus[invoiceId] = openFlagsFor(s, invoiceId).length ? 'In review' : 'Ready to approve'
    })
    setEdit(null)
  }

  function approve() {
    update((s) => {
      s.invoiceStatus[invoiceId] = 'Approved'
      s.audit.unshift(`Vanessa approved ${project!.name} invoice`)
    })
  }

  return (
    <>
      <div className="grid grid-cols-[110px_1fr_auto] items-end">
        <Link to="/review" className="self-start rounded-10 text-9 text-ink-segment hover:text-ink focus-visible:outline-2 focus-visible:outline-dark">
          ← All invoices
        </Link>
        <div>
          <p className="text-9 font-semibold tracking-eyebrow text-eyebrow uppercase">Invoice review</p>
          <h1 className="pt-0.75 text-26 font-medium text-ink">{project.name}</h1>
          <p className="pt-0.75 text-9 text-ink-muted">{project.client} · May 2025</p>
        </div>
        <div className="flex gap-2">
          <OutlineButton onClick={() => navigate('/review')}>Save &amp; close</OutlineButton>
          {!flags.length && !approved && (
            <DarkButton onClick={approve}>
              Approve Invoice <Icon name="check-white" size={18} />
            </DarkButton>
          )}
          {approved && <DarkLinkButton to="/invoices">View approved invoice</DarkLinkButton>}
        </div>
      </div>

      <div className="mt-3.5 grid min-h-232.5 grid-cols-[1fr_330px] overflow-hidden rounded-15 border border-review-frame-line bg-review-frame">
        <div className="flex justify-center overflow-x-auto py-4.75">
          <InvoiceDocument projectId={invoiceId} highlight={flag?.entryId} />
        </div>
        <ReviewPanel
          flags={flags}
          approved={approved}
          onAccept={() => resolve('accept')}
          onDismiss={() => resolve('dismiss')}
          onAsk={() => flag && setAsk(flag)}
          onEdit={() => {
            if (!flag) return
            setEdit(flag)
            setEditHours(String(entryFor(flag).hours))
          }}
          onApprove={approve}
        />
      </div>

      {ask && (
        <Modal eyebrow="Linked billing request" title="Ask employee" confirmLabel="Send request" onConfirm={sendAsk} onClose={() => setAsk(null)}>
          <div className="mt-4.5 flex gap-2.5 rounded-10 bg-context p-3">
            <Icon name="nav-time-entries" size={18} />
            <div className="text-9">
              <b className="block font-bold">
                {entryFor(ask).employee} · {entryFor(ask).date}
              </b>
              <p className="pt-1 text-ink-muted">{entryFor(ask).description}</p>
            </div>
          </div>
          <label className={LABEL}>
            Message
            <textarea
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              placeholder="Explain what needs clarification…"
              className={`${CONTROL} min-h-21.25 resize-y`}
            />
          </label>
          <Disclaimer>This sends an in-app message. No external email is delivered in this prototype.</Disclaimer>
        </Modal>
      )}

      {edit && (
        <Modal title="Edit entry" confirmLabel="Save correction" onConfirm={applyEdit} onClose={() => setEdit(null)}>
          <label className={LABEL}>
            Billable hours
            <input type="number" step="0.1" min="0" value={editHours} onChange={(e) => setEditHours(e.target.value)} className={CONTROL} />
          </label>
          <Disclaimer>The original value will remain in the change history.</Disclaimer>
        </Modal>
      )}
    </>
  )
}
