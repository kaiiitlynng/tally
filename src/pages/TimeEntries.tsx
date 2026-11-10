import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { DarkButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { onTabListKeyDown } from '../components/tabKeys'
import { ColumnMapping } from '../sections/time/ColumnMapping'
import { EntriesSection } from '../sections/time/EntriesSection'
import { ImportDropzone } from '../sections/time/ImportDropzone'
import { ParsingState } from '../sections/time/ParsingState'
import { TimeEntryForm } from '../sections/time/TimeEntryForm'

type Mode = 'enter' | 'import'

/** Navigation state from My Projects: "Log hours" (log) or "View entries" (entries) for a project. */
export interface TimeIntent {
  projectId: string
  mode: 'log' | 'entries'
}

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: 'enter', label: 'Enter hours directly', icon: 'clock-dark' },
  { id: 'import', label: 'Import Excel', icon: 'upload-dark' },
]

/**
 * Time Entries (partner, Figma 36:1257 / 36:1933 / 36:3833) and My Time (employee, 36:12734 / 36:13228).
 */
export default function TimeEntries() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  // Read once: the hand-off is cleared from history below, but the page keeps using it.
  const [intent] = useState(() => (location.state as { intent?: TimeIntent } | null)?.intent)
  const mode: Mode = params.get('mode') === 'import' ? 'import' : 'enter'
  const [step, setStep] = useState<'drop' | 'parsing' | 'mapping' | 'done'>('drop')
  const [formKey, setFormKey] = useState(0)
  const { role, me, toast: setNotice } = useDemo()
  const entriesRef = useRef<HTMLElement>(null)

  // Simulated parse, as in the prototype: 700ms then show the column mapping.
  useEffect(() => {
    if (step !== 'parsing') return
    const t = window.setTimeout(() => setStep('mapping'), 700)
    return () => window.clearTimeout(t)
  }, [step])

  // Handle a My Projects hand-off once, then drop it from history so a refresh doesn't replay it.
  useEffect(() => {
    if (!intent) return
    if (intent.mode === 'log') {
      setParams({}, { replace: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.setTimeout(() => document.getElementById('entry-hours')?.focus(), 50)
    } else {
      window.setTimeout(() => entriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
    navigate({ search: location.search }, { replace: true, state: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setMode(next: Mode) {
    setStep('drop')
    setParams(next === 'import' ? { mode: 'import' } : {}, { replace: true })
  }


  return (
    <>
      <PageTitle
        eyebrow="One shared billing dataset"
        title={role === 'employee' ? 'My Time' : 'Time Entries'}
        description="Enter hours in Tally or import Excel. Both follow the same review and invoice process."
        actions={
          role === 'partner' && (
            <DarkButton
              leadingIcon="plus-white"
              onClick={() => {
                setMode('enter')
                setFormKey((k) => k + 1)
                requestAnimationFrame(() => document.getElementById('entry-date')?.focus())
              }}
            >
              Enter hours
            </DarkButton>
          )
        }
      />

      <div role="tablist" aria-label="How to add time" onKeyDown={onTabListKeyDown} className="flex gap-1.5 pt-6">
        {MODES.map((m) => {
          const active = m.id === mode
          return (
            <button
              key={m.id}
              role="tab"
              id={`tab-${m.id}`}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              aria-controls="time-panel"
              onClick={() => setMode(m.id)}
              className={`flex h-10 items-center gap-2 rounded-sm border border-line px-3.5 text-body font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active ? 'border-brand-200 bg-brand-50 font-semibold text-brand' : 'bg-surface text-ink-muted hover:border-brand-200 hover:text-ink'
              }`}
            >
              <Icon tint name={m.icon} size={18} />
              {m.label}
            </button>
          )
        })}
      </div>

      <div id="time-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="pt-3.25">
        {mode === 'enter' && (
          <TimeEntryForm key={`${me.name}-${formKey}-${intent?.projectId ?? ''}`} initialProjectId={intent?.mode === 'log' ? intent.projectId : undefined} onSaved={setNotice} />
        )}
        {mode === 'import' && step === 'drop' && <ImportDropzone onFile={() => setStep('parsing')} />}
        {mode === 'import' && step === 'parsing' && <ParsingState />}
        {mode === 'import' && (step === 'mapping' || step === 'done') && <ColumnMapping onReupload={() => setStep('drop')} onSubmitted={() => setNotice('Time entry submitted successfully.')} />}
      </div>

      <EntriesSection ref={entriesRef} initialProjectFilter={intent?.mode === 'entries' ? intent.projectId : undefined} onNotice={setNotice} />
    </>
  )
}
