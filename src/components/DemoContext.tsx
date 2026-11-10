import { createContext, useContext, useState, type ReactNode } from 'react'
import { initialStore, type Store } from '../data/store'

interface DemoState {
  store: Store
  /** Mutate a deep copy of the store; the copy replaces the current state. */
  update: (recipe: (draft: Store) => void) => void
  /** Changes on every "Reset demo"; the shell keys pages off it to drop their local state. */
  resetKey: number
  reset: () => void
}

const DemoContext = createContext<DemoState | null>(null)

/** Shared, in-memory demo state. Nothing leaves the browser ("Synthetic data · no emails sent"). */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState(initialStore)
  const [resetKey, setResetKey] = useState(0)

  const value: DemoState = {
    store,
    update: (recipe) =>
      setStore((current) => {
        const draft = structuredClone(current)
        recipe(draft)
        return draft
      }),
    resetKey,
    reset: () => {
      setStore(initialStore())
      setResetKey((k) => k + 1)
    },
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
