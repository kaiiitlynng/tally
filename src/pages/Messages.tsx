import { useState } from 'react'
import { DarkButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { allFlags, initials, setFlagStatus } from '../data/store'

const AVATAR = 'grid size-7 shrink-0 place-items-center rounded-full border-2 border-member-ring bg-member text-caption'

/**
 * Messages (Figma 36:7405 partner / 36:14151 employee show the empty inbox). Threads appear after
 * "Ask employee" on an invoice flag; thread layout and the employee correction box follow the
 * prototype code layer.
 */
export default function Messages() {
  const { store, update, role, me } = useDemo()
  const visible = store.messages.filter((m) => m.from === me.name || m.to === me.name)
  const [selectedId, setSelectedId] = useState(visible[0]?.id ?? '')
  const [reply, setReply] = useState('')
  const message = visible.find((m) => m.id === selectedId) ?? visible[0]
  const entry = message?.entryId ? store.entries.find((e) => e.id === message.entryId) : undefined
  const other = (m: (typeof visible)[number]) => (m.from === me.name ? m.to : m.from)

  function open(id: string) {
    setSelectedId(id)
    update((s) => {
      const m = s.messages.find((x) => x.id === id)!
      m.unreadBy = m.unreadBy.filter((r) => r !== role)
    })
  }

  function sendReply() {
    if (!message || !reply.trim()) return
    update((s) => {
      const m = s.messages.find((x) => x.id === message.id)!
      m.replies.push({ from: me.name, body: reply.trim(), time: 'Just now' })
      m.status = 'Replied'
      m.unreadBy = [role === 'partner' ? 'employee' : 'partner']
    })
    setReply('')
  }

  /** Employee submits a corrected description: updates the linked entry, keeps the original. */
  function submitCorrection() {
    if (!message?.entryId || !reply.trim()) return
    const body = reply.trim()
    update((s) => {
      const e = s.entries.find((x) => x.id === message.entryId)!
      const old = e.description
      e.original = old
      e.description = body
      const m = s.messages.find((x) => x.id === message.id)!
      m.status = 'Replied'
      m.unreadBy = ['partner']
      m.replies.push({ from: me.name, body, time: 'Just now' })
      allFlags(s)
        .filter((f) => f.entryId === message.entryId)
        .forEach((f) => setFlagStatus(s, f.id, 'Response received'))
      if (message.projectId) s.invoiceStatus[message.projectId] = 'In review'
      s.audit.unshift(`${me.firstName} corrected “${old}”; original preserved`)
    })
    setReply('')
  }

  return (
    <>
      <PageTitle
        eyebrow="Billing conversations"
        title="Messages"
        description="Focused requests, linked entries, and employee responses in one professional inbox."
      />
      <div className="mt-6 grid h-226.25 min-h-155 grid-cols-[330px_1fr] overflow-hidden rounded-lg border border-line bg-inbox">
        <aside aria-label="Conversations" className="overflow-auto border-r border-line bg-thread-list">
          <div className="flex justify-between p-3.75 text-small font-semibold text-ink">
            <span>Conversations</span>
            <span>{visible.length}</span>
          </div>
          {visible.length ? (
            visible.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={message?.id === m.id}
                onClick={() => open(m.id)}
                className={`grid w-full grid-cols-[34px_1fr_auto] gap-2.5 border-t border-thread-line p-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                  message?.id === m.id ? 'bg-thread-active' : 'hover:bg-brand-25'
                } ${m.unreadBy.includes(role) ? 'shadow-[inset_3px_0_var(--color-orange)]' : ''}`}
              >
                <span className={AVATAR}>{initials(other(m))}</span>
                <span className="min-w-0">
                  <b className="block truncate text-caption font-semibold">{other(m)}</b>
                  <strong className="my-1 block truncate text-small font-semibold">{m.subject}</strong>
                  <span className="block truncate text-caption text-ink-muted">{m.body}</span>
                </span>
                <time className="text-caption text-ink-dim">{m.time}</time>
              </button>
            ))
          ) : (
            <EmptyState icon="message-empty-small" iconSize={18} title="No messages yet" size="sm">
              Billing requests will appear here.
            </EmptyState>
          )}
        </aside>

        <section aria-label="Conversation" className="flex min-w-0 flex-col bg-conversation">
          {message ? (
            <>
              <header className="flex items-center border-b border-line px-4.75 py-4">
                <div className="flex-1">
                  <b className="block text-body font-semibold">{message.subject}</b>
                  <p className="pt-0.75 text-caption text-ink-muted">{store.projects.find((p) => p.id === message.projectId)?.name}</p>
                </div>
                <Pill tone={message.status === 'Replied' ? 'success' : 'accent'}>{message.status}</Pill>
              </header>
              <div className="flex-1 overflow-auto p-6">
                <div className="mb-3.75 flex max-w-155 gap-2.5">
                  <span className={AVATAR}>{initials(message.from)}</span>
                  <div className="rounded-lg rounded-tl-xs bg-bubble px-3.5 py-3">
                    <b className="text-caption font-semibold">
                      {message.from} <time className="ml-2 font-normal text-ink-dim">{message.time}</time>
                    </b>
                    <p className="mt-1.5 text-small">{message.body}</p>
                  </div>
                </div>
                {entry && (
                  <div className="mx-auto mb-4.5 max-w-140 rounded-md border border-line-step bg-white p-3.25">
                    <div className="flex items-center gap-2">
                      <Icon name="nav-time-entries" size={18} />
                      <span>
                        <small className="block text-caption">LINKED TIME ENTRY</small>
                        <b className="mt-0.75 block text-small font-semibold">
                          {entry.date} · {entry.hours} hours
                        </b>
                      </span>
                    </div>
                    <p className="mt-2.5 rounded-sm bg-linked-body p-2.5 text-small">{entry.description}</p>
                  </div>
                )}
                {message.replies.map((r, i) => (
                  <div key={i} className="mb-3.75 ml-auto flex max-w-155 flex-row-reverse gap-2.5">
                    <span className={AVATAR}>{initials(r.from)}</span>
                    <div className="rounded-lg rounded-tr-xs bg-bubble-mine px-3.5 py-3">
                      <b className="text-caption font-semibold">
                        {r.from} <time className="ml-2 font-normal text-ink-dim">{r.time}</time>
                      </b>
                      <p className="mt-1.5 text-small">{r.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              {!message.entryId ? (
                // Messages without a linked entry (time requests, unrecognized cases) take a plain reply.
                <div className="border-t border-line bg-reply px-5 py-4">
                  <label htmlFor="plain-reply" className="text-small font-semibold text-ink">
                    Reply
                  </label>
                  <textarea
                    id="plain-reply"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="mt-1.5 min-h-16 w-full resize-y rounded-md border border-line-field bg-white p-2.75 text-small text-ink focus:outline-2 focus:outline-accent"
                  />
                  <div className="mt-2.25 flex justify-end">
                    <DarkButton onClick={sendReply} disabled={!reply.trim()} className="disabled:border-ink-divider disabled:bg-segment disabled:text-ink-muted">
                      Send reply
                    </DarkButton>
                  </div>
                </div>
              ) : role === 'employee' && message.status !== 'Replied' ? (
                <div className="border-t border-line bg-reply px-5 py-4">
                  <label htmlFor="correction" className="flex flex-col gap-1.5 text-small font-semibold text-ink">
                    Corrected description
                  </label>
                  <textarea
                    id="correction"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Add a clear, client-ready description…"
                    className="mt-1.5 min-h-21.25 w-full resize-y rounded-md border border-line-field bg-white p-2.75 text-small text-ink placeholder:text-ink-placeholder focus:outline-2 focus:outline-accent"
                  />
                  <div className="mt-2.25 flex items-center">
                    <span className="mr-auto text-caption text-ink-muted">This updates the linked entry and preserves its original value.</span>
                    <DarkButton onClick={submitCorrection} disabled={!reply.trim()} className="disabled:cursor-not-allowed disabled:border-ink-divider disabled:bg-segment disabled:text-ink-muted">
                      Submit correction
                    </DarkButton>
                  </div>
                </div>
              ) : (
              <div className="flex items-center justify-center gap-2.25 border-t border-line p-4.25 text-foot-ink">
                <Icon name={message.status === 'Replied' ? 'check-foot' : 'clock-waiting'} size={18} />
                <span>
                  <b className="block text-caption font-semibold">{message.status === 'Replied' ? 'Response received' : 'Awaiting employee'}</b>
                  <small className="mt-0.5 block text-caption text-ink-muted">
                    {message.status === 'Replied'
                      ? "The corrected entry is back in Vanessa's review queue."
                      : 'Vanessa remains the final invoice approver.'}
                  </small>
                </span>
              </div>
              )}
            </>
          ) : (
            <EmptyState icon="message-empty-large" iconSize={28} title="Select a conversation" />
          )}
        </section>
      </div>
    </>
  )
}
