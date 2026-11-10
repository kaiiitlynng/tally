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
    <article className="flex flex-col rounded-16 border border-line bg-surface p-4.5">
      <div className="flex items-start justify-between">
        <span className="grid size-9.75 place-items-center rounded-11 bg-project-tile text-9 text-project-tile-ink" aria-hidden="true">
          {monogram}
        </span>
        {/* Figma fixes this pill at 39×39, which clips "Completed"; sized to content here. */}
        <span className="grid h-9.75 place-items-center rounded-11 bg-success-pill px-2.25 text-9 font-semibold text-success-ink">
          {project.status}
        </span>
      </div>

      <h3 className="pt-3.75 text-15 text-ink">{project.name}</h3>
      <p className="pt-1 text-8 text-ink-muted">
        {project.client} · {project.code}
      </p>

      <dl className="grid grid-cols-2 gap-3 pt-4.5">
        {facts.map(([term, value]) => (
          <div key={term}>
            <dt className="text-7 text-ink-dim uppercase">{term}</dt>
            <dd className="py-0.75 text-9 text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="flex pt-4.5" aria-label="Team members">
        {project.people.map((person) => (
          <li
            key={person}
            title={person}
            className="-mr-1.25 grid size-7 place-items-center rounded-full border-2 border-member-ring bg-member text-7 text-ink"
          >
            {initials(person)}
          </li>
        ))}
      </ul>
    </article>
  )
}
