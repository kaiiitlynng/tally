import { InvoiceTable } from '../components/InvoiceTable'
import { PageTitle } from '../components/PageTitle'
import { partner } from '../data/store'

/** Ready for Review (was "Review Invoices") list (Figma 36:5983 → content 36:6010). */
export default function ReviewInvoices() {
  return (
    <>
      <PageTitle
        eyebrow={`Assigned to ${partner.firstName}`}
        title="Ready for Review"
        description="Choose an invoice, resolve only the exceptions, then approve once."
      />
      <div className="pt-6">
        <InvoiceTable actionLabel="Review" />
      </div>
    </>
  )
}
