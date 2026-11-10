import { PageTitle } from '../components/PageTitle'
import { partner } from '../data/store'
import { NeedsAttention } from '../sections/home/NeedsAttention'
import { NextStepHero } from '../sections/home/NextStepHero'
import { StartActions } from '../sections/home/StartActions'

/**
 * Partner home (Figma 36:7 → content 36:34). Order changed from Figma at the owner's request: importing time
 * and creating projects lead, then the next step. The workflow tracker (Figma 36:86) was removed from Home at the owner's
 * request; the sidebar's Billing stepper shows the same progress.
 */
export default function PartnerHome() {
  return (
    <>
      <PageTitle
        title={`Good morning, ${partner.firstName}.`}
        description="Here is the clearest next step to keep billing moving."
      />
      <div className="pt-6">
        <StartActions />
      </div>
      <div className="pt-6">
        <NextStepHero />
      </div>
      <div className="pt-6 [&>aside]:w-full">
        <NeedsAttention />
      </div>
    </>
  )
}
