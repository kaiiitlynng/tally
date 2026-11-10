import { Pill } from '../../components/Pill'
import { initials, type Project } from '../../data/store'

/** One client project card (Figma 36:758). */
export function ProjectCard({ project }: { project: Project }) {
  const facts = [
    ['Type', project.type],
    ['Reviewer', project.reviewer],
    ['Team', `${project.people.length} people`],
    ['Time due', project.deadline],
  ]
  const monogram = project.name.slice(0, 2).toUpperCase()

  return (
    <article className="flex flex-col rounded-lg border border-line bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-md bg-project-tile text-small font-semibold text-project-tile-ink" aria-hidden="true">
          {monogram}
        </span>
        {/* Figma fixes this pill at 39×39, which clips "Completed"; sized to content here. */}
        <Pill tone="success">{project.status}</Pill>
      </div>

      <h2 className="font-semibold pt-3.75 text-lead text-ink">{project.name}</h2>
      <p className="pt-1 text-small text-ink-muted">
        {project.client} · {project.code}
      </p>

      <dl className="grid grid-cols-2 gap-3 pt-4.5">
        {facts.map(([term, value]) => (
          <div key={term}>
            <dt className="text-caption font-semibold tracking-meta text-ink-dim uppercase">{term}</dt>
            <dd className="pt-1 text-body text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-5 flex border-t border-card-rule pt-4" aria-label="Team members">
        {project.people.map((person) => (
          <li
            key={person}
            title={person}
            className="-mr-1.5 grid size-8 place-items-center rounded-full border-2 border-member-ring bg-member text-caption font-semibold text-brand transition-transform duration-200 ease-stripe hover:z-10 hover:-translate-y-0.5"
          >
            {initials(person)}
          </li>
        ))}
      </ul>
    </article>
  )
}
