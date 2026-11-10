import { useDemo } from '../../components/DemoContext'
import { SectionHeading } from '../../components/SectionHeading'
import { Switch } from '../../components/Switch'

/** Reminder activity log + notification channel switches (Figma 36:7899). */
export function ReminderActivity() {
  const { store, update } = useDemo()
  const channels = [
    { key: 'inApp', title: 'In-app notifications', hint: 'Available in this prototype' },
    { key: 'email', title: 'Email notifications', hint: 'Demo only until an email provider is connected' },
  ] as const

  return (
    <div className="grid grid-cols-[1fr_360px] gap-3.25 pt-4">
      <section aria-labelledby="reminder-activity" className="rounded-16 border border-line bg-surface p-4.75">
        <SectionHeading id="reminder-activity" title="Reminder activity" description="Simulated in-app activity only" />
        <ul className="pt-2.5" aria-live="polite">
          {store.reminderLog.map((line, i) => (
            <li key={`${line}-${i}`} className="grid grid-cols-[10px_1fr] gap-2 border-t border-line-row py-2.25">
              <span
                aria-hidden="true"
                className={`mt-1 size-1.5 rounded-full ${i === 0 ? 'bg-orange ring-4 ring-live-ring' : 'bg-log-dot'}`}
              />
              <p>
                <b className="block text-8 font-bold text-ink">{line}</b>
                <small className="block pt-0.5 text-7 text-ink-muted">{i === 0 ? 'Just now' : 'Earlier today'}</small>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="channels" className="self-start rounded-16 border border-line bg-surface p-4.75">
        <h3 id="channels" className="text-14 text-ink">
          Notification channels
        </h3>
        <div className="pt-2">
          {channels.map((c) => (
            <div key={c.key} className="flex items-center border-t border-line-row py-3.25">
              <div className="flex-1">
                <b id={`channel-${c.key}`} className="block text-9 font-bold text-ink">
                  {c.title}
                </b>
                <small className="block pt-0.75 text-7 text-ink-muted">{c.hint}</small>
              </div>
              <Switch
                checked={store.reminderChannels[c.key]}
                labelledBy={`channel-${c.key}`}
                onChange={(v) =>
                  update((s) => {
                    s.reminderChannels[c.key] = v
                  })
                }
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
