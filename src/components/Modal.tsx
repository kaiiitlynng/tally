import { useEffect, useRef, type ReactNode } from 'react'
import { DarkButton, OutlineButton } from './Button'
import { Icon } from './Icon'

interface ModalProps {
  title: string
  eyebrow?: string
  onClose: () => void
  /** Primary action label + handler. */
  confirmLabel: string
  onConfirm: () => void
  children: ReactNode
}

/**
 * Centered dialog. Not drawn in Figma; follows the prototype code layer (.ask-modal in v2.css).
 * Uses the native <dialog> for focus trapping, Esc to close and an inert background.
 */
export function Modal({ title, eyebrow, onClose, confirmLabel, onConfirm, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className="m-auto w-117.5 rounded-22 border border-line bg-modal p-6.75 text-ink shadow-modal backdrop:bg-scrim backdrop:backdrop-blur-scrim"
    >
      <div className="flex items-start justify-between">
        <div>
          {eyebrow && <p className="text-9 font-semibold tracking-eyebrow text-eyebrow uppercase">{eyebrow}</p>}
          <h2 id="modal-title" className="my-1 text-23 font-medium">
            {title}
          </h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-10 p-1 hover:bg-segment focus-visible:outline-2 focus-visible:outline-dark">
          <Icon name="close" size={18} />
        </button>
      </div>
      {children}
      <div className="mt-6 flex justify-end gap-2">
        <OutlineButton onClick={onClose}>Cancel</OutlineButton>
        <DarkButton onClick={onConfirm}>{confirmLabel}</DarkButton>
      </div>
    </dialog>
  )
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return <p className="text-8 text-ink-muted">{children}</p>
}
