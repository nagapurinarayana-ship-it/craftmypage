import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'

const PAGES = {
  'gst-invoice': {
    title: 'Free GST Invoice Maker | Create GST Invoices Online | CraftMyPage',
    description: 'Create a professional GST-ready invoice layout in your browser with line items, tax fields, totals and A4 PDF export. Review your tax details before issuing an invoice.',
    eyebrow: 'GST invoicing',
    heading: 'Create a clean GST invoice in your browser.',
    intro: 'Build an invoice with business and customer details, line items, taxes, totals and payment information, then export an A4 PDF without uploading the document to a server.',
    points: ['Add GSTIN and business details', 'Show tax rates and calculated totals clearly', 'Review the invoice before downloading the A4 PDF', 'Keep your draft in the browser while you work'],
  },
  'freelancer-invoice': {
    title: 'Free Freelancer Invoice Maker | CraftMyPage',
    description: 'Create a professional freelancer invoice with services, rates, taxes, discounts, due dates and payment terms. Customize it in your browser and download an A4 PDF.',
    eyebrow: 'Freelancer invoices',
    heading: 'Create a professional freelancer invoice.',
    intro: 'Turn your services, rates and payment terms into a polished invoice without a complicated accounting suite. Customize the document in your browser and download a clean A4 PDF.',
    points: ['Describe services and line-item rates', 'Add discounts and tax information when needed', 'Set invoice and due dates', 'Add payment instructions and client details'],
  },
  'invoice-templates': {
    title: 'Free Invoice Templates | Professional Invoice Maker | CraftMyPage',
    description: 'Choose a professional invoice style and customize business details, line items, taxes, discounts and payment terms. Download a clean A4 invoice PDF.',
    eyebrow: 'Invoice templates',
    heading: 'Start from a professional invoice template.',
    intro: 'Pick a focused invoice layout, customize the content you need, and export the finished document as an A4 PDF. The core editor runs in your browser.',
    points: ['Choose from focused professional styles', 'Customize business, client and payment details', 'Calculate line totals, discounts and taxes', 'Download a print-ready A4 PDF'],
  },
} as const

type PageKey = keyof typeof PAGES

export default function InvoiceLandingPage() {
  const { intent = 'invoice-templates' } = useParams()
  const page = PAGES[(intent as PageKey)] ?? PAGES['invoice-templates']
  const canonical = `https://craftmypage.pages.dev/invoices/${intent}`

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
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title,
            description: page.description,
            url: canonical,
            about: { '@type': 'SoftwareApplication', name: 'CraftMyPage Invoice Maker', applicationCategory: 'BusinessApplication' },
          })}
        </script>
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
