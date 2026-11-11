import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useDemo } from './DemoContext'
import { Toast } from './Toast'

/** Sidebar + header + routed page. Desktop only: the app keeps a 1100px minimum width. */
export function AppShell() {
  const { resetKey, role, toastMessage, clearToast } = useDemo()
  const { pathname } = useLocation()
  // A new page starts at the top (otherwise the previous page's scroll position carries over).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div className="min-h-screen min-w-app-min bg-shell">
      <Sidebar />
      <div className="pl-sidebar">
        <Header />
        <main key={`${resetKey}-${role}`} className="max-w-content px-8 pt-8 pb-12">
          <div className="stagger"><Outlet /></div>
        </main>
        <Toast message={toastMessage} onDone={clearToast} />
      </div>
    </div>
  )
}
