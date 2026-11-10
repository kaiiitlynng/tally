import { useState } from 'react'
import { DarkButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Field, Select, TextArea, TextInput } from '../components/Field'
import { Disclaimer, Modal } from '../components/Modal'
import { PageTitle } from '../components/PageTitle'
import { ReminderActivity } from '../sections/team/ReminderActivity'
import { SubmissionStats } from '../sections/team/SubmissionStats'
import { TeamTable } from '../sections/team/TeamTable'

/** Team & Reminders (Figma 36:7718; "Request time now" modal 36:8726). */
export default function TeamReminders() {
  const { store, update } = useDemo()
  const [requesting, setRequesting] = useState(false)

  return (
    <>
      <PageTitle
        eyebrow="May submission period"
        title="Team & Reminders"
        description="See who has submitted and automate courteous follow-up."
        actions={
          <DarkButton leadingIcon="bell-white" onClick={() => setRequesting(true)}>
            Request time now
          </DarkButton>
        }
      />
      <SubmissionStats />
      <TeamTable />
      <ReminderActivity />

      {requesting && (
        <Modal
          eyebrow="Urgent request"
          title="Request time now"
          confirmLabel="Send request"
          onClose={() => setRequesting(false)}
          onConfirm={() => {
            update((s) => {
              s.reminderLog.unshift('Urgent time request sent to Nora and Ryan')
            })
            setRequesting(false)
          }}
        >
          <Field label="Project" htmlFor="request-project">
            <Select id="request-project">
              {store.projects.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Employees" htmlFor="request-employees">
            <Select id="request-employees">
              <option>Nora Chen and Ryan Cole</option>
            </Select>
          </Field>
          <Field label="Due date" htmlFor="request-due">
            <TextInput id="request-due" type="date" defaultValue="2025-06-01" />
          </Field>
          <Field label="Message" htmlFor="request-message">
            <TextArea id="request-message" defaultValue="Please submit final project time so we can prepare the invoice." />
          </Field>
          <Disclaimer>Sends an in-app request. Email is only simulated when enabled.</Disclaimer>
        </Modal>
      )}
    </>
  )
}
