import { useState } from 'react'
import { Link } from 'react-router'
import { DarkButton, OutlineButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Field, TextArea, TextInput } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Disclaimer, Modal } from '../../components/Modal'
import { demoToday, invoiceTotal, money } from '../../data/store'

/** "Send to client" email preview (spec item 10). Demo only: nothing is delivered. */
export function SendInvoiceModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const { store, update, me, toast } = useDemo()
  const p = store.projects.find((x) => x.id === projectId)!
  const [subject, setSubject] = useState(`Invoice ${p.code} – ${p.name} – May 2025`)
  // Draft body copy (not in the spec): short, editable.
  const [body, setBody] = useState(
    `Hi ${p.contact.split(' ')[0]},\n\nAttached is invoice ${p.code} for ${p.name}, covering May 2025 (${money(invoiceTotal(store, projectId))}).\n\nThank you,\n${me.name}\nHartwell & Knox Forensic Advisory`,
  )

  function send() {
    update((s) => {
      s.invoiceStatus[projectId] = 'Sent'
      s.invoiceDates[projectId] = { ...s.invoiceDates[projectId], sentAt: demoToday }
      s.audit.unshift(`${me.firstName} sent invoice ${p.code} to ${p.contact} (simulated)`)
    })
    toast('Simulated send – no email delivered')
    onClose()
  }

  return (
    <Modal
      size="lg"
      title="Send to client"
      onClose={onClose}
      footer={
        <>
          <OutlineButton onClick={onClose}>Cancel</OutlineButton>
          <DarkButton onClick={send}>Send</DarkButton>
        </>
      }
    >
      <div className="mt-4 flex flex-col gap-3">
        {/* Gmail not connected: suggest connecting it, but the (simulated) send still works. */}
        {!store.gmailConnected && (
          <div className="flex items-center gap-2 rounded-md border border-warn-line bg-warn-soft px-3 py-2.5 text-small text-warn-ink">
            <Icon name="warning-caution" size={16} />
            <p className="flex-1">Gmail isn&apos;t connected, so this won&apos;t reach the client&apos;s inbox.</p>
            <Link
              to="/settings?tab=integrations"
              onClick={onClose}
              aria-label="Connect Gmail"
              className="shrink-0 rounded-xs font-semibold text-link underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Connect
            </Link>
          </div>
        )}
        <Field label="To" htmlFor="send-to">
          <TextInput id="send-to" readOnly value={`${p.contact} <${p.email ?? 'no billing email on file'}>`} className="bg-segment" />
        </Field>
        <Field label="Subject" htmlFor="send-subject">
          <TextInput id="send-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Field>
        <Field label="Message" htmlFor="send-body">
          <TextArea id="send-body" value={body} onChange={(e) => setBody(e.target.value)} className="h-36 font-normal" />
        </Field>
        <div className="flex items-center gap-2 text-caption">
          <span className="text-ink-field font-semibold">Attachment</span>
          <span className="rounded-sm border border-line bg-white px-2 py-1">Invoice {p.code}.pdf</span>
        </div>
        <Disclaimer>Demo only: no email is delivered.</Disclaimer>
      </div>
    </Modal>
  )
}
