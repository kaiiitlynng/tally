import { useState } from 'react'
import { uid, useDemo } from '../../components/DemoContext'
import { Field, Select, TextArea, TextInput } from '../../components/Field'
import { Modal } from '../../components/Modal'
import { notify, partner } from '../../data/store'

/**
 * Start a conversation (owner request 2026-11-10). Anyone on the team can message anyone else; a project is
 * optional context. The new thread opens in the inbox and the recipient gets a bell notification.
 */
export function NewMessageModal({ onClose, onSent }: { onClose: () => void; onSent: (id: string) => void }) {
  const { store, update, me } = useDemo()
  const people = store.team.filter((m) => m.name !== me.name).map((m) => m.name)
  const projects = me.name === partner.name ? store.projects : store.projects.filter((p) => p.people.includes(me.name))
  const [to, setTo] = useState(people[0] ?? '')
  const [projectId, setProjectId] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [tried, setTried] = useState(false)

  const errors = {
    to: to ? undefined : 'Choose who to message.',
    subject: subject.trim() ? undefined : 'Add a subject.',
    body: body.trim() ? undefined : 'Write a message.',
  }

  function send() {
    setTried(true)
    if (errors.to || errors.subject || errors.body) return
    const id = uid()
    update((s) => {
      s.messages.unshift({
        id,
        projectId: projectId || undefined,
        from: me.name,
        to,
        subject: subject.trim(),
        body: body.trim(),
        time: 'Just now',
        unreadBy: [to === partner.name ? 'partner' : 'employee'],
        status: 'Open',
        replies: [],
      })
      notify(s, to, `New message from ${me.firstName}: “${subject.trim()}”`, '/messages')
    })
    onSent(id)
  }

  return (
    <Modal title="New message" confirmLabel="Send message" onConfirm={send} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3.5">
        <Field label="To" htmlFor="nm-to" error={tried ? errors.to : undefined}>
          <Select id="nm-to" value={to} onChange={(e) => setTo(e.target.value)}>
            {people.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </Field>
        <Field label="Project (optional)" htmlFor="nm-project">
          <Select id="nm-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Subject" htmlFor="nm-subject" className="col-span-2" error={tried ? errors.subject : undefined}>
          <TextInput id="nm-subject" autoFocus value={subject} aria-invalid={tried && !!errors.subject} onChange={(e) => setSubject(e.target.value)} />
        </Field>
        <Field label="Message" htmlFor="nm-body" className="col-span-2" error={tried ? errors.body : undefined}>
          <TextArea id="nm-body" value={body} aria-invalid={tried && !!errors.body} onChange={(e) => setBody(e.target.value)} className="min-h-24" />
        </Field>
      </div>
    </Modal>
  )
}
