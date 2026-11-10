import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { DarkButton } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { NEW_PROJECT_STEPS, NewProjectModal } from '../clients/NewProjectModal'
import { ImportDropzone } from '../time/ImportDropzone'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Home's primary actions: importing timesheets (the main way time enters Tally) and creating a project.
 * Copy reuses Figma strings from Collect time (36:120), the Excel drop zone (36:1990) and Clients & Projects (36:738).
 */
export function StartActions() {
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  return (
    <div className="grid grid-cols-2 gap-4 wide:grid-cols-[3fr_2fr]">
      <section
        aria-labelledby="start-import"
        className="relative isolate overflow-hidden rounded-xl border border-hero-line bg-surface p-6 shadow-hero"
      >
        {/* Decorative ribbon behind the header; the drop zone below is opaque, so text stays on solid color. */}
        <span aria-hidden="true" className="pointer-events-none absolute -top-28 -right-48 -z-10 h-40 w-160 origin-center animate-ribbon ribbon opacity-80" />
        <div className="flex items-start justify-between gap-4 pb-4">
          <div>
            <div>
              <h2 id="start-import" className="text-title-sm font-semibold tracking-title text-ink">
                Upload Excel files
              </h2>
              <p className="pt-0.5 text-small text-ink-muted">Import one file or the whole team folder</p>
            </div>
          </div>
          <Link
            to="/time?add=enter"
            className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-sm border border-line bg-surface px-3 text-small font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-hover hover:text-brand ${FOCUS}`}
          >
            <Icon tint name="clock-dark" size={16} />
            Enter hours directly
          </Link>
        </div>
        <ImportDropzone bare onFile={() => navigate('/time?mode=import', { state: { importNow: true } })} />
      </section>

      <section aria-labelledby="start-project" className="flex flex-col rounded-xl border border-hero-line bg-surface p-6 shadow-hero">
        <div>
          <div>
            <h2 id="start-project" className="text-title-sm font-semibold tracking-title text-ink">
              New Project
            </h2>
            <p className="pt-0.5 text-small text-ink-muted">Keep billing contacts, assignments, and project rules in one place.</p>
          </div>
        </div>

        {/* Preview of the three-step New Project flow, so it is clear what creating a project involves. */}
        <ol className="mt-5 flex flex-col gap-3">
          {NEW_PROJECT_STEPS.map((title, i) => (
            <li key={title} className="flex items-center gap-3 text-body text-ink">
              <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-white text-caption font-semibold text-brand ring-1 ring-brand-200">
                {i + 1}
              </span>
              {title}
            </li>
          ))}
        </ol>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <DarkButton leadingIcon="plus-white" onClick={() => setCreating(true)}>
            New Project
          </DarkButton>
          <Link to="/clients" className={`group inline-flex items-center gap-1 rounded-sm px-2 py-1 text-small font-semibold text-link transition-colors hover:bg-hover ${FOCUS}`}>
            Clients &amp; Projects
            <Icon name="arrow-right-small" size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {creating && (
        <NewProjectModal
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false)
            navigate('/clients')
          }}
        />
      )}
    </div>
  )
}
