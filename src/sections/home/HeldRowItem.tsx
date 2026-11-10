import { useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { uid, useDemo } from '../../components/DemoContext'
import { Field, Select } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import { entryFromRow, type HeldRow } from '../../data/store'
import { NewProjectModal } from '../clients/NewProjectModal'

const ACTION = 'rounded-md text-caption text-ink underline hover:text-link focus-visible:outline-2 focus-visible:outline-accent'

/** Needs attention row for time held on an unrecognized case (spec item 3). */
export function HeldRowItem({ row }: { row: HeldRow }) {
  const { store, update, me, toast } = useDemo()
  const [mode, setMode] = useState<'create' | 'map' | null>(null)
  const [projectId, setProjectId] = useState('')
  const first = row.employee.split(' ')[0]

  function mapTo(pid: string) {
    update((s) => {
      s.entries.push(entryFromRow(s, row, pid, uid()))
      s.heldRows = s.heldRows.filter((h) => h.id !== row.id)
      s.audit.unshift(`${me.firstName} mapped '${row.matter}' time to ${s.projects.find((p) => p.id === pid)?.name}`)
    })
    setMode(null)
  }

  function ask() {
    update((s) => {
      s.messages.unshift({
        id: uid(),
        from: me.name,
        to: row.employee,
        subject: `Which project is '${row.matter}'?`,
        body: `Your ${row.hours.toFixed(1)} hours on ${row.date.slice(5).replace('-', '/')} list '${row.matter}', which isn't a project in Tally. Which project should this time go to?`,
        time: 'Just now',
        unreadBy: ['employee'],
        status: 'Open',
        replies: [],
      })
      s.heldRows.find((h) => h.id === row.id)!.asked = true
      s.audit.unshift(`${me.firstName} asked ${first} about '${row.matter}'`)
    })
    toast(`Message sent to ${first}`)
  }

  return (
    <li className="flex items-start gap-2.25 border-b border-line-row py-3.25">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-warn-tile">
        <Icon name="review-doc-warn" size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-small font-semibold text-ink">
          {first} submitted time for an unrecognized case: '{row.matter}'.
        </p>
        <p className="pt-0.5 text-caption text-ink-muted">
          {row.hours.toFixed(1)} hours held{row.asked ? ` · asked ${first}` : ''}
        </p>
        <div className="flex flex-wrap gap-x-2.5 gap-y-1 pt-1.5">
          <button type="button" className={ACTION} onClick={() => setMode('create')}>
            Create project
          </button>
          <button type="button" className={ACTION} onClick={() => setMode('map')}>
            Map to existing
          </button>
          <button type="button" className={ACTION} onClick={ask} disabled={row.asked}>
            Ask {first}
          </button>
        </div>
      </div>

      {mode === 'create' && <NewProjectModal initialName={row.matter} onClose={() => setMode(null)} onCreated={(id) => mapTo(id)} />}
      {mode === 'map' && (
        <Modal
          eyebrow="Unrecognized case"
          title="Map to existing project"
          onClose={() => setMode(null)}
          footer={
            <>
              <OutlineButton onClick={() => setMode(null)}>Cancel</OutlineButton>
              <DarkButton disabled={!projectId} className="disabled:border-ink-divider disabled:bg-segment disabled:text-ink-muted" onClick={() => mapTo(projectId)}>
                Map time
              </DarkButton>
            </>
          }
        >
          <p className="mt-2 mb-3 text-small text-ink-muted">
            {row.hours.toFixed(1)} hours from {row.file} listed as '{row.matter}'.
          </p>
          <Field label="Project" htmlFor="map-project">
            <Select id="map-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">Select a project</option>
              {store.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
        </Modal>
      )}
    </li>
  )
}
