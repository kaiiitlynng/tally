import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { DarkButton, OutlineButton } from '../components/Button'
import { Field, SegmentedRadio, TextInput } from '../components/Field'
import { ScheduleRatesDrawer } from '../sections/settings/ScheduleRatesDrawer'
import { Disclaimer, Modal } from '../components/Modal'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { Switch } from '../components/Switch'
import { FIRST, ROW as TABLE_ROW, TABLE, TABLE_WRAP, TD, TH } from '../components/tableStyles'
import { initials, money, prefsFor, type TeamMember } from '../data/store'
import { ProfilePanel } from '../sections/settings/ProfilePanel'
import { SettingsLayout } from '../sections/settings/SettingsLayout'


const AVATAR = 'grid size-7 shrink-0 place-items-center rounded-full bg-teammate text-caption'
const ROW = 'flex items-center gap-2.5 border-b border-line-row py-3.25'

function BillingRules() {
  const { store, update } = useDemo()
  // Column widths from Figma (36:9839): 237.59 / 158.41 / 158.40 / 138.60 px.
  // "Optional override" column removed (owner request 2026-11-10).
  const cols = ['40%', '32%', '28%']

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
      <div className="mt-4 flex items-center gap-3">
        <OutlineButton onClick={() => setScheduling(true)}>{scheduled ? 'Edit 2026 schedule' : 'Schedule 2026 rates'}</OutlineButton>
        {scheduled && <p className="text-caption text-ink-muted">Time worked before Jan 1 keeps 2025 rates.</p>}
      </div>
      {scheduling && <ScheduleRatesDrawer onClose={() => setScheduling(false)} />}
      <div className={`mt-3 ${TABLE_WRAP}`}>
        <table className={TABLE}>
          <colgroup>
            {cols.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className={`${TH} ${FIRST}`}>Employee</th>
              <th scope="col" className={TH}>Standard rate</th>
              <th scope="col" className={TH}>Effective date</th>
            </tr>
          </thead>
          <tbody>
            {store.team.map(({ name }) => [name, store.rates[name]] as const).map(([name, rate]) => (
              <tr key={name} className={TABLE_ROW}>
                <th scope="row" className={`${TD} ${FIRST} text-left`}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 border-b border-line-row py-3.75">
        <span className="flex-1">
          <b id="threshold-label" className="block text-small font-semibold">
            Daily hours limit
          </b>
          <small className="block pt-0.75 text-caption text-ink-muted">Counts all of a person's projects that day.</small>
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
            {i === 0 && <small className="block pt-0.75 text-caption text-ink-muted">Over {store.threshold} hours a day</small>}
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

function AddMemberModal({ onClose }: { onClose: () => void }) {
  const { store, update, me, toast } = useDemo()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rate, setRate] = useState('')
  const [role, setRole] = useState<TeamMember['role']>('Employee')
  const [tried, setTried] = useState(false)

  const errors = {
    name: !name.trim()
      ? 'Please enter a name.'
      : store.team.some((m) => m.name.toLowerCase() === name.trim().toLowerCase())
        ? 'This person is already on the team.'
        : undefined,
    email: /^\S+@\S+\.\S+$/.test(email.trim()) ? undefined : 'Please enter a valid email address.',
    rate: Number(rate) > 0 ? undefined : 'Please enter an hourly rate above zero.',
  }

  function add() {
    setTried(true)
    if (errors.name || errors.email || errors.rate) return
    const member = { name: name.trim(), email: email.trim(), role }
    update((s) => {
      s.team.push(member)
      s.rates[member.name] = Number(rate)
      s.audit.unshift(`${me.firstName} added ${member.name} as ${role === 'Partner' ? 'a partner' : 'an employee'}`)
    })
    toast(`${member.name} added to the team`)
    onClose()
  }

  return (
    <Modal title="Add team member" confirmLabel="Add member" onConfirm={add} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3.5">
        <Field label="Full name" htmlFor="tm-name" className="col-span-2" error={tried ? errors.name : undefined}>
          <TextInput id="tm-name" autoFocus value={name} aria-invalid={tried && !!errors.name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jordan Reyes" />
        </Field>
        <Field label="Work email" htmlFor="tm-email" className="col-span-2" error={tried ? errors.email : undefined}>
          <TextInput id="tm-email" type="email" value={email} aria-invalid={tried && !!errors.email} onChange={(e) => setEmail(e.target.value)} placeholder="name@hartwellknox.example" />
        </Field>
        <Field label="Standard rate ($/hour)" htmlFor="tm-rate" error={tried ? errors.rate : undefined}>
          <TextInput id="tm-rate" type="number" min="0" value={rate} aria-invalid={tried && !!errors.rate} onChange={(e) => setRate(e.target.value)} placeholder="450" />
        </Field>
        <div>
          <p id="tm-role" className="pb-1.5 text-small font-semibold text-ink">
            Access
          </p>
          <SegmentedRadio name="tm-role" options={['Employee', 'Partner'] as const} value={role} onChange={setRole} labelledBy="tm-role" />
        </div>
      </div>
      <Disclaimer>No invitation email is sent in this prototype.</Disclaimer>
    </Modal>
  )
}

function Team() {
  const { store, update, me, toast } = useDemo()
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<TeamMember | null>(null)

  function remove() {
    if (!removing) return
    const { name } = removing
    update((s) => {
      s.team = s.team.filter((m) => m.name !== name)
      s.audit.unshift(`${me.firstName} removed ${name} from the team`)
    })
    toast(`${name} removed from the team`)
    setRemoving(null)
  }

  return (
    <>
      <div className="mt-4">
        <OutlineButton onClick={() => setAdding(true)}>Add team member</OutlineButton>
      </div>
      <ul className="mt-3">
        {store.team.map((m) => {
          const isMe = m.name === me.name
          return (
            <li key={m.name} className={ROW}>
              <span className={AVATAR} aria-hidden="true">
                {initials(m.name)}
              </span>
              {/* Name column is fixed-width so every role tag starts at the same left edge. */}
              <div className="w-80 min-w-0">
                <b className="block text-small font-semibold">
                  {m.name}
                  {isMe && <span className="font-normal text-ink-muted"> (you)</span>}
                </b>
                <small className="block truncate pt-0.75 text-caption text-ink-muted">{m.email}</small>
              </div>
              <span className="mr-auto rounded-lg bg-teammate px-2.25 py-1.25 text-caption font-semibold text-ink-neutral">{m.role}</span>
              {/* The signed-in partner can't remove themselves. */}
              <span className="w-20">
                {!isMe && (
                  <button
                    type="button"
                    onClick={() => setRemoving(m)}
                    aria-label={`Remove ${m.name}`}
                    className="inline-flex h-8 items-center rounded-sm px-2.5 text-small font-semibold text-delete transition-colors hover:bg-delete-soft focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    Remove
                  </button>
                )}
              </span>
            </li>
          )
        })}
      </ul>
      {adding && <AddMemberModal onClose={() => setAdding(false)} />}
      {removing && (
        <Modal
          title={`Remove ${removing.name}?`}
          onClose={() => setRemoving(null)}
          footer={
            <>
              <OutlineButton onClick={() => setRemoving(null)}>Cancel</OutlineButton>
              <button
                type="button"
                onClick={remove}
                className="inline-flex h-10 items-center rounded-sm bg-delete px-4 text-body font-semibold text-white shadow-card transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98]"
              >
                Remove member
              </button>
            </>
          }
        >
          <p className="text-small leading-normal text-ink-neutral">
            {removing.name.split(' ')[0]} will lose access to Tally. Submitted time, invoices and rate history stay on the firm&apos;s records.
          </p>
        </Modal>
      )}
    </>
  )
}

/** Reminder channels (moved here from Manage Team, owner request 2026-11-10). Email needs Gmail connected first. */
/**
 * Notifications, split by channel (owner request 2026-11-10): In-app (the bell and team reminders inside Tally)
 * and Email (to inboxes; needs Gmail connected in Integrations, and nothing is actually sent in the demo).
 */
function Notifications() {
  const { store, update, me } = useDemo()
  const emailReady = store.gmailConnected
  const mine = prefsFor(store, me.name)
  const setChannel = (key: 'inApp' | 'email', v: boolean) =>
    update((s) => {
      s.reminderChannels[key] = v
    })
  const HEAD = 'text-small font-semibold text-ink-muted'
  return (
    <div className="mt-5.5">
      <h3 className={HEAD}>In-app</h3>
      <div className={ROW}>
        <span className="flex-1">
          <b id="channel-inApp" className="block text-small font-semibold">
            Send team reminders in-app
          </b>
          <small className="block pt-0.5 text-caption text-ink-muted">Shows in each person&apos;s notification bell</small>
        </span>
        <Switch checked={store.reminderChannels.inApp} labelledBy="channel-inApp" onChange={(v) => setChannel('inApp', v)} />
      </div>

      <h3 className={`${HEAD} pt-6`}>Email</h3>
      {/* Your own notifications go to your account email, so this works without Gmail; only team reminders need it. */}
      <div className={ROW}>
        <span className="flex-1">
          <b id="my-email" className="block text-small font-semibold">
            Email me notifications
          </b>
          <small className="block pt-0.5 text-caption text-ink-muted">Sent to {store.team.find((m) => m.name === me.name)?.email}</small>
        </span>
        <Switch
          checked={mine.emailCopies}
          labelledBy="my-email"
          onChange={(v) =>
            update((s) => {
              s.memberPrefs[me.name] = { ...prefsFor(s, me.name), emailCopies: v }
            })
          }
        />
      </div>
      <div className={`${ROW} ${emailReady ? '' : 'opacity-50'}`}>
        <b id="channel-email" className="flex-1 text-small font-semibold">
          Send team reminders by email
        </b>
        <Switch checked={store.reminderChannels.email && emailReady} disabled={!emailReady} labelledBy="channel-email" describedBy={emailReady ? undefined : 'email-needs-gmail'} onChange={(v) => setChannel('email', v)} />
      </div>
      {!emailReady && (
        <p id="email-needs-gmail" className="pt-3 text-small text-ink-muted">
          To send team reminders by email, connect Gmail first.{' '}
          <Link to="/settings?tab=integrations" className="rounded-xs font-semibold text-link hover:underline focus-visible:outline-2 focus-visible:outline-accent">
            Go to Integrations
          </Link>
        </p>
      )}
    </div>
  )
}

function Integrations() {
  const { store, update, toast } = useDemo()
  // Calendar sits above QuickBooks; QuickBooks is a future capability, so its control is muted and inert.
  const items = [
    ['Email', store.gmailConnected ? 'Connected · sends invoices to clients and reminders to your team' : 'Send invoices to clients and reminders to your team', 'integration-gmail'],
    ['Calendar', 'Optional context for missing time', 'integration-google-calendar'],
    ['QuickBooks', 'Coming later', 'integration-quickbooks'],
  ]
  // Gmail is the one connection the prototype simulates: connecting enables email notifications in Notifications.
  function toggleGmail() {
    const connect = !store.gmailConnected
    update((s) => {
      s.gmailConnected = connect
      if (!connect) s.reminderChannels.email = false
    })
    toast(connect ? 'Gmail connected. Turn on email notifications in Notifications.' : 'Gmail disconnected')
  }
  return (
    <div className="mt-5.5">
      {items.map(([name, hint, icon]) => (
        <div key={name} className={ROW}>
          <span className="grid size-6 shrink-0 place-items-center">
            {/* Brand marks (Gmail, QuickBooks, Google Calendar) keep their own colors; generic rows use the UI icon. */}
            <Icon name={icon} size={22} />
          </span>
          <div className="flex-1">
            <b className="block text-small font-semibold">{name}</b>
            <small className="block pt-0.75 text-caption text-ink-muted">{hint}</small>
          </div>
          {name === 'Email' ? (
            // Same wording as the other rows: the label is the state; clicking it connects or disconnects.
            <OutlineButton onClick={toggleGmail} aria-label={store.gmailConnected ? 'Email: connected. Select to disconnect' : 'Email: not connected. Select to connect Gmail'}>
              {store.gmailConnected ? 'Connected' : 'Not connected'}
            </OutlineButton>
          ) : (
            // Calendar and QuickBooks connections are not available in the prototype.
            <OutlineButton aria-label={`${name}: not connected`} disabled={name === 'QuickBooks'} className={name === 'QuickBooks' ? 'opacity-50' : ''}>
              Not connected
            </OutlineButton>
          )}
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
      {/* Inert in the prototype code layer. "Review retention settings" was removed (2026-11-10): it had no flow. */}
      <div className="flex gap-2 pt-4.5">
        <OutlineButton className="gap-2">
          <Icon name="download-dark" size={18} /> Export firm data
        </OutlineButton>
      </div>
    </>
  )
}

/** Settings (Figma 36:9778 / 36:10273 / 36:10647 / 36:11056; AI preferences from the code layer; Profile added 2026-11-10). */
export default function Settings() {
  return (
    <SettingsLayout
      sections={[
        { label: 'Profile', Panel: ProfilePanel },
        { label: 'Billing rules', intro: 'Rates apply based on the work date. Existing entries keep their historical rate.', Panel: BillingRules },
        { label: 'AI preferences', intro: 'Tally calculates amounts with math. AI only reads descriptions and project names.', Panel: AiPreferences },
        { label: 'Team', intro: 'Employees only see assigned projects, their own entries, and billing requests sent to them.', Panel: Team },
        { label: 'Notifications', Panel: Notifications },
        { label: 'Integrations', Panel: Integrations },
        { label: 'Data & privacy', intro: "Demo only: these aren't production security controls.", Panel: DataPrivacy },
      ]}
    />
  )
}
