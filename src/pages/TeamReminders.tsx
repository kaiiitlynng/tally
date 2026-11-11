import { useState } from 'react'
import { DarkButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { PageTitle } from '../components/PageTitle'
import { outstandingPeople } from '../data/store'
import { EmailPromptModal, emailPromptDismissed } from '../sections/team/EmailPromptModal'
import { RequestTimeModal } from '../sections/team/RequestTimeModal'
import { SubmissionStats } from '../sections/team/SubmissionStats'
import { TeamTable } from '../sections/team/TeamTable'

/** Manage Team (was Team & Reminders; Figma 36:7718; "Request time now" modal 36:8726). */
export default function TeamReminders() {
  const { store, me } = useDemo()
  const [requesting, setRequesting] = useState(false)
  // Shown once while email isn't connected; "Not now" is remembered (EmailPromptModal).
  const [emailPrompt, setEmailPrompt] = useState(() => !store.reminderChannels.email && !emailPromptDismissed())
  const outstanding = outstandingPeople(store, me.name)
  const n = outstanding.length

  return (
    <>
      <PageTitle
        title="Manage Team"
        actions={
          <DarkButton trailingIcon={n ? 'bell-white' : undefined} disabled={!n} onClick={() => setRequesting(true)}>
            {n ? `Remind ${n} ${n === 1 ? 'person' : 'people'}` : 'Everyone’s submitted'}
          </DarkButton>
        }
      />
      <SubmissionStats />
      <TeamTable />

      {requesting && <RequestTimeModal initialRecipients={outstanding} onClose={() => setRequesting(false)} />}
      {emailPrompt && <EmailPromptModal onClose={() => setEmailPrompt(false)} />}
    </>
  )
}
