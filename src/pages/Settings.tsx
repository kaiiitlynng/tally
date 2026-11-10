import { useState, type ReactNode } from 'react'
import { OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Switch } from '../components/Switch'
import { initials, people } from '../data/store'

const TABS = ['Billing rules', 'AI preferences', 'Team & permissions', 'Integrations', 'Data & privacy'] as const
type Tab = (typeof TABS)[number]

const INTRO: Record<Tab, string> = {
  'Billing rules': 'Rates apply based on the work date. Existing entries keep their historical rate.',
  'AI preferences': 'Tally uses deterministic math for amounts and AI only for language and ambiguous matching.',
  'Team & permissions': 'Employees only see assigned projects, their own entries, and billing requests sent to them.',
  Integrations: 'These connections are optional. External delivery is not active in this prototype.',
  'Data & privacy': 'Prototype controls below explain intended choices; they do not claim production security safeguards.',
}

const AVATAR = 'grid size-7 shrink-0 place-items-center rounded-full bg-teammate text-7'
const ROW = 'flex items-center gap-2.5 border-b border-line-row py-3.25'

function BillingRules() {
  const { store, update } = useDemo()
  // Column widths from Figma (36:9839): 237.59 / 158.41 / 158.40 / 138.60 px.
  const cols = ['34.3%', '22.9%', '22.9%', '20%']
  const TH = 'h-8.5 bg-table-head text-left align-middle text-7 font-normal text-ink-dim uppercase'
  const TD = 'h-12.25 border-t border-line-row align-middle text-9 text-ink'

  return (
    <>
      <div className="mt-5.5 overflow-hidden rounded-11 border border-line">
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
              <tr key={name}>
                <th scope="row" className={`${TD} pl-3 text-left`}>
                  <span className="flex items-center gap-2">
                    <span className={`${AVATAR} font-normal`} aria-hidden="true">
                      {initials(name)}
                    </span>
                    <b className="font-bold">{name}</b>
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
                      className="h-7 w-19.5 rounded-7 border border-line bg-transparent p-1.5 text-9 focus:outline-2 focus:outline-dark/20"
                    />
                  </label>
                </td>
                <td className={TD}>Jan 1, 2025</td>
                <td className={`${TD} pr-3 text-center`}>
                  {/* Inert in the prototype code layer too; no project-override flow is designed. */}
                  <button type="button" className="rounded-10 text-8 underline hover:text-link focus-visible:outline-2 focus-visible:outline-dark">
                    Set by project
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <label className="flex items-center border-b border-line-row py-3.75">
        <span className="flex-1">
          <b className="block text-10 font-bold">Daily-hours warning threshold</b>
          <small className="block pt-0.75 text-8 text-ink-muted">Flag daily totals that need a human look.</small>
        </span>
        <input
          type="number"
          min="1"
          max="24"
          value={store.threshold}
          onChange={(e) =>
            update((s) => {
              s.threshold = Number(e.target.value)
            })
          }
          className="h-9.25 w-17.5 rounded-8 border border-line bg-transparent p-1.75 text-14 focus:outline-2 focus:outline-dark/20"
        />
        <em className="pl-1.5 text-8 text-ink-muted">hours</em>
      </label>
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
            <b id={`ai-${i}`} className="block text-10 font-bold">
              {c}
            </b>
            <small className="block pt-0.75 text-8 text-ink-muted">
              {i === 0 ? `Current threshold: ${store.threshold} hours` : 'Require human review before invoice changes'}
            </small>
          </span>
          <Switch checked={enabled[c]} labelledBy={`ai-${i}`} onChange={(v) => setEnabled((x) => ({ ...x, [c]: v }))} />
        </div>
      ))}
      <div className="mt-4.5 flex gap-2.5 rounded-11 bg-human p-3.75 text-success-ink">
        <Icon name="check-foot" size={18} />
        <div>
          <b className="block text-10 font-bold">Human approval is required</b>
          <p className="pt-0.75 text-8">Tally cannot approve or send a client invoice.</p>
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
            <b className="block text-9 font-bold">{p}</b>
            <small className="block pt-0.75 text-7 text-ink-muted">{i === 0 ? 'All projects' : 'Assigned projects only'}</small>
          </div>
          {/* Figma fixes this pill at 28×28 (text overflows); sized to content here. */}
          <span className="rounded-14 bg-teammate px-2.25 py-1.25 text-7 font-semibold text-ink-neutral">{i === 0 ? 'Partner / reviewer' : 'Employee'}</span>
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
          <span className="grid size-9 shrink-0 place-items-center rounded-10 bg-project-tile">
            <Icon name={icon} size={18} />
          </span>
          <div className="flex-1">
            <b className="block text-9 font-bold">{name}</b>
            <small className="block pt-0.75 text-7 text-ink-muted">{hint}</small>
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
    <div className="rounded-12 border border-line bg-privacy p-4.25">
      <h3 className="text-12">{title}</h3>
      <p className="pt-1.25 text-9 leading-flag text-ink-neutral">{children}</p>
    </div>
  )
}

function DataPrivacy() {
  return (
    <>
      <div className="mt-5.5 flex flex-col gap-2.5">
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
        <div role="tablist" aria-orientation="vertical" aria-label="Settings sections" className="flex flex-col self-start rounded-14 border border-line bg-surface-faint p-1.75">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              id={`settings-tab-${t}`}
              aria-selected={tab === t}
              aria-controls="settings-panel"
              onClick={() => setTab(t)}
              className={`h-8.5 rounded-9 px-2.75 text-left text-9 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-dark ${
                tab === t ? 'bg-dark text-white' : 'text-ink hover:bg-segment'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <section id="settings-panel" role="tabpanel" aria-labelledby={`settings-tab-${tab}`} className="min-h-155 rounded-17 border border-line bg-surface p-6.25">
          <h2 className="text-21 font-medium text-ink">{tab}</h2>
          <p className="pt-1.25 text-9 text-ink-muted">{INTRO[tab]}</p>
          <Panel />
        </section>
      </div>
    </>
  )
}
