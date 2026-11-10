import { InvoiceTable } from '../components/InvoiceTable'
import { PageTitle } from '../components/PageTitle'
import { partner } from '../data/store'

/** Review Invoices list (Figma 36:5983 → content 36:6010). */
export default function ReviewInvoices() {
  return (
    <>
      <PageTitle
        eyebrow={`Assigned to ${partner.firstName}`}
        title="Review Invoices"
        description="Choose an invoice, resolve only the exceptions, then approve once."
      />
      <div className="pt-6">
        <InvoiceTable actionLabel="Review" />
      </div>
    </>
  )
}
