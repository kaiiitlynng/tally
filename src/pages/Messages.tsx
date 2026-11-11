import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { DarkButton, OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { NewMessageModal } from '../sections/messages/NewMessageModal'
import { addReply, allFlags, isUnread, initials, isFinal, isOpen, notify, partner, setFlagStatus } from '../data/store'

const AVATAR = 'grid size-7 shrink-0 place-items-center rounded-full border-2 border-member-ring bg-member text-caption'

/** One message: mine on the right in the brand tint, the other person's on the left. */
function Bubble({ from, time, body, mine }: { from: string; time: string; body: string; mine: boolean }) {
  return (
    <div className={`mb-3.75 flex max-w-155 gap-2.5 ${mine ? 'ml-auto flex-row-reverse' : ''}`}>
      <span className={AVATAR}>{initials(from)}</span>
      <div className={`rounded-lg px-3.5 py-3 ${mine ? 'rounded-tr-xs bg-bubble-mine' : 'rounded-tl-xs bg-bubble'}`}>
        <b className="text-caption font-semibold">
          {from} <time className="ml-2 font-normal text-ink-dim">{time}</time>
        </b>
        <p className="mt-1.5 text-small">{body}</p>
      </div>
    </div>
  )
}

/**
 * Messages (Figma 36:7405 partner / 36:14151 employee show the empty inbox). Threads appear after
 * "Ask employee" on an invoice flag; thread layout and the employee correction box follow the
 * prototype code layer.
 */
export default function Messages() {
  const { store, update, role, me } = useDemo()
  const visible = store.messages.filter((m) => m.from === me.name || m.to === me.name)
  // ?thread=<id> (from Home's "Respond") opens that conversation.
  const [params] = useSearchParams()
  const [selectedId, setSelectedId] = useState(params.get('thread') ?? visible[0]?.id ?? '')
  const [reply, setReply] = useState('')
  const [composing, setComposing] = useState(false)
  const message = visible.find((m) => m.id === selectedId) ?? visible[0]
  const entry = message?.entryId ? store.entries.find((e) => e.id === message.entryId) : undefined
  const other = (m: (typeof visible)[number]) => (m.from === me.name ? m.to : m.from)
  const threadRef = useRef<HTMLDivElement>(null)
  // Keep the newest message in view when a thread opens or a reply arrives.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight })
  }, [message?.id, message?.replies.length])

  // Whatever conversation is on screen counts as read (the first one is shown automatically, a deep link
  // picks another), so the Messages badge only counts conversations not yet seen.
  useEffect(() => {
    if (message && isUnread(message, me.name, role)) open(message.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message?.id, message?.replies.length])

  function open(id: string) {
    setSelectedId(id)
    update((s) => {
      const m = s.messages.find((x) => x.id === id)!
      m.unreadBy = m.unreadBy.filter((r) => r !== role)
    })
  }

  /**
   * One reply path for both roles, so a thread can go back and forth. An employee reply on a linked entry puts
   * its flag back in the partner's queue ("Response received") and notifies the partner; with `correct`, the reply
   * also replaces the entry description (original preserved). A partner reply re-opens the thread while a
   * linked flag is still open.
   */
  function sendReply(correct = false) {
    if (!message || !reply.trim()) return
    const body = reply.trim()
    const to = other(message)
    update((s) => {
      const m = addReply(s, message.id, { from: me.name, body, time: 'Just now' })
      m.unreadBy = [to === partner.name ? 'partner' : 'employee']
      const linked = m.entryId ? allFlags(s).filter((f) => f.entryId === m.entryId) : []
      if (role === 'partner') {
        if (linked.some(isOpen)) m.status = 'Open'
      } else {
        m.status = 'Replied'
        if (correct && m.entryId) {
          const e = s.entries.find((x) => x.id === m.entryId)!
          const old = e.description
          e.original = old
          e.description = body
          s.audit.unshift(`${me.firstName} corrected “${old}”; original preserved`)
        }
        linked.filter(isOpen).forEach((f) => setFlagStatus(s, f.id, 'Response received'))
        if (m.projectId && linked.some(isOpen) && !isFinal(s.invoiceStatus[m.projectId])) s.invoiceStatus[m.projectId] = 'In review'
      }
      // The other person's bell: the partner goes to the review when the thread is about an invoice line.
      notify(s, to, `${me.firstName} replied: “${m.subject}”`, to === partner.name && linked.length && m.projectId ? `/review/${m.projectId}` : '/messages')
    })
    setReply('')
  }

  return (
    <>
      <PageTitle
        title="Messages"
        actions={
          <DarkButton leadingIcon="plus-white" onClick={() => setComposing(true)}>
            New message
          </DarkButton>
        }
      />
      {/* Inbox fills the rest of the viewport (one-off: 15.5rem = header + page padding + title) so the reply box is always on screen. */}
      <div className="mt-6 grid h-[calc(100dvh-15.5rem)] min-h-104 grid-cols-[330px_1fr] overflow-hidden rounded-lg border border-line bg-inbox">
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
                  message?.id === m.id ? 'bg-thread-active' : 'hover:bg-hover'
                } ${isUnread(m, me.name, role) ? 'shadow-[inset_3px_0_var(--color-orange)]' : ''}`}
              >
                <span className={AVATAR}>{initials(other(m))}</span>
                <span className="min-w-0">
                  <b className="block truncate text-caption font-semibold">{other(m)}</b>
                  <strong className="my-1 block truncate text-small font-semibold">{m.subject}</strong>
                  <span className="block truncate text-caption text-ink-muted">{(m.replies.at(-1) ?? m).body}</span>
                </span>
                <time className="text-caption text-ink-dim">{(m.replies.at(-1) ?? m).time}</time>
              </button>
            ))
          ) : (
            <EmptyState icon="message-empty-small" iconSize={18} title="No messages yet" size="sm" />
          )}
        </aside>

        <section aria-label="Conversation" className="flex min-h-0 min-w-0 flex-col bg-conversation">
          {message ? (
            <>
              <header className="flex items-center border-b border-line px-4.75 py-4">
                <div className="flex-1">
                  <b className="block text-body font-semibold">{message.subject}</b>
                  <p className="pt-0.75 text-caption text-ink-muted">{store.projects.find((p) => p.id === message.projectId)?.name}</p>
                </div>
                <Pill tone={message.status === 'Replied' ? 'success' : 'accent'}>{message.status}</Pill>
              </header>
              <div ref={threadRef} className="min-h-0 flex-1 overflow-auto p-6">
                <Bubble from={message.from} time={message.time} body={message.body} mine={message.from === me.name} />
                {entry && (
                  <div className="mx-auto mb-4.5 max-w-140 rounded-md border border-line-step bg-white p-3.25">
                    <div className="flex items-center gap-2">
                      <Icon name="nav-time-entries" size={18} />
                      <span>
                        <small className="block text-caption">Time entry</small>
                        <b className="mt-0.75 block text-small font-semibold">
                          {entry.date} · {entry.hours} hours
                        </b>
                      </span>
                    </div>
                    <p className="mt-2.5 rounded-sm bg-linked-body p-2.5 text-small">{entry.description}</p>
                  </div>
                )}
                {message.replies.map((r, i) => (
                  <Bubble key={i} from={r.from} time={r.time} body={r.body} mine={r.from === me.name} />
                ))}
              </div>
              <div className="border-t border-line bg-reply px-5 py-4">
                <label htmlFor="reply" className="text-small font-semibold text-ink">
                  Reply to {other(message).split(' ')[0]}
                </label>
                <textarea
                  id="reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter sends; Shift+Enter adds a new line. Skipped while an IME is composing.
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault()
                      sendReply()
                    }
                  }}
                  aria-describedby="reply-hint"
                  placeholder={role === 'employee' && entry ? 'Answer the question, or write a clear, client-ready description…' : 'Write a reply…'}
                  className="mt-1.5 min-h-16 w-full resize-none rounded-md border border-line-field bg-white p-2.75 text-small text-ink placeholder:text-ink-placeholder focus:outline-2 focus:outline-accent"
                />
                <div className="mt-2.25 flex items-center justify-end gap-2">
                  {role === 'employee' && entry ? (
                    <>
                      <span id="reply-hint" className="mr-auto text-caption text-ink-muted">
                        Enter to send, Shift+Enter for a new line. Using it as the new description keeps the original.
                      </span>
                      <OutlineButton onClick={() => sendReply()} disabled={!reply.trim()}>
                        Send reply
                      </OutlineButton>
                      <DarkButton onClick={() => sendReply(true)} disabled={!reply.trim()}>
                        Use as new description
                      </DarkButton>
                    </>
                  ) : (
                    <>
                      <span id="reply-hint" className="mr-auto text-caption text-ink-muted">
                        Enter to send, Shift+Enter for a new line.
                      </span>
                      <DarkButton onClick={() => sendReply()} disabled={!reply.trim()}>
                        Send reply
                      </DarkButton>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <EmptyState icon="message-empty-large" iconSize={28} title="Select a conversation" />
          )}
        </section>
      </div>
      {composing && (
        <NewMessageModal
          onClose={() => setComposing(false)}
          onSent={(id) => {
            setComposing(false)
            setSelectedId(id)
          }}
        />
      )}
    </>
  )
}
