import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { DarkButton, OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { PageTitle } from '../components/PageTitle'
import { AddTimeDialog, type AddMode } from '../sections/time/AddTimeDialog'
import { EntriesSection } from '../sections/time/EntriesSection'
import { HeldRows } from '../sections/time/HeldRows'

/** Navigation state from My Projects: "Log hours" (log) or "View entries" (entries) for a project. */
export interface TimeIntent {
  projectId: string
  mode: 'log' | 'entries'
}

/**
 * Time Entries (partner, Figma 36:1365) and My Time (employee, 36:12842). The entries table is the page; adding
 * time happens in the "Add time" dialog (owner request 2026-11-10). It opens straight away from Home
 * (`?add=enter`, or `?mode=import` with a dropped file) and from My Projects "Log hours".
 */
export default function TimeEntries() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { role, toast } = useDemo()
  // Read once: the hand-offs are cleared from history below, but the page keeps using them.
  const [intent] = useState(() => (location.state as { intent?: TimeIntent } | null)?.intent)
  const [importNow] = useState(() => Boolean((location.state as { importNow?: boolean } | null)?.importNow))
  const [adding, setAdding] = useState<{ mode: AddMode; importNow?: boolean; projectId?: string } | null>(() =>
    params.get('mode') === 'import'
      ? { mode: 'import', importNow }
      : params.get('add') === 'enter' || intent?.mode === 'log'
        ? { mode: 'enter', projectId: intent?.mode === 'log' ? intent.projectId : undefined }
        : null,
  )
  const entriesRef = useRef<HTMLElement>(null)

  // Drop the hand-offs from history so a refresh doesn't replay them.
  useEffect(() => {
    if (intent?.mode === 'entries') window.setTimeout(() => entriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    if (intent || importNow || params.size) navigate({ search: '' }, { replace: true, state: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function close(message?: string) {
    setAdding(null)
    setParams({}, { replace: true })
    if (message) toast(message)
  }

  return (
    <>
      <PageTitle
        title={role === 'employee' ? 'My Time' : 'Time Entries'}
        actions={
          // Upload is the primary way to log time; entering hours by hand is the secondary option.
          <div className="flex gap-2">
            <OutlineButton onClick={() => setAdding({ mode: 'enter' })}>Enter hours</OutlineButton>
            <DarkButton leadingIcon="upload-white" onClick={() => setAdding({ mode: 'import' })}>
              Upload timesheet
            </DarkButton>
          </div>
        }
      />
      {role === 'partner' && <HeldRows />}
      <EntriesSection ref={entriesRef} initialProjectFilter={intent?.mode === 'entries' ? intent.projectId : undefined} onNotice={toast} />
      {adding && <AddTimeDialog initialMode={adding.mode} importNow={adding.importNow} initialProjectId={adding.projectId} onClose={close} />}
    </>
  )
}
