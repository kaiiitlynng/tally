import type { KeyboardEvent } from 'react'

/**
 * Arrow / Home / End navigation for a role="tablist" (WAI-ARIA tabs pattern, automatic activation).
 * Put it on the tablist's onKeyDown and give each tab tabIndex={selected ? 0 : -1}.
 */
export function onTabListKeyDown(e: KeyboardEvent<HTMLElement>) {
  const vertical = e.currentTarget.getAttribute('aria-orientation') === 'vertical'
  const prev = vertical ? 'ArrowUp' : 'ArrowLeft'
  const next = vertical ? 'ArrowDown' : 'ArrowRight'
  if (![prev, next, 'Home', 'End'].includes(e.key)) return
  const tabs = [...e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')]
  const i = tabs.indexOf(document.activeElement as HTMLElement)
  if (i < 0) return
  e.preventDefault()
  const target = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === next ? 1 : -1) + tabs.length) % tabs.length
  tabs[target].focus()
  tabs[target].click()
}
