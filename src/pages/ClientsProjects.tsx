import { useState } from 'react'
import { DarkButton } from '../components/Button'
import { PageTitle } from '../components/PageTitle'
import { useDemo } from '../components/DemoContext'
import { NewProjectModal } from '../sections/clients/NewProjectModal'
import { ProjectCard } from '../sections/clients/ProjectCard'

/** Clients & Projects (Figma 36:711 → content 36:738). */
export default function ClientsProjects() {
  const { projects } = useDemo().store
  const [creating, setCreating] = useState(false)
  return (
    <>
      <PageTitle
        eyebrow="Billing setup"
        title="Clients & Projects"
        description="Keep billing contacts, assignments, and project rules in one place."
        actions={
          <DarkButton leadingIcon="plus-white" onClick={() => setCreating(true)}>
            New Project
          </DarkButton>
        }
      />
      <div className="grid grid-cols-3 gap-3 pt-6">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      {creating && (
        <NewProjectModal onClose={() => setCreating(false)} onCreated={() => setCreating(false)} />
      )}
    </>
  )
}
