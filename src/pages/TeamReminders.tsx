import { useState } from 'react'
import { DarkButton } from '../components/Button'
import { PageTitle } from '../components/PageTitle'
import { ReminderActivity } from '../sections/team/ReminderActivity'
import { RequestTimeModal } from '../sections/team/RequestTimeModal'
import { SubmissionStats } from '../sections/team/SubmissionStats'
import { TeamTable } from '../sections/team/TeamTable'

/** Manage Team (was Team & Reminders; Figma 36:7718; "Request time now" modal 36:8726). */
export default function TeamReminders() {
  const [requesting, setRequesting] = useState(false)

  return (
    <>
      <PageTitle
        title="Manage Team"
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

      {requesting && <RequestTimeModal onClose={() => setRequesting(false)} />}
    </>
  )
}
