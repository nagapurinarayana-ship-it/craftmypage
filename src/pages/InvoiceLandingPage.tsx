import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'

const PAGES = {
  'gst-invoice': {
    title: 'Free GST Invoice Generator Online | CraftMyPage',
    description: 'Create a GST-ready invoice online with GSTIN, HSN or SAC codes, CGST, SGST or IGST, payment details and a professional A4 PDF. Free and no account required.',
    eyebrow: 'GST invoicing',
    heading: 'Create a clean GST invoice in your browser.',
    intro: 'Build an invoice with business and customer details, line items, taxes, totals and payment information, then export an A4 PDF without uploading the document to a server.',
    points: ['Add GSTIN and business details', 'Show tax rates and calculated totals clearly', 'Review the invoice before downloading the A4 PDF', 'Keep your draft in the browser while you work'],
  },
  'freelancer-invoice': {
    title: 'Free Freelancer Invoice Generator | CraftMyPage',
    description: 'Create a professional freelancer invoice online with services, rates, taxes, discounts, due dates and payment terms, then download a clean A4 PDF.',
    eyebrow: 'Freelancer invoices',
    heading: 'Create a professional freelancer invoice.',
    intro: 'Turn your services, rates and payment terms into a polished invoice without a complicated accounting suite. Customize the document in your browser and download a clean A4 PDF.',
    points: ['Describe services and line-item rates', 'Add discounts and tax information when needed', 'Set invoice and due dates', 'Add payment instructions and client details'],
  },
  'invoice-templates': {
    title: 'Free Invoice Templates & Online Invoice Maker | CraftMyPage',
    description: 'Choose a professional invoice template, customize business and client details, calculate totals and download a print-ready A4 PDF for free.',
    eyebrow: 'Invoice templates',
    heading: 'Start from a professional invoice template.',
    intro: 'Pick a focused invoice layout, customize the content you need, and export the finished document as an A4 PDF. The core editor runs in your browser.',
    points: ['Choose from focused professional styles', 'Customize business, client and payment details', 'Calculate line totals, discounts and taxes', 'Download a print-ready A4 PDF'],
  },
} as const

type PageKey = keyof typeof PAGES

const FAQS = [
  ['Can I create an invoice without an account?', 'Yes. The invoice maker is designed to let you create and edit an invoice in your browser without requiring an accounting subscription.'],
  ['Can I download the finished invoice?', 'Yes. After reviewing the document, you can export an A4 PDF that is ready to save, share or print.'],
  ['What should I check before sending an invoice?', 'Review the customer details, invoice number, dates, line items, tax values, totals and payment instructions before sending it.'],
]

export default function InvoiceLandingPage() {
  const { intent = 'invoice-templates' } = useParams()
  const page = PAGES[(intent as PageKey)] ?? PAGES['invoice-templates']
  const canonical = `https://craftmypage.pages.dev/invoices/${intent}`
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      url: canonical,
      about: { '@type': 'SoftwareApplication', name: 'CraftMyPage Invoice Maker', applicationCategory: 'BusinessApplication' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: page.title.replace(/ \| CraftMyPage$/, ''),
      description: page.description,
      url: canonical,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web browser',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
    },
  ]

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CraftMyPage" />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={canonical} />
        {schemas.map((schema) => <script key={schema['@type']} type="application/ld+json">{JSON.stringify(schema)}</script>)}
      </Helmet>

      <div className="cmp-page">
        <section className="border-b border-slate-200 bg-white">
          <div className="cmp-container py-14 sm:py-18 lg:py-20">
            <span className="cmp-eyebrow">{page.eyebrow}</span>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{page.heading}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{page.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="cmp-primary-btn" to="/tools/invoice-maker">Create an invoice</Link>
              <Link className="cmp-secondary-btn" to="/guides/how-to-create-an-invoice">Read the invoice guide</Link>
            </div>
          </div>
        </section>

        <section className="cmp-container py-12 sm:py-16">
          <div className="grid gap-5 md:grid-cols-2">
            {page.points.map((point) => (
              <div className="cmp-card" key={point}>
                <span className="text-sm font-black text-indigo-600">✓</span>
                <p className="mt-3 text-base font-semibold text-slate-900">{point}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="cmp-surface p-8 sm:p-10">
              <span className="cmp-eyebrow">Choose the right starting point</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Create the invoice you actually need.</h2>
              <p className="mt-4 leading-7 text-slate-600">Use the GST-focused page for tax-ready invoices, the freelancer page for service billing, or the template collection when you want to start with a professional layout.</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                <Link className="cmp-secondary-btn" to="/invoices/gst-invoice">GST invoices</Link>
                <Link className="cmp-secondary-btn" to="/invoices/freelancer-invoice">Freelancer invoices</Link>
                <Link className="cmp-secondary-btn" to="/invoices/invoice-templates">Invoice templates</Link>
              </div>
            </div>
            <div className="cmp-surface p-8 sm:p-10">
              <span className="cmp-eyebrow">Before you send</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Use a quick invoice review.</h2>
              <ul className="mt-5 space-y-3 text-slate-600">
                <li>• Confirm customer and business details.</li>
                <li>• Check invoice number and issue/due dates.</li>
                <li>• Verify quantities, rates, taxes, discounts and totals.</li>
                <li>• Confirm payment instructions before sharing the PDF.</li>
              </ul>
            </div>
          </div>

          <section className="mt-12" aria-labelledby="invoice-faq">
            <h2 id="invoice-faq" className="text-3xl font-bold tracking-tight text-slate-900">Invoice maker questions</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {FAQS.map(([question, answer]) => (
                <article className="cmp-card" key={question}>
                  <h3 className="text-lg font-bold text-slate-900">{question}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{answer}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-12 cmp-surface p-8 sm:p-10">
            <span className="cmp-eyebrow">Why use CraftMyPage?</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Focused invoicing without an accounting suite.</h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">The invoice editor is designed for creating a document quickly. Your core invoice data stays in the browser while you customize and export the document.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link className="cmp-primary-btn" to="/tools/invoice-maker">Open Invoice Maker</Link>
              <Link className="cmp-secondary-btn" to="/privacy">Read privacy details</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
