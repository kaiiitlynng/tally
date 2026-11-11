import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppShell } from './components/AppShell'
import { DemoProvider, useDemo } from './components/DemoContext'
import ClientsProjects from './pages/ClientsProjects'
import EmployeeHome from './pages/EmployeeHome'
import InvoiceReview from './pages/InvoiceReview'
import Invoices from './pages/Invoices'
import Messages from './pages/Messages'
import MyProjects from './pages/MyProjects'
import NotFound from './pages/NotFound'
import PartnerHome from './pages/PartnerHome'
import ReviewInvoices from './pages/ReviewInvoices'
import EmployeeSettings from './pages/EmployeeSettings'
import Settings from './pages/Settings'
import TeamReminders from './pages/TeamReminders'
import TimeEntries from './pages/TimeEntries'

/** Routes depend on "View as": partner-only pages send employees home, and vice versa. */
function AppRoutes() {
  const { role } = useDemo()
  const partnerOnly = (el: React.ReactElement) => (role === 'partner' ? el : <Navigate to="/" replace />)
  const employeeOnly = (el: React.ReactElement) => (role === 'employee' ? el : <Navigate to="/" replace />)

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={role === 'partner' ? <PartnerHome /> : <EmployeeHome />} />
        <Route path="clients" element={partnerOnly(<ClientsProjects />)} />
        <Route path="projects" element={employeeOnly(<MyProjects />)} />
        <Route path="time" element={<TimeEntries />} />
        <Route path="review" element={partnerOnly(<ReviewInvoices />)} />
        <Route path="review/:invoiceId" element={partnerOnly(<InvoiceReview />)} />
        <Route path="invoices" element={partnerOnly(<Invoices />)} />
        <Route path="messages" element={<Messages />} />
        <Route path="team" element={partnerOnly(<TeamReminders />)} />
        <Route path="settings" element={role === 'partner' ? <Settings /> : <EmployeeSettings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DemoProvider>
  )
}
