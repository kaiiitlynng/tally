import { BrowserRouter, Route, Routes } from 'react-router'
import { AppShell } from './components/AppShell'
import { DemoProvider } from './components/DemoContext'
import InvoiceReview from './pages/InvoiceReview'
import Invoices from './pages/Invoices'
import Messages from './pages/Messages'
import NotFound from './pages/NotFound'
import ClientsProjects from './pages/ClientsProjects'
import PartnerHome from './pages/PartnerHome'
import ReviewInvoices from './pages/ReviewInvoices'
import Settings from './pages/Settings'
import TeamReminders from './pages/TeamReminders'
import TimeEntries from './pages/TimeEntries'

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<PartnerHome />} />
            <Route path="clients" element={<ClientsProjects />} />
            <Route path="time" element={<TimeEntries />} />
            <Route path="review" element={<ReviewInvoices />} />
            <Route path="review/:invoiceId" element={<InvoiceReview />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="messages" element={<Messages />} />
            <Route path="team" element={<TeamReminders />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  )
}
