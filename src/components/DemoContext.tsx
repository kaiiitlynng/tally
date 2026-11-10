import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { currentPeriod, initialStore, users, type BillingPeriod, type Role, type Store } from '../data/store'

interface DemoState {
  store: Store
  /** Mutate a deep copy of the store; the copy replaces the current state. */
  update: (recipe: (draft: Store) => void) => void
  /** "View as Partner" / "View as Employee". */
  role: Role
  setRole: (role: Role) => void
  /** The signed-in demo user for the current role. */
  me: (typeof users)[Role]
  /** Billing month selected in the employee "My Time" month picker. */
  period: BillingPeriod
  setPeriod: (period: BillingPeriod) => void
  /** Changes on every "Reset demo"; the shell keys pages off it to drop their local state. */
  resetKey: number
  reset: () => void
  /** App-wide success toast (rendered once by the shell). */
  toast: (message: string) => void
  toastMessage: string
  clearToast: () => void
}

const DemoContext = createContext<DemoState | null>(null)

/** Shared, in-memory demo state. Nothing leaves the browser ("Synthetic data · no emails sent"). */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState(initialStore)
  const [role, setRole] = useState<Role>('partner')
  const [period, setPeriod] = useState<BillingPeriod>(currentPeriod)
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
    me: users[role],
    period,
    setPeriod,
    resetKey,
    reset: () => {
      setStore(initialStore())
      setRole('partner')
      setPeriod(currentPeriod)
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
