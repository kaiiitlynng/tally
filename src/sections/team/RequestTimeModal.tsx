import { useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { uid, useDemo } from '../../components/DemoContext'
import { Field, Select, TextArea, TextInput } from '../../components/Field'
import { FieldMessage } from '../../components/Field'
import { Disclaimer, Modal } from '../../components/Modal'
import { demoToday } from '../../data/store'

const longDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/** "Request time now" (Figma 36:8726, extended by spec item 7): recipients, cut-off date, preview, send in-app. */
export function RequestTimeModal({ onClose }: { onClose: () => void }) {
  const { store, update, me } = useDemo()
  const team = store.team.filter((m) => m.name !== me.name).map((m) => m.name)
  const [projectId, setProjectId] = useState(store.projects[0]?.id ?? 'all')
  const defaults = (id: string) => (id === 'all' ? team : (store.projects.find((p) => p.id === id)?.people.filter((p) => team.includes(p)) ?? []))
  const template = (id: string) => (id === 'all' ? 'Please submit all time through today.' : `${store.projects.find((p) => p.id === id)?.name} has settled. Please submit all time through today.`)
  const [recipients, setRecipients] = useState<string[]>(() => defaults(projectId))
  const [through, setThrough] = useState(demoToday)
  const [message, setMessage] = useState(() => template(projectId))
  const [edited, setEdited] = useState(false)
  const [step, setStep] = useState<'compose' | 'preview'>('compose')
  const [tried, setTried] = useState(false)

  function changeProject(id: string) {
    setProjectId(id)
    setRecipients(defaults(id))
    if (!edited) setMessage(template(id))
  }

  function send() {
    update((s) => {
      recipients.forEach((to) =>
        s.messages.unshift({
          id: uid(),
          projectId: projectId === 'all' ? undefined : projectId,
          from: me.name,
          to,
          subject: `Submit time through ${longDate(through)}`,
          body: message,
          time: 'Just now',
          unreadBy: ['employee'],
          status: 'Open',
          replies: [],
        }),
      )
      s.reminderLog.unshift(`Time request sent in-app to ${recipients.join(', ')}`)
    })
    onClose()
  }

  const valid = recipients.length > 0 && message.trim() && through
  const projectLabel = projectId === 'all' ? 'All projects' : store.projects.find((p) => p.id === projectId)?.name

  return (
    <Modal
      title={step === 'compose' ? 'Request time now' : 'Preview request'}
      onClose={onClose}
      footer={
        step === 'compose' ? (
          <>
            <OutlineButton onClick={onClose}>Cancel</OutlineButton>
            <DarkButton
              onClick={() => {
                setTried(true)
                if (valid) setStep('preview')
              }}
            >
              Preview
            </DarkButton>
          </>
        ) : (
          <>
            <OutlineButton onClick={() => setStep('compose')}>Back</OutlineButton>
            <DarkButton onClick={send}>Send</DarkButton>
          </>
        )
      }
    >
      {step === 'compose' ? (
        <div className="flex flex-col gap-3">
          <Field label="Project" htmlFor="request-project">
            <Select id="request-project" value={projectId} onChange={(e) => changeProject(e.target.value)}>
              <option value="all">All projects</option>
              {store.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <fieldset>
            <legend className="text-small font-semibold text-ink">Recipients</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {team.map((person) => {
                const on = recipients.includes(person)
                return (
                  <label
                    key={person}
                    className={`flex h-9 items-center gap-1.5 rounded-pill border px-3.5 text-small font-medium transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                      on ? 'border-brand bg-brand-50 text-brand' : 'border-line bg-white text-ink hover:border-brand-200 hover:bg-hover'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => setRecipients(on ? recipients.filter((r) => r !== person) : [...recipients, person])}
                    />
                    {person}
                  </label>
                )
              })}
            </div>
            {tried && !recipients.length && <FieldMessage tone="error">Choose at least one recipient.</FieldMessage>}
          </fieldset>
          <Field label="Submit time through" htmlFor="request-through">
            <TextInput id="request-through" type="date" value={through} onChange={(e) => setThrough(e.target.value)} />
          </Field>
          <Field label="Message" htmlFor="request-message" error={tried && !message.trim() ? 'Add a message.' : undefined}>
            <TextArea
              id="request-message"
              value={message}
              onChange={(e) => {
                setEdited(true)
                setMessage(e.target.value)
              }}
            />
          </Field>
          <Disclaimer>Sends an in-app request. Email is only simulated when enabled.</Disclaimer>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-3 text-small">
          <dl className="grid grid-cols-[110px_1fr] gap-y-1.5 rounded-md bg-context p-3">
            <dt className="text-ink-muted">Project</dt>
            <dd>{projectLabel}</dd>
            <dt className="text-ink-muted">To</dt>
            <dd>{recipients.join(', ')}</dd>
            <dt className="text-ink-muted">Submit through</dt>
            <dd>{longDate(through)}</dd>
            <dt className="text-ink-muted">In-app</dt>
            <dd>Yes</dd>
            <dt className="text-ink-muted">Email</dt>
            <dd>{store.reminderChannels.email ? 'Demo only (not delivered)' : 'Off'}</dd>
          </dl>
          <p className="rounded-md border border-line bg-white p-3 leading-normal whitespace-pre-wrap">{message}</p>
        </div>
      )}
    </Modal>
  )
}
