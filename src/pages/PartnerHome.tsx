import { PageTitle } from '../components/PageTitle'
import { partner } from '../data/store'
import { CollectTime } from '../sections/home/CollectTime'
import { NeedsAttention } from '../sections/home/NeedsAttention'
import { NextStepHero } from '../sections/home/NextStepHero'
import { ProjectsReady } from '../sections/home/ProjectsReady'
import { Workflow } from '../sections/home/Workflow'

/** Partner home (Figma 36:7 → content 36:34). */
export default function PartnerHome() {
  return (
    <>
      <PageTitle
        eyebrow="May billing cycle"
        title={`Good morning, ${partner.firstName}.`}
        description="Here is the clearest next step to keep billing moving."
      />
      <div className="pt-6">
        <NextStepHero />
      </div>
      <div className="pt-5.5">
        <Workflow />
      </div>
      <div className="flex items-start gap-4.5 pt-7">
        <div className="min-w-0 flex-1">
          <CollectTime />
          <ProjectsReady />
        </div>
        <NeedsAttention />
      </div>
    </>
  )
}
