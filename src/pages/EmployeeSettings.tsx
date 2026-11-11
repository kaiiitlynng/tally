import type { ReactNode } from 'react'
import { useDemo } from '../components/DemoContext'
import { SegmentedRadio, Select } from '../components/Field'
import { Switch } from '../components/Switch'
import { prefsFor, type MemberPrefs } from '../data/store'
import { ProfilePanel } from '../sections/settings/ProfilePanel'
import { SettingsLayout } from '../sections/settings/SettingsLayout'

const ROW = 'flex items-center gap-4 border-b border-line-row py-3.5 last:border-b-0'

function Row({ id, label, hint, muted = false, children }: { id: string; label: string; hint?: string; muted?: boolean; children: ReactNode }) {
  return (
    <div className={ROW}>
      <span className={`flex-1 ${muted ? 'opacity-50' : ''}`}>
        <b id={id} className="block text-small font-semibold text-ink">
          {label}
        </b>
        {hint && <small className="block pt-0.5 text-caption text-ink-muted">{hint}</small>}
      </span>
      {children}
    </div>
  )
}

function usePrefs() {
  const { store, update, me } = useDemo()
  const prefs = prefsFor(store, me.name)
  const set = (patch: Partial<MemberPrefs>) =>
    update((s) => {
      s.memberPrefs[me.name] = { ...prefsFor(s, me.name), ...patch }
    })
  return { prefs, set }
}

/** Notifications by channel: In-app (your bell) and Email (your account's inbox). */
function Notifications() {
  const { store, me } = useDemo()
  const { prefs, set } = usePrefs()
  const email = store.team.find((m) => m.name === me.name)?.email
  return (
    <div className="mt-5.5">
      <h3 className="text-small font-semibold text-ink-muted">In-app</h3>
      <Row id="pref-reminders" label="Timesheet reminders" hint="Reminders and time requests from your partner">
        <Switch checked={prefs.reminders} labelledBy="pref-reminders" onChange={(v) => set({ reminders: v })} />
      </Row>
      <Row id="pref-messages" label="Billing questions and replies" hint="New messages and replies in your conversations">
        <Switch checked={prefs.messageAlerts} labelledBy="pref-messages" onChange={(v) => set({ messageAlerts: v })} />
      </Row>

      <h3 className="pt-6 text-small font-semibold text-ink-muted">Email</h3>
      {/* Goes to the account's own email, so it works without any integration. */}
      <Row id="pref-email" label="Email me notifications" hint={`Sent to ${email}`}>
        <Switch checked={prefs.emailCopies} labelledBy="pref-email" onChange={(v) => set({ emailCopies: v })} />
      </Row>
    </div>
  )
}

function TimeEntryDefaults() {
  const { store, me } = useDemo()
  const { prefs, set } = usePrefs()
  const projects = store.projects.filter((p) => p.people.includes(me.name) && p.status === 'Active')
  return (
    <div className="mt-5.5">
      <Row id="pref-project" label="Default project">
        <div className="w-72">
          <Select aria-labelledby="pref-project" value={prefs.defaultProjectId} onChange={(e) => set({ defaultProjectId: e.target.value })}>
            <option value="">First assigned project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
      </Row>
      <Row id="pref-billable" label="Billing treatment">
        <div className="w-72">
          <SegmentedRadio
            name="pref-billable"
            options={['Billable', 'Nonbillable'] as const}
            value={prefs.billable ? 'Billable' : 'Nonbillable'}
            labelledBy="pref-billable"
            onChange={(v) => set({ billable: v === 'Billable' })}
          />
        </div>
      </Row>
    </div>
  )
}

/** Employee settings, in the same format as the partner's (owner request 2026-11-10). */
export default function EmployeeSettings() {
  return (
    <SettingsLayout
      sections={[
        { label: 'Profile', Panel: ProfilePanel },
        { label: 'Notifications', Panel: Notifications },
        { label: 'Time entry defaults', intro: 'Pre-filled on new entries.', Panel: TimeEntryDefaults },
      ]}
    />
  )
}
