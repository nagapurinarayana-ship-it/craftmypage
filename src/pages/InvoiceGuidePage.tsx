import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_NAME, SITE_URL } from '../config/site'

export default function InvoiceGuidePage() {
  const publishedDate = '2026-08-11'
  const modifiedDate = '2026-08-15'
  const description = 'Learn how to create a professional invoice for free, including required information, numbering, payment terms, taxes, discounts, GST basics, and a final review checklist.'

  return (
    <>
      <Helmet>
        <title>How to Create a Professional Invoice for Free</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/guides/how-to-create-an-invoice`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'How to Create a Professional Invoice for Free',
            description,
            url: `${SITE_URL}/guides/how-to-create-an-invoice`,
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/guides/how-to-create-an-invoice` },
            author: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/about` },
            publisher: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/about` },
            datePublished: publishedDate,
            dateModified: modifiedDate,
            inLanguage: 'en',
          })}
        </script>
      </Helmet>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-gray-500">
          <Link to="/guides" className="hover:text-blue-700">Guides</Link>
          <span aria-hidden="true"> / </span>
          <span>Invoice guide</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Create a Professional Invoice for Free</h1>
        <p className="text-lg text-gray-600 mb-8">
          A practical guide to building a clear invoice, checking the numbers, choosing payment terms, and preparing a PDF that is easy for your customer to understand.
        </p>

        <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Quick checklist</h2>
          <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li>✓ Supplier and customer details</li>
            <li>✓ Unique invoice number and issue date</li>
            <li>✓ Clear line-item descriptions and amounts</li>
            <li>✓ Tax, discount and total calculations</li>
            <li>✓ Due date and payment instructions</li>
            <li>✓ Final PDF review before sending</li>
          </ul>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2>What is an invoice?</h2>
            <p>
              An invoice is a document a seller or service provider issues to request payment and record the details of a transaction. A good invoice makes the supplier, customer, work or goods, amounts, taxes where applicable, payment terms and amount due easy to identify.
            </p>
            <p>
              An invoice is different from a receipt: an invoice generally requests or records an amount payable, while a receipt confirms that payment has been received.
            </p>
          </section>

          <section className="mb-8">
            <h2>Information to put on an invoice</h2>
            <h3>Your business or supplier details</h3>
            <ul>
              <li>Business or trading name</li>
              <li>Address and relevant contact details</li>
              <li>Email, phone or website where useful</li>
              <li>Tax registration details when applicable</li>
            </ul>

            <h3>Customer details</h3>
            <ul>
              <li>Customer or company name</li>
              <li>Billing or delivery address when relevant</li>
              <li>Customer tax registration details when applicable</li>
              <li>Contact person or communication details when useful</li>
            </ul>

            <h3>Invoice details</h3>
            <ul>
              <li><strong>Invoice number:</strong> use a consistent numbering system and avoid accidental duplicates.</li>
              <li><strong>Issue date:</strong> the date the invoice is issued.</li>
              <li><strong>Due date:</strong> the agreed payment deadline.</li>
              <li><strong>Payment terms:</strong> such as due on receipt or Net 30, when agreed.</li>
              <li><strong>Currency:</strong> make the currency clear wherever amounts are shown.</li>
            </ul>

            <h3>Line items</h3>
            <ul>
              <li>Clear product or service description</li>
              <li>Quantity and unit where relevant</li>
              <li>Unit price or rate</li>
              <li>Discount or taxable value where applicable</li>
              <li>Tax rate and tax amount where applicable</li>
              <li>HSN code for goods or Accounting Code/SAC for services when required by the applicable GST rules</li>
            </ul>

            <h3>Totals and payment information</h3>
            <ul>
              <li>Subtotal or taxable value</li>
              <li>Discounts and other adjustments</li>
              <li>Tax breakdown where applicable</li>
              <li>Total amount due and, if relevant, amount already paid</li>
              <li>Payment instructions, bank details or UPI information when you want customers to use them</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>How to choose an invoice numbering system</h2>
            <p>
              Choose a format that is easy for you to maintain and makes each invoice identifiable. Examples include <strong>INV-001</strong>, <strong>INV-2026-001</strong>, or a client/project reference followed by a sequence number.
            </p>
            <p>
              For GST tax invoices in India, the official rules require a consecutive serial number, in one or more series, that is unique for the financial year and follows the permitted character rules. Keep your numbering consistent with your accounting process and applicable requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2>Setting payment terms</h2>
            <p>Payment terms should reflect the agreement you have with the customer. Common examples include:</p>
            <ul>
              <li><strong>Due upon receipt:</strong> payment is expected immediately or as agreed.</li>
              <li><strong>Net 15:</strong> payment is due within 15 days of the relevant invoice date or agreed trigger.</li>
              <li><strong>Net 30:</strong> payment is due within 30 days under the agreed terms.</li>
              <li><strong>Early-payment discount:</strong> a discount may apply if the customer pays within a defined period.</li>
            </ul>
            <p>Do not assume a payment term is legally required or appropriate in every jurisdiction or contract; use the terms you have actually agreed.</p>
          </section>

          <section className="mb-8">
            <h2>Discounts and taxes: check the calculation order</h2>
            <p>
              A professional invoice should make it possible for the customer to understand how the final amount was reached. Show discounts clearly, identify the taxable amount where relevant, and show each tax component separately when the tax regime calls for it.
            </p>
            <ul>
              <li><strong>Fixed discount:</strong> a stated monetary reduction.</li>
              <li><strong>Percentage discount:</strong> a percentage reduction applied according to the invoice calculation rules.</li>
              <li><strong>Tax:</strong> show the rate and resulting amount rather than hiding tax inside an unexplained total.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>India GST: CGST + SGST versus IGST</h2>
            <p>
              GST treatment depends on the nature of the supply and applicable rules. At a high level, an intra-State taxable supply can involve CGST and SGST/UTGST, while an inter-State taxable supply can involve IGST. The correct tax treatment should be determined from the actual transaction, not simply from the customer's and supplier's state names in isolation.
            </p>

            <h3>Intra-State example</h3>
            <p>
              If an example taxable value is ₹10,000 and the applicable combined GST rate is 18%, an illustrative split could be 9% CGST (₹900) plus 9% SGST (₹900), producing ₹1,800 tax and ₹11,800 including tax.
            </p>

            <h3>Inter-State example</h3>
            <p>
              If the same ₹10,000 taxable value is subject to an 18% IGST rate, the illustrative IGST amount is ₹1,800 and the total is ₹11,800 including tax.
            </p>

            <p>
              GST invoices can require additional particulars such as supplier GSTIN, invoice serial number, date, recipient details, HSN/Accounting Code, taxable value, tax rate and amount, place of supply for relevant inter-State supplies, reverse-charge indication where applicable, and supplier signature or digital signature. The exact requirements and applicable exceptions should be checked against current official rules.
            </p>

            <div className="not-prose rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>Important:</strong> This section is general educational information, not tax or legal advice. GST rates, e-invoicing obligations, HSN/SAC requirements and other compliance rules can depend on the transaction and taxpayer. Check the current official GST/CBIC guidance or consult a qualified professional before relying on an invoice for compliance.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2>How to review an invoice before sending it</h2>
            <ol>
              <li>Confirm the supplier and customer names and addresses.</li>
              <li>Check the invoice number and issue date.</li>
              <li>Check every quantity, rate, discount and tax amount.</li>
              <li>Confirm the due date and payment instructions.</li>
              <li>For GST invoices, verify the applicable tax treatment and required particulars.</li>
              <li>Open the exported PDF and check that no text is clipped or missing.</li>
              <li>Keep the final copy in your normal accounting or record-keeping system.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2>Protecting customer information</h2>
            <p>
              Invoices can contain names, addresses, tax identifiers and payment information. Share them through a trusted channel, avoid putting unnecessary sensitive information on the document, and follow your own business and legal record-retention requirements.
            </p>
            <p>
              CraftMyPage's invoice editor is designed to process core invoice data in the browser and store drafts locally. Third-party services such as advertising can still make their own network requests, so do not treat a browser-based editor as a guarantee that every request made by the page is private. Review the <Link to="/privacy">Privacy Policy</Link> for the site's broader data and third-party-service disclosures.
            </p>
          </section>

          <section className="mb-8">
            <h2>Download and send the PDF</h2>
            <ol>
              <li>Complete the invoice in the <Link to="/tools/invoice-maker">Invoice Maker</Link>.</li>
              <li>Review the live totals and important details.</li>
              <li>Download the PDF.</li>
              <li>Open the PDF yourself before sending it.</li>
              <li>Send it using the communication channel agreed with your customer.</li>
              <li>Keep your own accounting copy and update the payment status when appropriate.</li>
            </ol>
          </section>

          <section className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to create your invoice?</h2>
              <p className="text-gray-700 mb-4">
                Use the free invoice maker to build the document in your browser, save drafts locally, and download a PDF when it is ready.
              </p>
              <Link to="/tools/invoice-maker" className="inline-block px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700">
                Create Invoice Now →
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Continue with CraftMyPage</h2>
          <ul className="space-y-2 text-blue-600">
            <li><Link to="/tools/invoice-maker" className="hover:underline">Free Invoice Maker</Link></li>
            <li><Link to="/invoices/gst-invoice" className="hover:underline">GST Invoice Guide</Link></li>
            <li><Link to="/invoices/freelancer-invoice" className="hover:underline">Freelancer Invoice</Link></li>
            <li><Link to="/invoices/invoice-templates" className="hover:underline">Invoice Templates</Link></li>
          </ul>
        </div>
      </article>
    </>
  )
}
