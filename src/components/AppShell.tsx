import { Outlet } from 'react-router'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useDemo } from './DemoContext'

/** Sidebar + header + routed page. Desktop only: the app keeps a 1100px minimum width. */
export function AppShell() {
  const { resetKey, role } = useDemo()
  return (
    <div className="min-h-screen min-w-app-min bg-shell">
      <Sidebar />
      <div className="pl-sidebar">
        <Header />
        <main key={`${resetKey}-${role}`} className="max-w-content px-7.5 pt-7 pb-8.75">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
