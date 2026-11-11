import { useNavigate } from 'react-router'
import { DarkButton, OutlineButton } from '../../components/Button'
import { Modal } from '../../components/Modal'

const KEY = 'tally.emailPromptDismissed'

/** Whether the partner already chose "Not now". Storage can be unavailable (private mode), so failures read as "not dismissed". */
export function emailPromptDismissed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Shown on the first visit to Manage Team while reminders are in-app only (owner request 2026-11-10).
 * "Not now" and Esc both dismiss it for good; the "Connect email" link in the reminders card reopens it.
 * Focus trap and focus return come from the shared native <dialog>.
 */
export function EmailPromptModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()

  function notNow() {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      // Storage blocked: the prompt may show again next visit, which is harmless.
    }
    onClose()
  }

  return (
    <Modal
      title="Reminders are on in the app"
      onClose={notNow}
      footer={
        <>
          <OutlineButton onClick={notNow}>Not now</OutlineButton>
          <DarkButton
            onClick={() => {
              onClose()
              navigate('/settings?tab=integrations')
            }}
          >
            Connect email
          </DarkButton>
        </>
      }
    >
      <p className="text-small leading-normal text-ink-neutral">Your team sees reminders when they open Tally. Connect email so reminders reach their inbox too.</p>
    </Modal>
  )
}
