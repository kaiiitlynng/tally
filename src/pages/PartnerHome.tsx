import { PageTitle } from '../components/PageTitle'
import { useDemo } from '../components/DemoContext'
import { NextStepHero } from '../sections/home/NextStepHero'
import { RemindTeamCard } from '../sections/home/RemindTeamCard'
import { StartActions } from '../sections/home/StartActions'

/**
 * Partner home (Figma 36:7 → content 36:34). Order changed from Figma at the owner's request: importing time
 * and creating projects lead, then the next step. The workflow tracker (Figma 36:86) was removed from Home at the owner's
 * request; the sidebar's Billing stepper shows the same progress. "Needs attention" was replaced by the reminders card
 * (2026-11-10); unmatched imported rows now live on Time Entries.
 */
export default function PartnerHome() {
  const { me } = useDemo()
  return (
    <>
      <PageTitle
        title={`Good morning, ${me.firstName}.`}
      />
      <div className="pt-6">
        <StartActions />
      </div>
      <div className="pt-6">
        <NextStepHero />
      </div>
      <div className="pt-4">
        <RemindTeamCard />
      </div>
    </>
  )
}
