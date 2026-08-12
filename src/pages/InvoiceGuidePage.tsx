import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_NAME, SITE_URL } from '../config/site'

export default function InvoiceGuidePage() {
  const publishedDate = '2026-08-11'
  const modifiedDate = '2026-08-12'

  return (
    <>
      <Helmet>
        <title>How to Create a Professional Invoice for Free</title>
        <meta
          name="description"
          content="Learn how to create a professional invoice for free, including required information, numbering, payment terms, taxes, discounts, and best practices."
        />
        <link rel="canonical" href={`${SITE_URL}/guides/how-to-create-an-invoice`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'How to Create a Professional Invoice for Free',
            description:
              'Learn how to create a professional invoice for free, including required information, numbering, payment terms, taxes, discounts, and best practices.',
            author: {
              '@type': 'Organization',
              name: SITE_NAME,
            },
            publisher: {
              '@type': 'Organization',
              name: SITE_NAME,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
              },
            },
            datePublished: publishedDate,
            dateModified: modifiedDate,
          })}
        </script>
      </Helmet>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How to Create a Professional Invoice for Free
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Learn how to create a professional invoice using our free invoice maker. No account, no watermark,
          and no fees required.
        </p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What is an Invoice?
            </h2>
            <p className="text-gray-700 mb-4">
              An invoice is a formal request for payment issued by a seller to a buyer. It documents the
              products or services provided, quantities, rates, taxes, and the total amount due. Invoices
              are essential for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Recording business transactions</li>
              <li>Requesting payment for goods or services</li>
              <li>Maintaining financial records for tax purposes</li>
              <li>Building a professional image</li>
              <li>Tracking payment status</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Invoice vs. Receipt
            </h2>
            <p className="text-gray-700 mb-4">
              While often confused, invoices and receipts serve different purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Invoice:</strong> Sent before payment is received. Requests payment for goods or
                services provided. Used for tracking outstanding payments.
              </li>
              <li>
                <strong>Receipt:</strong> Issued after payment has been received. Confirms that payment
                was made. Used as proof of purchase.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Essential Information Every Invoice Should Include
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Your Business Details
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Business name</li>
              <li>Complete business address</li>
              <li>Phone number and email</li>
              <li>Website (optional)</li>
              <li>Business logo (optional but professional)</li>
              <li>Tax ID or GSTIN (if applicable)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              Customer/Client Details
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Customer name or company</li>
              <li>Billing address</li>
              <li>Customer's tax ID (if GST-registered)</li>
              <li>Contact person (optional)</li>
              <li>Email or phone (optional)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              Invoice Details
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Invoice Number:</strong> Unique identifier for tracking. Should follow a
                consistent format.
              </li>
              <li>
                <strong>Invoice Date:</strong> When the invoice was issued.
              </li>
              <li>
                <strong>Due Date:</strong> When payment is expected.
              </li>
              <li>
                <strong>Payment Terms:</strong> e.g., "Net 30", "Due upon receipt", etc.
              </li>
              <li>
                <strong>Currency:</strong> The currency in which prices are quoted.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              Line Items
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Description:</strong> Clear description of the product or service
              </li>
              <li>
                <strong>Quantity:</strong> How many units provided
              </li>
              <li>
                <strong>Unit Price:</strong> Price per unit
              </li>
              <li>
                <strong>Amount:</strong> Quantity × Unit Price (minus any discounts)
              </li>
              <li>
                <strong>Tax Rate:</strong> Applicable tax percentage
              </li>
              <li>
                <strong>HSN/SAC Code:</strong> Required for GST invoices in India
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              Totals and Payment Information
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Subtotal:</strong> Sum of all line items before tax and discounts
              </li>
              <li>
                <strong>Discounts:</strong> Any discounts applied
              </li>
              <li>
                <strong>Taxes:</strong> GST, VAT, or sales tax amounts
              </li>
              <li>
                <strong>Total Amount Due:</strong> Final amount owed
              </li>
              <li>
                <strong>Payment Instructions:</strong> How and where to send payment
              </li>
              <li>
                <strong>Bank Details:</strong> Account number, IFSC code, SWIFT code (if applicable)
              </li>
              <li>
                <strong>UPI ID:</strong> For Indian businesses using UPI
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How to Number Your Invoices
            </h2>
            <p className="text-gray-700 mb-4">
              Proper invoice numbering is important for organization and financial tracking:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Sequential Format:</strong> INV-001, INV-002, INV-003 (easiest to track)
              </li>
              <li>
                <strong>Date-Based:</strong> INV-2026-01-001 (invoice number includes year and month)
              </li>
              <li>
                <strong>Client-Based:</strong> CLT-001-INV-001 (includes client code)
              </li>
              <li>
                <strong>Never reuse:</strong> Every invoice must have a unique number
              </li>
              <li>
                <strong>Consistency:</strong> Use the same format throughout all invoices
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Setting Payment Terms
            </h2>
            <p className="text-gray-700 mb-4">
              Payment terms specify when and how payment should be made:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Due upon receipt:</strong> Payment expected immediately
              </li>
              <li>
                <strong>Net 15:</strong> Payment due within 15 days
              </li>
              <li>
                <strong>Net 30:</strong> Payment due within 30 days (most common)
              </li>
              <li>
                <strong>Net 45:</strong> Payment due within 45 days
              </li>
              <li>
                <strong>Net 60:</strong> Payment due within 60 days
              </li>
              <li>
                <strong>2/10 Net 30:</strong> 2% discount if paid within 10 days, otherwise full amount
                due in 30 days
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Adding Discounts and Taxes
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Discounts
            </h3>
            <p className="text-gray-700 mb-4">
              Discounts can be applied per line item or to the entire invoice:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Fixed Discount:</strong> A specific amount reduced from the total (e.g., ₹500
                discount)
              </li>
              <li>
                <strong>Percentage Discount:</strong> A percentage off the total (e.g., 10% discount)
              </li>
              <li>
                <strong>Volume Discounts:</strong> Larger orders may qualify for discounts
              </li>
              <li>
                <strong>Early Payment Discounts:</strong> Encourage faster payment
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              Taxes
            </h3>
            <p className="text-gray-700 mb-4">
              Different regions have different tax requirements. Our free invoice maker supports:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Simple Sales Tax/VAT:</strong> A flat percentage tax added to the total
              </li>
              <li>
                <strong>India GST:</strong> The most complex tax system with CGST, SGST, and IGST
              </li>
              <li>
                <strong>Tax-Exempt Items:</strong> Some items may not be subject to tax
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              India GST: CGST/SGST vs IGST
            </h2>
            <p className="text-gray-700 mb-4">
              If you're operating in India, understanding GST is crucial:
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Intra-State Transactions (CGST + SGST)
            </h3>
            <p className="text-gray-700 mb-4">
              When the supplier and customer are in the same state:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>CGST (Central Goods and Services Tax):</strong> Tax collected by the Central
                Government
              </li>
              <li>
                <strong>SGST (State Goods and Services Tax):</strong> Tax collected by the State
                Government
              </li>
              <li>
                <strong>Combined Rate:</strong> Usually 5%, 9%, or 18% total (e.g., 9% CGST + 9% SGST = 18%)
              </li>
              <li>
                <strong>Example:</strong> For a ₹10,000 item in Gujarat with 18% GST (5% + 5%): CGST =
                ₹900, SGST = ₹900, Total = ₹11,800
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-4">
              Inter-State Transactions (IGST)
            </h3>
            <p className="text-gray-700 mb-4">
              When the supplier and customer are in different states:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>IGST (Integrated Goods and Services Tax):</strong> Single tax rate applied
              </li>
              <li>
                <strong>Rate:</strong> Same combined rate as CGST + SGST (5%, 9%, or 18%)
              </li>
              <li>
                <strong>Example:</strong> For a ₹10,000 item from Gujarat to Maharashtra with 18% GST:
                IGST = ₹1,800, Total = ₹11,800
              </li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a simplified explanation. For GST compliance, always verify
                current rates and requirements with official sources or your accountant. Our free invoice
                maker does not guarantee legal or tax compliance.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Choosing the Right Due Date
            </h2>
            <p className="text-gray-700 mb-4">
              The due date affects cash flow and customer relationships:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Immediate Payment:</strong> Set due date to invoice date for cash-only businesses
              </li>
              <li>
                <strong>Standard Practice:</strong> Most businesses offer Net 30 terms
              </li>
              <li>
                <strong>Longer Terms:</strong> Net 45 or Net 60 may be needed for large customers or
                negotiated agreements
              </li>
              <li>
                <strong>Follow Local Laws:</strong> Some countries have maximum payment terms requirements
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Avoiding Common Invoice Errors
            </h2>
            <p className="text-gray-700 mb-4">
              Small mistakes can delay payment or cause compliance issues:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>❌ Duplicate Invoice Numbers:</strong> Always use unique numbers
              </li>
              <li>
                <strong>❌ Missing Tax Information:</strong> Include tax rates and calculations clearly
              </li>
              <li>
                <strong>❌ Incorrect GST/Tax ID:</strong> Verify customer's GST number before invoicing
              </li>
              <li>
                <strong>❌ Vague Descriptions:</strong> Be specific about products or services
              </li>
              <li>
                <strong>❌ Unclear Payment Instructions:</strong> Make it easy for customers to pay
              </li>
              <li>
                <strong>❌ No Invoice Date or Due Date:</strong> Always include both dates
              </li>
              <li>
                <strong>❌ Math Errors:</strong> Double-check all calculations
              </li>
              <li>
                <strong>❌ Missing Contact Information:</strong> Include ways for customers to reach you
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Protecting Customer Information
            </h2>
            <p className="text-gray-700 mb-4">
              Invoices contain sensitive information that should be handled carefully:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Send via Secure Channel:</strong> Email invoices through secure, encrypted methods
              </li>
              <li>
                <strong>No Sensitive Data:</strong> Don't include full credit card numbers or excessive
                financial data
              </li>
              <li>
                <strong>Limited Payment Details:</strong> Only include necessary payment information
              </li>
              <li>
                <strong>Confidential Handling:</strong> Keep invoices confidential and secure
              </li>
              <li>
                <strong>Retention Policy:</strong> Keep invoices for the required period (typically 7
                years in India for tax purposes)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Downloading and Sending the PDF
            </h2>
            <p className="text-gray-700 mb-4">
              Our free invoice maker generates professional PDF invoices that are ready to send:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>
                <strong>Generate PDF:</strong> Click "Download PDF" to create your invoice
              </li>
              <li>
                <strong>Review:</strong> Check the PDF for accuracy before sending
              </li>
              <li>
                <strong>Send via Email:</strong> Attach the PDF to an email and send to your customer
              </li>
              <li>
                <strong>Keep Copies:</strong> Save invoices in your own filing system
              </li>
              <li>
                <strong>Track Payment:</strong> Update your records when payment is received
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Ready to Create Your Invoice?
              </h2>
              <p className="text-gray-700 mb-4">
                Use our free invoice maker to create professional invoices in minutes. No account needed,
                and your data stays on your device.
              </p>
              <Link
                to="/tools/invoice-maker"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
              >
                Create Invoice Now →
              </Link>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Privacy Notice
            </h2>
            <p className="text-gray-700 mb-4">
              Our free invoice maker is completely private and secure:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>No Server Uploads:</strong> Your invoice data is never sent to our servers
              </li>
              <li>
                <strong>No Account Required:</strong> You don't need to sign up or log in
              </li>
              <li>
                <strong>Local Processing:</strong> All invoices are created entirely in your browser
              </li>
              <li>
                <strong>No Tracking:</strong> We don't track your invoicing activity
              </li>
              <li>
                <strong>Your Data:</strong> You maintain complete control of all invoice data
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Tools</h3>
          <ul className="space-y-2 text-blue-600">
            <li>
              <Link to="/tools/invoice-maker" className="hover:underline">
                Free Invoice Maker
              </Link>
            </li>
            <li>
              <Link to="/tools/resume-builder" className="hover:underline">
                Resume Builder
              </Link>
            </li>
            <li>
              <Link to="/tools/invitation-maker" className="hover:underline">
                Invitation Maker
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </>
  )
}
