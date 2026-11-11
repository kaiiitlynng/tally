import { useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { uid, useDemo } from '../../components/DemoContext'
import { Select } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { Pill, type PillTone } from '../../components/Pill'
import { demoImport, demoToday, entryFromRow, partner, projectName } from '../../data/store'
import { FIRST, TABLE, TABLE_WRAP, TD, TH } from '../../components/tableStyles'

// Column widths from Figma (36:3889): 219.76 / 219.77 / 329.64 / 153.84 px.
const COLS = ['23.8%', '23.8%', '35.7%', '16.7%']

type RowStatus = 'Matched' | 'Confirm match' | 'No matching project'
const TONE: Record<RowStatus, PillTone> = { Matched: 'success', 'Confirm match': 'accent', 'No matching project': 'danger' }

/**
 * "Confirm column mapping" (Figma 36:3871) plus per-row project matching (spec item 3). Matched rows are
 * submitted; rows whose matter matches no project are held for the partner.
 */
export function ColumnMapping({ onReupload, onSubmitted }: { onReupload: () => void; onSubmitted: () => void }) {
  const { store, update, role } = useDemo()
  const [confirmed, setConfirmed] = useState(false)
  // Projects the employee picked for unmatched rows, by spreadsheet row number.
  const [picked, setPicked] = useState<Record<number, string>>({})
  const [choosing, setChoosing] = useState<number | null>(null)
  const [choice, setChoice] = useState('')
  const [submitted, setSubmitted] = useState<{ held: number } | null>(null)

  const status = (r: (typeof demoImport.rows)[number]): RowStatus =>
    picked[r.row] ? 'Matched' : r.suggest ? (confirmed ? 'Matched' : 'Confirm match') : 'No matching project'
  const projectFor = (r: (typeof demoImport.rows)[number]) => picked[r.row] ?? r.suggest
  const unmatched = demoImport.rows.filter((r) => !projectFor(r))
  const needsConfirm = demoImport.rows.filter((r) => status(r) === 'Confirm match').length
  const ready = demoImport.rows.length - unmatched.length
  const assigned = store.projects.filter((p) => p.people.includes(demoImport.employee) && p.status === 'Active')

  function submit() {
    const held = unmatched
    update((s) => {
      demoImport.rows.forEach((r) => {
        const pid = picked[r.row] ?? r.suggest
        if (pid) s.entries.push(entryFromRow(s, { ...r, employee: demoImport.employee, file: demoImport.fileName }, pid, uid()))
      })
      held.forEach((r) => {
        s.heldRows.push({ id: uid(), employee: demoImport.employee, matter: r.matter, date: r.date, hours: r.hours, description: r.description, file: demoImport.fileName, row: r.row })
        s.messages.unshift({
          id: uid(),
          from: demoImport.employee,
          to: partner.name,
          subject: `Unrecognized case: ${r.matter}`,
          body: `${demoImport.employee.split(' ')[0]} submitted time for an unrecognized case: '${r.matter}'. The entry is held until it is mapped to a project.`,
          time: 'Just now',
          unreadBy: ['partner'],
          status: 'Open',
          replies: [],
        })
      })
      s.lastSubmitted[demoImport.employee] = demoToday
      s.audit.unshift(`${demoImport.employee} submitted ${ready} Excel ${ready === 1 ? 'entry' : 'entries'}${held.length ? `; ${held.length} held for an unrecognized case` : ''}`)
    })
    setSubmitted({ held: held.length })
    onSubmitted()
  }

  const summary = [`${ready} ${ready === 1 ? 'entry' : 'entries'} ready`, needsConfirm && `${needsConfirm} project match needs confirmation`, unmatched.length && `${unmatched.length} unrecognized project`]
    .filter(Boolean)
    .join(' · ')

  return (
    <section aria-labelledby="mapping-title" className="min-h-80 rounded-lg border border-line bg-surface shadow-card p-5.25">
      <div className="flex items-center justify-between">
        <div>
          <div className="pt-0.5">
          </div>
          <h2 id="mapping-title" className="font-semibold pt-2.5 text-title-sm tracking-title text-ink">
            Check the columns
          </h2>
          <p className="pt-0.75 text-caption text-ink-muted">
            {demoImport.fileName} · {summary}
          </p>
        </div>
        {!submitted && <DarkButton onClick={submit}>Confirm &amp; submit</DarkButton>}
      </div>

      <div className={`mt-4.25 ${TABLE_WRAP}`}>
        <table className={TABLE}>
          <colgroup>
            {COLS.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className={`${TH} ${FIRST}`}>Excel column</th>
              <th scope="col" className={TH}>Tally field</th>
              <th scope="col" className={TH}>Sample value</th>
              <th scope="col" className={TH}>Status</th>
            </tr>
          </thead>
          <tbody>
            {demoImport.columns.map((c) => {
              const s: RowStatus = c.field === 'Project' ? status(demoImport.rows[0]) : 'Matched'
              return (
                <tr key={c.column}>
                  <th scope="row" className={`${TD} ${FIRST} text-left font-normal`}>{c.column}</th>
                  <td className={TD}>{c.field}</td>
                  <td className={TD}>{c.sample}</td>
                  <td className={TD}>
                    <Pill tone={TONE[s]}>{s}</Pill>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h3 className="mt-4 text-small font-semibold text-ink">Rows in this file</h3>
      <div className={`mt-1.5 ${TABLE_WRAP}`}>
        <table className={TABLE}>
          <thead>
            <tr>
              <th scope="col" className={`${TH} w-[14%] ${FIRST}`}>Date</th>
              <th scope="col" className={`${TH} w-[24%]`}>Matter in file</th>
              <th scope="col" className={`${TH} w-[30%]`}>Tally project</th>
              <th scope="col" className={`${TH} w-[10%]`}>Hours</th>
              <th scope="col" className={TH}>Status</th>
            </tr>
          </thead>
          <tbody>
            {demoImport.rows.map((r) => {
              const s = status(r)
              const pid = projectFor(r)
              return (
                <tr key={r.row}>
                  <td className={`${TD} ${FIRST}`}>{r.date.slice(5).replace('-', '/')}</td>
                  <td className={TD}>{r.matter}</td>
                  <td className={TD}>{pid ? projectName(store, pid) : <span className="text-ink-muted">Held: no match</span>}</td>
                  <td className={TD}>{r.hours.toFixed(1)}</td>
                  <td className={TD}>
                    <Pill tone={TONE[s]}>{s}</Pill>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {!submitted && !confirmed && demoImport.rows.some((r) => r.suggest && !picked[r.row]) && (
        <div role="note" className="mt-3 flex items-center gap-2.5 rounded-md border border-warn-line bg-warn-soft p-3">
          <span className="w-7 shrink-0">
            <Icon name="review-doc-warn" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-small font-semibold text-warn-ink">Confirm uncertain project match</p>
            <p className="py-0.75 text-caption text-warn-body">
              “Aster Labs Acq.” is closest to “Aster Labs v. Meridian Partners.” Tally will never assign an uncertain match silently.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmed(true)}
            className="h-7 shrink-0 rounded-lg border border-warn-button-line bg-white px-2.5 text-caption text-warn-ink transition-colors hover:bg-warn-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn-ink"
          >
            Use suggested project
          </button>
        </div>
      )}

      {/* Employee blocking card for each unrecognized case (spec item 3). */}
      {!submitted &&
        role === 'employee' &&
        unmatched.map((r) => (
          <div key={r.row} role="alert" className="mt-3 rounded-md border border-error-line bg-error-soft p-3">
            <p className="text-small font-semibold text-error-ink">
              '{r.matter}' isn't a project in Tally. Fix the case name in your file and re-upload, or pick from your assigned projects.
            </p>
            <p className="pt-0.75 text-caption text-ink-muted">The rest of the file can still be submitted; this row is held until it has a project.</p>
            {choosing === r.row ? (
              <div className="mt-2.5 flex items-center gap-2">
                <Select aria-label={`Project for ${r.matter}`} value={choice} onChange={(e) => setChoice(e.target.value)} className="w-72">
                  <option value="">Select a project</option>
                  {assigned.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
                <DarkButton
                  disabled={!choice}
                  className="disabled:border-ink-divider disabled:bg-segment disabled:text-ink-muted"
                  onClick={() => {
                    setPicked({ ...picked, [r.row]: choice })
                    setChoosing(null)
                    setChoice('')
                  }}
                >
                  Use project
                </DarkButton>
                <OutlineButton onClick={() => setChoosing(null)}>Cancel</OutlineButton>
              </div>
            ) : (
              <div className="mt-2.5 flex gap-2">
                <OutlineButton onClick={onReupload}>Re-upload file</OutlineButton>
                <DarkButton onClick={() => setChoosing(r.row)}>Choose project</DarkButton>
              </div>
            )}
          </div>
        ))}

      {submitted && (
        <div role="status" className="mx-auto mt-6 flex w-full max-w-117.5 items-center gap-3 rounded-lg border border-done-line bg-done-soft px-4.5 py-4 text-done-ink">
          <span className="grid shrink-0 place-items-center">
            <Icon name="check-green" size={13} />
          </span>
          <div>
            <h3 className="text-body font-semibold">Timesheet submitted</h3>
            {submitted.held > 0 && (
              <p className="pt-0.75 text-caption text-ink-muted">
                {submitted.held} {submitted.held === 1 ? 'row is' : 'rows are'} held until {role === 'employee' ? 'Vanessa maps it' : 'it is mapped'} to a project.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
