import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Icon } from '../../components/Icon'
import { NewProjectModal } from '../clients/NewProjectModal'
import { ProjectsSnapshot } from './ProjectsSnapshot'
import { ImportDropzone } from '../time/ImportDropzone'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Home's primary actions: importing timesheets (the main way time enters Tally) and a projects snapshot.
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

      <ProjectsSnapshot onNew={() => setCreating(true)} />

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
