import { useState } from 'react'
import { DarkButton } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { Pill } from '../../components/Pill'
import { demoImport } from '../../data/store'

// Column widths from Figma (36:3889): 219.76 / 219.77 / 329.64 / 153.84 px.
const COLS = ['23.8%', '23.8%', '35.7%', '16.7%']
const TH = 'h-10.75 bg-table-head text-left align-middle text-7 font-normal text-ink-dim uppercase'
const TD = 'h-10.75 border-t border-line-mapping align-middle text-9 text-ink'

/**
 * "Confirm column mapping" (Figma 36:3871). After submit the same table stays visible with the
 * "Timesheet submitted" confirmation from the prototype code layer.
 */
export function ColumnMapping({ submitted, onSubmit }: { submitted: boolean; onSubmit: () => void }) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <section aria-labelledby="mapping-title" className="min-h-80 rounded-16 border border-line bg-surface p-5.25">
      <div className="flex items-center justify-between">
        <div>
          <div className="pt-0.5">
            <Pill tone="success">5 columns detected</Pill>
          </div>
          <h2 id="mapping-title" className="pt-2.5 text-19 text-ink">
            Confirm column mapping
          </h2>
          <p className="pt-0.75 text-8 text-ink-muted">{demoImport.fileName} · 1 entry ready · 1 project match needs confirmation</p>
        </div>
        {!submitted && <DarkButton onClick={onSubmit}>Confirm &amp; submit</DarkButton>}
      </div>

      <div className="mt-4.25 overflow-hidden rounded-11 border border-line">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {COLS.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className={`${TH} pl-3.25`}>Excel column</th>
              <th scope="col" className={TH}>Tally field</th>
              <th scope="col" className={TH}>Sample value</th>
              <th scope="col" className={`${TH} pr-3.25`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {demoImport.rows.map((r) => {
              const matched = r.certain || confirmed
              return (
                <tr key={r.column}>
                  <th scope="row" className={`${TD} pl-3.25 text-left font-normal`}>{r.column}</th>
                  <td className={TD}>{r.field}</td>
                  <td className={TD}>{r.sample}</td>
                  <td className={`${TD} pr-3.25`}>
                    <Pill tone={matched ? 'success' : 'accent'}>{matched ? 'Matched' : 'Confirm match'}</Pill>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {!submitted && !confirmed && (
        <div role="note" className="mt-3 flex items-center gap-2.5 rounded-10 border border-warn-line bg-warn-soft p-3">
          <span className="w-7 shrink-0">
            <Icon name="review-doc-warn" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-9 font-bold text-warn-ink">Confirm uncertain project match</p>
            <p className="py-0.75 text-8 text-warn-body">
              “Aster Labs Acq.” is closest to “Aster Labs v. Meridian Partners.” Tally will never assign an uncertain match silently.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmed(true)}
            className="h-7 shrink-0 rounded-13 border border-warn-button-line bg-white px-2.5 text-8 text-warn-ink transition-colors hover:bg-warn-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn-ink"
          >
            Use suggested project
          </button>
        </div>
      )}

      {submitted && (
        <div role="status" className="mx-auto mt-6 flex w-full max-w-117.5 items-center gap-3 rounded-12 border border-done-line bg-done-soft px-4.5 py-4 text-done-ink">
          <span className="grid size-9.5 shrink-0 place-items-center rounded-full bg-success-pill">
            <Icon name="check-green" size={13} />
          </span>
          <div>
            <h3 className="text-12 font-bold">Timesheet submitted</h3>
            <p className="pt-0.75 text-8 text-ink-muted">The imported entry is now in the same dataset as direct entries.</p>
          </div>
        </div>
      )}
    </section>
  )
}
