import { useState, type ReactNode } from 'react'
import { DarkButton, OutlineButton } from '../components/Button'
import { SegmentedRadio } from '../components/Field'
import { ScheduleRatesDrawer } from '../sections/settings/ScheduleRatesDrawer'
import { Modal } from '../components/Modal'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Switch } from '../components/Switch'
import { onTabListKeyDown } from '../components/tabKeys'
import { initials, money, people } from '../data/store'

const TABS = ['Billing rules', 'AI preferences', 'Team & permissions', 'Integrations', 'Data & privacy'] as const
type Tab = (typeof TABS)[number]

const INTRO: Record<Tab, string> = {
  'Billing rules': 'Rates apply based on the work date. Existing entries keep their historical rate.',
  'AI preferences': 'Tally uses deterministic math for amounts and AI only for language and ambiguous matching.',
  'Team & permissions': 'Employees only see assigned projects, their own entries, and billing requests sent to them.',
  Integrations: 'These connections are optional. External delivery is not active in this prototype.',
  'Data & privacy': 'Prototype controls below explain intended choices; they do not claim production security safeguards.',
}

const AVATAR = 'grid size-7 shrink-0 place-items-center rounded-full bg-teammate text-caption'
const ROW = 'flex items-center gap-2.5 border-b border-line-row py-3.25'

function BillingRules() {
  const { store, update } = useDemo()
  // Column widths from Figma (36:9839): 237.59 / 158.41 / 158.40 / 138.60 px.
  const cols = ['34.3%', '22.9%', '22.9%', '20%']
  const TH = 'h-8.5 bg-table-head text-left align-middle text-caption font-normal text-ink-dim uppercase'
  const TD = 'h-12.25 border-t border-line-row align-middle text-small text-ink'

  const [scheduling, setScheduling] = useState(false)
  const scheduled = Object.keys(store.scheduledRates).length > 0
  const PRESETS = ['8', '10', '12', 'Custom'] as const
  const [customOpen, setCustomOpen] = useState(() => ![8, 10, 12].includes(store.threshold))
  const preset = customOpen ? 'Custom' : (String(store.threshold) as (typeof PRESETS)[number])
  const setThreshold = (n: number) =>
    update((s) => {
      s.threshold = n
    })

  return (
    <>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-caption text-ink-muted">{scheduled ? 'Time worked before Jan 1 keeps 2025 rates.' : ''}</p>
        <OutlineButton onClick={() => setScheduling(true)}>{scheduled ? 'Edit 2026 schedule' : 'Schedule 2026 rates'}</OutlineButton>
      </div>
      {scheduling && <ScheduleRatesDrawer onClose={() => setScheduling(false)} />}
      <div className="mt-3 overflow-hidden rounded-md border border-line">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {cols.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className={`${TH} pl-3`}>Employee</th>
              <th scope="col" className={TH}>Standard rate</th>
              <th scope="col" className={TH}>Effective date</th>
              <th scope="col" className={`${TH} pr-3`}>Optional override</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(store.rates).map(([name, rate]) => (
              <tr key={name} className="transition-colors duration-150 hover:bg-brand-25">
                <th scope="row" className={`${TD} pl-3 text-left`}>
                  <span className="flex items-center gap-2">
                    <span className={`${AVATAR} font-normal`} aria-hidden="true">
                      {initials(name)}
                    </span>
                    <b className="font-semibold">{name}</b>
                  </span>
                </th>
                <td className={TD}>
                  <label className="flex items-center">
                    <span aria-hidden="true">$&nbsp;</span>
                    <span className="sr-only">Standard rate for {name}, dollars per hour</span>
                    <input
                      type="number"
                      min="0"
                      value={rate}
                      onChange={(e) =>
                        update((s) => {
                          s.rates[name] = Number(e.target.value)
                        })
                      }
                      className="h-7 w-19.5 rounded-sm border border-line bg-transparent p-1.5 text-small focus:outline-2 focus:outline-accent"
                    />
                  </label>
                  {store.scheduledRates[name] !== undefined && (
                    <span className="mt-1 flex items-center gap-1 text-caption">
                      <span className="text-ink-muted">→ {money(store.scheduledRates[name])}</span>
                      <span className="rounded-lg bg-success-pill px-1.5 py-0.5 font-semibold text-success-ink">Scheduled · effective Jan 1, 2026</span>
                    </span>
                  )}
                </td>
                <td className={TD}>Jan 1, 2025</td>
                <td className={`${TD} pr-3 text-center`}>
                  {/* Inert in the prototype code layer too; no project-override flow is designed. */}
                  <button type="button" className="rounded-md text-caption underline hover:text-link focus-visible:outline-2 focus-visible:outline-accent">
                    Set by project
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 border-b border-line-row py-3.75">
        <span className="flex-1">
          <b id="threshold-label" className="block text-small font-semibold">
            Daily-hours warning threshold
          </b>
          <small className="block pt-0.75 text-caption text-ink-muted">Checks each person's total across all projects for a day.</small>
        </span>
        <div className="w-60">
          <SegmentedRadio
            name="threshold"
            options={PRESETS}
            value={preset}
            labelledBy="threshold-label"
            onChange={(v) => {
              setCustomOpen(v === 'Custom')
              if (v !== 'Custom') setThreshold(Number(v))
            }}
          />
        </div>
        {customOpen && (
          <label className="flex items-center">
            <span className="sr-only">Custom threshold in hours</span>
            <input
              type="number"
              min="1"
              max="24"
              value={store.threshold}
              onChange={(e) => Number(e.target.value) > 0 && setThreshold(Number(e.target.value))}
              className="h-9.25 w-17.5 rounded-sm border border-line bg-transparent p-1.75 text-lead focus:outline-2 focus:outline-accent"
            />
            <em className="pl-1.5 text-caption text-ink-muted">hours</em>
          </label>
        )}
      </div>
    </>
  )
}

function AiPreferences() {
  const { store } = useDemo()
  const checks = ['Unusually high daily hours', 'Possible duplicate entries', 'Vague descriptions', 'Missing companion time', 'Unrecognized project names']
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(checks.map((c) => [c, true])))

  return (
    <div className="mt-5.5">
      {checks.map((c, i) => (
        <div key={c} className="flex items-center border-b border-line-row py-3.75">
          <span className="flex-1">
            <b id={`ai-${i}`} className="block text-small font-semibold">
              {c}
            </b>
            <small className="block pt-0.75 text-caption text-ink-muted">
              {i === 0 ? `Current threshold: ${store.threshold} hours` : 'Require human review before invoice changes'}
            </small>
          </span>
          <Switch checked={enabled[c]} labelledBy={`ai-${i}`} onChange={(v) => setEnabled((x) => ({ ...x, [c]: v }))} />
        </div>
      ))}
      <div className="mt-4.5 flex gap-2.5 rounded-md bg-human p-3.75 text-success-ink">
        <Icon name="check-foot" size={18} />
        <div>
          <b className="block text-small font-semibold">Human approval is required</b>
          <p className="pt-0.75 text-caption">Tally cannot approve or send a client invoice.</p>
        </div>
      </div>
    </div>
  )
}

function TeamPermissions() {
  return (
    <div className="mt-5.5">
      {people.slice(0, 3).map((p, i) => (
        <div key={p} className={ROW}>
          <span className={AVATAR} aria-hidden="true">
            {initials(p)}
          </span>
          <div className="flex-1">
            <b className="block text-small font-semibold">{p}</b>
            <small className="block pt-0.75 text-caption text-ink-muted">{i === 0 ? 'All projects' : 'Assigned projects only'}</small>
          </div>
          {/* Figma fixes this pill at 28×28 (text overflows); sized to content here. */}
          <span className="rounded-lg bg-teammate px-2.25 py-1.25 text-caption font-semibold text-ink-neutral">{i === 0 ? 'Partner / reviewer' : 'Employee'}</span>
        </div>
      ))}
    </div>
  )
}

function Integrations() {
  const items = [
    ['Email', 'In-app works · external email demo only', 'integration-email'],
    ['QuickBooks', 'Future capability', 'integration-folder'],
    ['Calendar', 'Optional context for missing time', 'integration-calendar'],
    ['Time tracking platforms', 'Future capability', 'integration-folder'],
  ]
  return (
    <div className="mt-5.5">
      {items.map(([name, hint, icon]) => (
        <div key={name} className={ROW}>
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-project-tile">
            <Icon name={icon} size={18} />
          </span>
          <div className="flex-1">
            <b className="block text-small font-semibold">{name}</b>
            <small className="block pt-0.75 text-caption text-ink-muted">{hint}</small>
          </div>
          {/* Connections are not available in the prototype. */}
          <OutlineButton aria-label={`${name}: not connected`}>Not connected</OutlineButton>
        </div>
      ))}
    </div>
  )
}

function PrivacyCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-privacy p-4.25">
      <h3 className="font-semibold text-body">{title}</h3>
      <p className="pt-1.25 text-small leading-flag text-ink-neutral">{children}</p>
    </div>
  )
}

const clearedLabel = (iso: string) => {
  const d = new Date(iso)
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return d.toDateString() === new Date().toDateString() ? `today, ${time}` : `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`
}

/** "AI processing" card (spec item 8): auto-clear toggle, manual clear with confirmation, last-cleared time. */
function AiProcessingCard() {
  const { store, update, me } = useDemo()
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="rounded-lg border border-line bg-privacy p-4.25">
      <h3 className="font-semibold text-body">AI processing</h3>
      {/* Spec sentence "Nothing is retained by the provider after processing." held: it contradicts
          "What AI may process" below and needs confirmation before it is shown (antislop R-36). */}
      <p className="pt-1.25 text-small leading-flag text-ink-neutral">Descriptions are sent to the AI model for review only.</p>
      <div className="mt-3 flex items-center border-t border-line-row pt-3">
        <span id="auto-clear" className="flex-1 text-small font-semibold">
          Auto-clear AI working data after each invoice is approved
        </span>
        <Switch
          checked={store.ai.autoClear}
          labelledBy="auto-clear"
          onChange={(v) =>
            update((s) => {
              s.ai.autoClear = v
            })
          }
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <OutlineButton onClick={() => setConfirming(true)}>Clear AI working data now</OutlineButton>
        <p role="status" className="text-caption text-ink-muted">
          {store.ai.lastCleared ? `Last cleared: ${clearedLabel(store.ai.lastCleared)}` : 'Not cleared yet'}
        </p>
      </div>
      {confirming && (
        <Modal
          eyebrow="Data & privacy"
          title="Clear AI working data?"
          onClose={() => setConfirming(false)}
          footer={
            <>
              <OutlineButton onClick={() => setConfirming(false)}>Cancel</OutlineButton>
              <DarkButton
                onClick={() => {
                  update((s) => {
                    s.ai.lastCleared = new Date().toISOString()
                    s.audit.unshift(`${me.firstName} cleared temporary AI working data`)
                  })
                  setConfirming(false)
                }}
              >
                Clear working data
              </DarkButton>
            </>
          }
        >
          <p className="mt-3 text-small leading-normal text-ink-neutral">
            Invoices and time records are kept. Only temporary AI working data is removed.
          </p>
        </Modal>
      )}
    </div>
  )
}

function DataPrivacy() {
  return (
    <>
      <div className="mt-5.5 flex flex-col gap-2.5">
        <AiProcessingCard />
        <PrivacyCard title="What belongs to your firm">
          Invoices, approved time entries, project records, and required accounting history remain firm records.
        </PrivacyCard>
        <PrivacyCard title="What AI may process">
          Selected descriptions and project context may be sent to a configured external model. Provider retention depends on the future production agreement.
        </PrivacyCard>
        <PrivacyCard title="Temporary working data">
          Removing temporary AI working data is not the same as deleting invoices or legally required accounting records.
        </PrivacyCard>
      </div>
      {/* Both actions are inert in the prototype code layer. */}
      <div className="flex gap-2 pt-4.5">
        <OutlineButton className="gap-2">
          <Icon name="download-dark" size={18} /> Export firm data
        </OutlineButton>
        <OutlineButton>Review retention settings</OutlineButton>
      </div>
    </>
  )
}

const PANELS: Record<Tab, () => ReactNode> = {
  'Billing rules': BillingRules,
  'AI preferences': AiPreferences,
  'Team & permissions': TeamPermissions,
  Integrations,
  'Data & privacy': DataPrivacy,
}

/** Settings (Figma 36:9778 / 36:10273 / 36:10647 / 36:11056; AI preferences from the code layer). */
export default function Settings() {
  const [tab, setTab] = useState<Tab>('Billing rules')
  const Panel = PANELS[tab]

  return (
    <>
      <PageTitle eyebrow="Workspace controls" title="Settings" description="Plain-language controls for billing, review, access, and connected services." />
      <div className="grid grid-cols-[210px_1fr] gap-3.5 pt-6">
        <div role="tablist" aria-orientation="vertical" aria-label="Settings sections" onKeyDown={onTabListKeyDown} className="flex flex-col self-start rounded-lg border border-line bg-surface shadow-card-faint p-1.75">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              id={`settings-tab-${t}`}
              aria-selected={tab === t}
              tabIndex={tab === t ? 0 : -1}
              aria-controls="settings-panel"
              onClick={() => setTab(t)}
              className={`h-10 rounded-sm px-3 text-left text-body transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${
                tab === t ? 'bg-brand-50 font-semibold text-brand' : 'text-ink-muted hover:bg-brand-25 hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <section id="settings-panel" role="tabpanel" aria-labelledby={`settings-tab-${tab}`} className="min-h-155 rounded-lg border border-line bg-surface shadow-card p-6.25">
          <h2 className="text-title tracking-title font-semibold text-ink">{tab}</h2>
          <p className="pt-1.25 text-small text-ink-muted">{INTRO[tab]}</p>
          <Panel />
        </section>
      </div>
    </>
  )
}
