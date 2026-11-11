import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { initialStore, users, type Role, type Store } from '../data/store'

interface DemoState {
  store: Store
  /** Mutate a deep copy of the store; the copy replaces the current state. */
  update: (recipe: (draft: Store) => void) => void
  /** "View as Partner" / "View as Employee". */
  role: Role
  setRole: (role: Role) => void
  /** The signed-in demo user for the current role. */
  /**
   * The signed-in demo user. `name` is the data key and never changes; `displayName`, `firstName`, `initials`
   * and `avatar` reflect Settings → Profile edits.
   */
  me: (typeof users)[Role] & { displayName: string; avatar?: string }
  /** Changes on every "Reset demo"; the shell keys pages off it to drop their local state. */
  resetKey: number
  reset: () => void
  /** App-wide success toast (rendered once by the shell). */
  toast: (message: string) => void
  toastMessage: string
  clearToast: () => void
}

function withProfile(user: (typeof users)[Role], store: Store) {
  const edit = store.profiles[user.name]
  const displayName = edit?.name?.trim() || user.name
  return {
    ...user,
    displayName,
    firstName: displayName.split(' ')[0],
    initials: displayName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    avatar: edit?.avatar,
  }
}

const DemoContext = createContext<DemoState | null>(null)

/** Shared, in-memory demo state. Nothing leaves the browser ("Synthetic data · no emails sent"). */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState(initialStore)
  const [role, setRole] = useState<Role>('partner')
  const [resetKey, setResetKey] = useState(0)
  const [toastMessage, setToastMessage] = useState('')
  const clearToast = useCallback(() => setToastMessage(''), [])

  const value: DemoState = {
    store,
    update: (recipe) =>
      setStore((current) => {
        const draft = structuredClone(current)
        recipe(draft)
        return draft
      }),
    role,
    setRole,
    me: withProfile(users[role], store),
    resetKey,
    reset: () => {
      setStore(initialStore())
      setRole('partner')
      setResetKey((k) => k + 1)
      setToastMessage('')
    },
    toast: setToastMessage,
    toastMessage,
    clearToast,
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside <DemoProvider>')
  return ctx
}

export const uid = () => Math.random().toString(36).slice(2, 9)
