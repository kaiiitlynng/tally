import { InvoiceTable } from '../components/InvoiceTable'
import { PageTitle } from '../components/PageTitle'

/** Ready for Review (was "Review Invoices") list (Figma 36:5983 → content 36:6010). */
export default function ReviewInvoices() {
  return (
    <>
      <PageTitle
        title="Ready for Review"
        description="Choose an invoice, resolve only the exceptions, then approve once."
      />
      <div className="pt-6">
        <InvoiceTable actionLabel="Review" />
      </div>
    </>
  )
}
