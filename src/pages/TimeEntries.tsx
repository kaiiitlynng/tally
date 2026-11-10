import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { DarkButton } from '../components/Button'
import { uid, useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { demoImport } from '../data/store'
import { ColumnMapping } from '../sections/time/ColumnMapping'
import { ImportDropzone } from '../sections/time/ImportDropzone'
import { ParsingState } from '../sections/time/ParsingState'
import { SubmittedTimeTable } from '../sections/time/SubmittedTimeTable'
import { TimeEntryForm } from '../sections/time/TimeEntryForm'

type Mode = 'enter' | 'import'

const MODES: { id: Mode; label: string; icon: string; activeIcon: string }[] = [
  { id: 'enter', label: 'Enter hours directly', icon: 'clock-dark', activeIcon: 'clock-white' },
  { id: 'import', label: 'Import Excel', icon: 'upload-dark', activeIcon: 'upload-white' },
]

/** Time Entries (Figma 36:1257 enter · 36:1933 import · 36:3833 column mapping). */
export default function TimeEntries() {
  const [params, setParams] = useSearchParams()
  const mode: Mode = params.get('mode') === 'import' ? 'import' : 'enter'
  const [step, setStep] = useState<'drop' | 'parsing' | 'mapping' | 'done'>('drop')
  const { update } = useDemo()
  const dateRef = useRef<HTMLInputElement>(null)

  // Simulated parse, as in the prototype: 700ms then show the column mapping.
  useEffect(() => {
    if (step !== 'parsing') return
    const t = window.setTimeout(() => setStep('mapping'), 700)
    return () => window.clearTimeout(t)
  }, [step])

  function setMode(next: Mode) {
    setStep('drop')
    setParams(next === 'import' ? { mode: 'import' } : {}, { replace: true })
  }

  function confirmImport() {
    update((s) => {
      s.entries.push({ ...demoImport.entry, id: uid() })
      s.submissions[demoImport.entry.employee] = 'Submitted'
      s.audit.unshift(`${demoImport.entry.employee} submitted a validated Excel time entry`)
    })
    setStep('done')
  }

  return (
    <>
      <PageTitle
        eyebrow="One shared billing dataset"
        title="Time Entries"
        description="Enter hours in Tally or import Excel. Both follow the same review and invoice process."
        actions={
          <DarkButton
            leadingIcon="plus-white"
            onClick={() => {
              setMode('enter')
              // Wait for the form to mount before focusing its first field.
              requestAnimationFrame(() => dateRef.current?.focus())
            }}
          >
            Enter hours
          </DarkButton>
        }
      />

      <div role="tablist" aria-label="How to add time" className="flex gap-1.5 pt-6">
        {MODES.map((m) => {
          const active = m.id === mode
          return (
            <button
              key={m.id}
              role="tab"
              id={`tab-${m.id}`}
              aria-selected={active}
              aria-controls="time-panel"
              onClick={() => setMode(m.id)}
              className={`flex h-9.5 items-center gap-1.75 rounded-18 border border-line px-3.25 text-9 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark ${
                active ? 'bg-dark text-white' : 'bg-surface-soft text-ink hover:bg-white'
              }`}
            >
              <Icon name={active ? m.activeIcon : m.icon} size={18} />
              {m.label}
            </button>
          )
        })}
      </div>

      <div id="time-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="pt-3.25">
        {mode === 'enter' && <TimeEntryForm dateRef={dateRef} />}
        {mode === 'import' && step === 'drop' && <ImportDropzone onFile={() => setStep('parsing')} />}
        {mode === 'import' && step === 'parsing' && <ParsingState />}
        {mode === 'import' && (step === 'mapping' || step === 'done') && (
          <ColumnMapping submitted={step === 'done'} onSubmit={confirmImport} />
        )}
      </div>

      <SubmittedTimeTable />
    </>
  )
}
