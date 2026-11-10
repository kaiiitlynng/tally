import { useState } from 'react'
import { DarkButton, OutlineButton } from '../../components/Button'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { Dialog } from '../../components/Modal'
import { initials, money } from '../../data/store'

const INPUT = 'h-8 w-22 rounded-sm border border-line bg-white px-2 text-small focus:outline-2 focus:outline-accent'

/** "Schedule 2026 rates" side panel (spec item 6). Effective date is fixed to Jan 1, 2026. */
export function ScheduleRatesDrawer({ onClose }: { onClose: () => void }) {
  const { store, update, me } = useDemo()
  const [rates, setRates] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(store.rates).map(([n, r]) => [n, String(store.scheduledRates[n] ?? r)])),
  )
  const [pct, setPct] = useState('5')
  const valid = Object.values(rates).every((r) => Number(r) > 0)

  function applyPct() {
    const p = Number(pct)
    if (!Number.isFinite(p)) return
    setRates(Object.fromEntries(Object.entries(store.rates).map(([n, r]) => [n, String(Math.round(r * (1 + p / 100)))])))
  }

  function save() {
    if (!valid) return
    update((s) => {
      s.scheduledRates = Object.fromEntries(Object.entries(rates).map(([n, r]) => [n, Number(r)]))
      s.audit.unshift(`${me.firstName} scheduled 2026 rates, effective Jan 1, 2026`)
    })
    onClose()
  }

  return (
    <Dialog labelledBy="rates-title" onClose={onClose} placement="right" className="flex w-107.5 flex-col p-6.25">
      <div className="flex items-center justify-between border-b border-line pb-3.75">
        <div>
          <h2 id="rates-title" className="text-title tracking-title font-semibold">
            Schedule 2026 rates
          </h2>
        </div>
        <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1 hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent">
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="mt-4 flex items-end gap-2 rounded-md bg-filter-panel p-3">
        <label className="flex flex-col gap-1 text-caption font-semibold text-filter-label">
          Apply % increase to all
          <span className="flex items-center gap-1 text-small font-normal text-ink">
            <input inputMode="decimal" value={pct} onChange={(e) => setPct(e.target.value)} className={`${INPUT} w-16`} aria-label="Percent increase" />%
          </span>
        </label>
        <OutlineButton onClick={applyPct} className="h-8">
          Apply
        </OutlineButton>
      </div>

      <table className="mt-4 w-full text-small">
        <thead>
          <tr className="text-left text-caption text-ink-th uppercase">
            <th className="pb-2 font-normal">Employee</th>
            <th className="pb-2 font-normal">Current</th>
            <th className="pb-2 font-normal">New rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(store.rates).map(([name, rate]) => (
            <tr key={name} className="border-t border-drawer-row">
              <th scope="row" className="py-2.25 text-left font-semibold">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-teammate text-caption font-normal">
                    {initials(name)}
                  </span>
                  {name}
                </span>
              </th>
              <td className="py-2.25">{money(rate)}</td>
              <td className="py-2.25">
                <label className="flex items-center gap-1">
                  <span aria-hidden="true">$</span>
                  <span className="sr-only">New 2026 rate for {name}, dollars per hour</span>
                  <input inputMode="decimal" value={rates[name]} aria-invalid={!(Number(rates[name]) > 0)} onChange={(e) => setRates({ ...rates, [name]: e.target.value })} className={`${INPUT} aria-invalid:border-error-line`} />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-4 flex justify-between border-t border-line pt-3 text-small">
        <dt className="text-ink-muted">Effective date</dt>
        <dd className="font-semibold">Jan 1, 2026 (fixed)</dd>
      </dl>
      <p className="mt-2 text-caption text-ink-muted">Time worked before Jan 1 keeps 2025 rates.</p>

      <div className="mt-auto flex justify-end gap-2 pt-6">
        <OutlineButton onClick={onClose}>Cancel</OutlineButton>
        <DarkButton onClick={save} disabled={!valid} className="disabled:border-ink-divider disabled:bg-segment disabled:text-ink-muted">
          Save schedule
        </DarkButton>
      </div>
    </Dialog>
  )
}
