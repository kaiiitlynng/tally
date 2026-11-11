import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { PageTitle } from '../../components/PageTitle'
import { onTabListKeyDown } from '../../components/tabKeys'

export interface SettingsSection {
  label: string
  intro?: string
  Panel: () => ReactNode
}

/**
 * Settings page frame shared by both roles (owner request 2026-11-10: the employee's settings use the partner's
 * format): vertical section tabs on the left, the open section on the right. The open section lives in the URL
 * (?tab=integrations) so links from other pages can open one; the first section is the default.
 */
export function SettingsLayout({ sections }: { sections: SettingsSection[] }) {
  const [params, setParams] = useSearchParams()
  const current = sections.find((s) => s.label.toLowerCase() === params.get('tab')) ?? sections[0]
  const open = (s: SettingsSection) => setParams(s === sections[0] ? {} : { tab: s.label.toLowerCase() }, { replace: true })
  const { Panel } = current

  return (
    <>
      <PageTitle title="Settings" />
      <div className="grid grid-cols-[210px_1fr] gap-3.5 pt-6">
        <div role="tablist" aria-orientation="vertical" aria-label="Settings sections" onKeyDown={onTabListKeyDown} className="flex flex-col self-start rounded-lg border border-line bg-surface-faint p-1.75">
          {sections.map((s) => (
            <button
              key={s.label}
              role="tab"
              id={`settings-tab-${s.label}`}
              aria-selected={s === current}
              tabIndex={s === current ? 0 : -1}
              aria-controls="settings-panel"
              onClick={() => open(s)}
              className={`h-10 rounded-sm px-3 text-left text-body transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${
                s === current ? 'bg-brand-50 font-semibold text-brand' : 'text-ink-muted hover:bg-hover hover:text-ink'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <section id="settings-panel" role="tabpanel" aria-labelledby={`settings-tab-${current.label}`} className="min-h-155 rounded-lg border border-line bg-surface p-6.25 shadow-card">
          <h2 className="text-title font-semibold tracking-title text-ink">{current.label}</h2>
          {current.intro && <p className="pt-1.25 text-small text-ink-muted">{current.intro}</p>}
          <Panel />
        </section>
      </div>
    </>
  )
}
