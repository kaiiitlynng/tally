import { useState } from 'react'
import { DarkButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { PageTitle } from '../components/PageTitle'
import { PROJECT_TABS, SegmentedTabs } from '../components/SegmentedTabs'
import { archivedProjects } from '../data/history'
import { NewProjectModal } from '../sections/clients/NewProjectModal'
import { ProjectCard } from '../sections/clients/ProjectCard'

/**
 * Clients & Projects (Figma 36:711 → content 36:738). "Current Projects" is the store (unchanged); "Past Projects"
 * lists projects closed in earlier billing cycles, each linking to its last invoice in Approved Invoices.
 */
export default function ClientsProjects() {
  const { projects } = useDemo().store
  const [creating, setCreating] = useState(false)
  const [tab, setTab] = useState<'current' | 'past'>('current')

  return (
    <>
      <PageTitle
        title="Clients & Projects"
        actions={
          <DarkButton leadingIcon="plus-white" onClick={() => setCreating(true)}>
            New project
          </DarkButton>
        }
      />
      <SegmentedTabs label="Project history" tabs={PROJECT_TABS} value={tab} onChange={setTab} idPrefix="client-projects" className="mt-6" />
      <div id="client-projects-panel" role="tabpanel" aria-labelledby={`client-projects-tab-${tab}`} className="grid grid-cols-2 gap-3.5 pt-4">
        {tab === 'current'
          ? projects.map((p) => <ProjectCard key={p.id} project={p} />)
          : archivedProjects.map((p) => <ProjectCard key={p.id} project={p} archived />)}
      </div>
      {creating && <NewProjectModal onClose={() => setCreating(false)} onCreated={() => setCreating(false)} />}
    </>
  )
}
