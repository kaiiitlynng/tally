import type { ReactNode } from 'react'
import { useDemo } from '../components/DemoContext'
import { SegmentedRadio, Select } from '../components/Field'
import { PageTitle } from '../components/PageTitle'
import { Switch } from '../components/Switch'
import { money, prefsFor, type MemberPrefs } from '../data/store'

const ROW = 'flex items-center gap-4 border-b border-line-row py-3.5 last:border-b-0'

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="rounded-lg border border-line bg-surface p-6 shadow-card">
      <h2 className="text-title-sm font-semibold tracking-title text-ink">{title}</h2>
      {description && <p className="pt-1 text-small text-ink-muted">{description}</p>}
      <div className="pt-2">{children}</div>
    </section>
  )
}

function Row({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className={ROW}>
      <span className="flex-1">
        <b id={id} className="block text-small font-semibold text-ink">
          {label}
        </b>
        {hint && <small className="block pt-0.5 text-caption text-ink-muted">{hint}</small>}
      </span>
      {children}
    </div>
  )
}

/**
 * Employee settings (owner request 2026-11-10; no Figma frame): a short list of what applies to a team member.
 * Profile and rate are read-only (the partner owns them); notifications and time-entry defaults are theirs.
 */
export default function EmployeeSettings() {
  const { store, update, me } = useDemo()
  const prefs = prefsFor(store, me.name)
  const member = store.team.find((m) => m.name === me.name)
  const projects = store.projects.filter((p) => p.people.includes(me.name) && p.status === 'Active')
  const set = (patch: Partial<MemberPrefs>) =>
    update((s) => {
      s.memberPrefs[me.name] = { ...prefsFor(s, me.name), ...patch }
    })

  return (
    <>
      <PageTitle title="Settings" />
      <div className="flex max-w-180 flex-col gap-4 pt-6">
        <Card title="Profile" description="Your partner manages these details.">
          <dl>
            {[
              ['Name', me.name],
              ['Email', member?.email ?? '—'],
              ['Access', 'Assigned projects only'],
              ['Standard rate', `${money(store.rates[me.name] ?? 0)} / hour`],
            ].map(([term, value]) => (
              <div key={term} className={ROW}>
                <dt className="w-40 text-small text-ink-muted">{term}</dt>
                <dd className="text-small font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Notifications">
          <Row id="pref-reminders" label="Timesheet reminders" hint="Reminders and time requests from your partner">
            <Switch checked={prefs.reminders} labelledBy="pref-reminders" onChange={(v) => set({ reminders: v })} />
          </Row>
          <Row id="pref-messages" label="Billing questions and replies" hint="New messages and replies in your conversations">
            <Switch checked={prefs.messageAlerts} labelledBy="pref-messages" onChange={(v) => set({ messageAlerts: v })} />
          </Row>
          <Row id="pref-email" label="Email copies" hint="Demo only: no email is sent in this prototype">
            <Switch checked={prefs.emailCopies} labelledBy="pref-email" onChange={(v) => set({ emailCopies: v })} />
          </Row>
        </Card>

        <Card title="Time entry defaults" description="Pre-filled on new entries.">
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
        </Card>
      </div>
    </>
  )
}
