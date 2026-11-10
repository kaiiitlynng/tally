import { InvoiceTable } from '../../components/InvoiceTable'
import { SectionHeading } from '../../components/SectionHeading'
import { partner } from '../../data/store'

/** "Projects ready for you" (Figma 36:157–36:244). */
export function ProjectsReady() {
  return (
    <section aria-labelledby="projects-ready" className="pt-5.75">
      <SectionHeading id="projects-ready" title="Projects ready for you" description={`Assigned to ${partner.firstName} for billing review`} />
      <div className="mt-2.5">
        <InvoiceTable actionLabel="Open" />
      </div>
    </section>
  )
}
