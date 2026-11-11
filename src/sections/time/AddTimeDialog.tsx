import { useEffect, useState } from 'react'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { Dialog } from '../../components/Modal'
import { onTabListKeyDown } from '../../components/tabKeys'
import { ColumnMapping } from './ColumnMapping'
import { ImportDropzone } from './ImportDropzone'
import { ParsingState } from './ParsingState'
import { TimeEntryForm } from './TimeEntryForm'

export type AddMode = 'enter' | 'import'

// Uploading a timesheet is the primary way to log time (owner request 2026-11-10), so it comes first.
const MODES: { id: AddMode; label: string; icon: string }[] = [
  { id: 'import', label: 'Upload timesheet', icon: 'upload-dark' },
  { id: 'enter', label: 'Enter hours directly', icon: 'clock-dark' },
]

/**
 * "Add time" dialog for both roles (owner request 2026-11-10): the enter-hours form (Figma 36:1257 / 36:12734)
 * and the Excel import flow (36:1933 / 36:3833 / 36:13228) as two tabs. Saving or submitting closes it with a
 * message for the page's toast.
 */
export function AddTimeDialog({
  initialMode = 'import',
  importNow = false,
  initialProjectId,
  onClose,
}: {
  initialMode?: AddMode
  /** A file was already dropped (Home), so the import starts parsing right away. */
  importNow?: boolean
  initialProjectId?: string
  onClose: (message?: string) => void
}) {
  const { me } = useDemo()
  const [mode, setMode] = useState<AddMode>(initialMode)
  const [step, setStep] = useState<'drop' | 'parsing' | 'mapping'>(importNow ? 'parsing' : 'drop')

  // Simulated parse, as in the prototype: 700ms then show the column mapping.
  useEffect(() => {
    if (step !== 'parsing') return
    const t = window.setTimeout(() => setStep('mapping'), 700)
    return () => window.clearTimeout(t)
  }, [step])

  return (
    <Dialog labelledBy="add-time-title" onClose={() => onClose()} className="w-220 rounded-xl p-7">
      <div className="mb-5 flex items-start justify-between">
        <h2 id="add-time-title" className="text-title font-semibold tracking-title">
          Add time
        </h2>
        <button
          type="button"
          onClick={() => onClose()}
          aria-label="Close"
          className="-mt-1 -mr-1 rounded-sm p-2 text-ink-muted transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div role="tablist" aria-label="How to add time" onKeyDown={onTabListKeyDown} className="flex gap-1.5">
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
              onClick={() => {
                setMode(m.id)
                setStep('drop')
              }}
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
        {mode === 'enter' && <TimeEntryForm key={me.name} initialProjectId={initialProjectId} onSaved={onClose} />}
        {mode === 'import' && step === 'drop' && <ImportDropzone onFile={() => setStep('parsing')} />}
        {mode === 'import' && step === 'parsing' && <ParsingState />}
        {mode === 'import' && step === 'mapping' && <ColumnMapping onReupload={() => setStep('drop')} onSubmitted={() => onClose('Time submitted.')} />}
      </div>
    </Dialog>
  )
}
