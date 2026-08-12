import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import EffectiveCpmHomeAds from '../components/monetization/EffectiveCpmHomeAds'

const tools = [
  { href: '/tools/invoice-maker', title: 'Invoice Maker', description: 'Create professional invoices with line items, taxes, discounts, GST details and downloadable PDFs in your browser.', icon: '₹', tone: 'from-emerald-600 to-teal-600', featured: true },
  { href: '/tools/invitation-maker', title: 'Invitation Maker', description: 'Create polished birthday, wedding, engagement, baby shower and celebration invitations from editable templates.', icon: '✦', tone: 'from-indigo-600 to-violet-600', featured: false },
  { href: '/tools/resume-builder', title: 'Resume Builder', description: 'Create ATS-friendly resumes with focused templates for students, engineers and experienced professionals.', icon: 'CV', tone: 'from-sky-600 to-cyan-600', featured: false },
]

const categories = [
  ['Birthday invitations', '/invitations/birthday'], ['Wedding invitations', '/invitations/wedding'], ['Engagement invitations', '/invitations/engagement'], ['Baby shower invitations', '/invitations/baby'], ['Housewarming invitations', '/invitations/housewarming'], ['Naming ceremony invitations', '/invitations/naming'], ['Party invitations', '/invitations/party'], ['Anniversary invitations', '/invitations/anniversary'],
]

const invoiceIntents = [
  ['GST invoice', '/invoices/gst-invoice'],
  ['Freelancer invoice', '/invoices/freelancer-invoice'],
  ['Invoice templates', '/invoices/invoice-templates'],
]

const resumeIntents = [
  ['ATS resume', '/resumes/ats-resume'],
  ['Fresher resume', '/resumes/fresher-resume'],
  ['Software engineer resume', '/resumes/software-engineer-resume'],
]

export default function HomePageInvoiceFirst() {
  return (
    <div className="cmp-page">
      <Helmet><script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'CraftMyPage', url: 'https://craftmypage.pages.dev/', applicationCategory: 'DesignApplication', operatingSystem: 'Web browser', description: 'Free browser-based invoice, invitation and resume creation tools with local drafts and PDF or image export.', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } })}</script></Helmet>

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(79,70,229,.15),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(6,182,212,.13),transparent_24%)]" />
        <div className="cmp-container relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <span className="cmp-eyebrow">Private by design · Browser based</span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Beautiful invoices, invitations and resumes without the complexity.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">Create a professional invoice, design an invitation or build a resume directly in your browser. Choose a template, customize it and download the finished PDF or image with no account required.</p>
            <div className="mt-8 grid gap-3 sm:max-w-3xl sm:grid-cols-3">
              <Link to="/tools/invoice-maker" className="cmp-primary-btn justify-center">Create an invoice</Link>
              <Link to="/tools/invitation-maker" className="cmp-secondary-btn justify-center">Create an invitation</Link>
              <Link to="/tools/resume-builder" className="cmp-secondary-btn justify-center">Build a resume</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500"><span>✓ Browser-based editing</span><span>✓ Local drafts</span><span>✓ PDF & PNG export</span><span>✓ No watermark</span></div>
          </div>
        </div>
      </section>

      <div className="cmp-container py-12 sm:py-16">
        <section aria-labelledby="tools-heading">
          <div><span className="cmp-eyebrow">Choose your tool</span><h2 id="tools-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Start with the job you need to finish.</h2><p className="mt-2 max-w-2xl text-slate-600">Invoice creation is front and center, with the invitation and resume editors one click away.</p></div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">{tools.map((tool) => <Link key={tool.href} to={tool.href} className={`cmp-card group relative ${tool.featured ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-md ring-1 ring-emerald-100' : ''}`}>{tool.featured && <span className="absolute right-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Featured</span>}<div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.tone} text-sm font-black text-white shadow-sm`}>{tool.icon}</div><h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-indigo-700">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p><span className="mt-5 inline-flex items-center text-sm font-semibold text-indigo-700">Open tool <span aria-hidden="true" className="ml-1 transition group-hover:translate-x-1">→</span></span></Link>)}</div>
        </section>

        <section className="mt-10" aria-labelledby="invoice-intents-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><span className="cmp-eyebrow">Popular invoice starting points</span><h2 id="invoice-intents-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Start with the invoice you need.</h2></div><Link className="text-sm font-semibold text-indigo-700" to="/guides/how-to-create-an-invoice">Learn invoice basics →</Link></div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">{invoiceIntents.map(([label, to]) => <Link key={to} to={to} className="cmp-card group"><p className="font-semibold text-slate-900 group-hover:text-indigo-700">{label}</p><p className="mt-2 text-sm leading-6 text-slate-600">Open a focused page with practical tips and a direct path to the Invoice Maker.</p><span className="mt-4 inline-flex text-sm font-semibold text-indigo-700">Explore →</span></Link>)}</div>
        </section>

        <section className="mt-10" aria-labelledby="resume-intents-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><span className="cmp-eyebrow">Popular resume starting points</span><h2 id="resume-intents-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Choose the resume format that fits your goal.</h2></div><Link className="text-sm font-semibold text-indigo-700" to="/guides/ats-friendly-resume">Read resume tips →</Link></div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">{resumeIntents.map(([label, to]) => <Link key={to} to={to} className="cmp-card group"><p className="font-semibold text-slate-900 group-hover:text-indigo-700">{label}</p><p className="mt-2 text-sm leading-6 text-slate-600">Start from a focused resume page and continue directly into the Resume Builder.</p><span className="mt-4 inline-flex text-sm font-semibold text-indigo-700">Explore →</span></Link>)}</div>
        </section>

        <EffectiveCpmHomeAds />

        <section className="mt-10 rounded-3xl border border-cyan-100 bg-cyan-50 p-6 sm:p-8" aria-labelledby="pdf-tools-heading"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><span className="cmp-eyebrow">More document tools</span><h2 id="pdf-tools-heading" className="mt-3 text-2xl font-bold text-slate-900">Need to edit an existing PDF?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Use FreePDF Tools for browser-based PDF merging, splitting, rotation, watermarking and conversion without uploading your documents.</p></div><a href="https://freepdfconverter-all-in-one.pages.dev/" className="cmp-secondary-btn shrink-0">Open FreePDF Tools →</a></div></section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl sm:p-10"><span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200">Why CraftMyPage</span><h2 className="mt-4 text-3xl font-bold tracking-tight">Your documents stay in your browser.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-300">The core editors are designed around local processing. Your invitation text, resume details and invoice data do not need to be uploaded to a conversion server just to create the final file.</p><div className="mt-8 grid gap-4 sm:grid-cols-3">{[['Local processing', 'Edit and export in the browser you already have open.'], ['Local drafts', 'Save projects in your browser and reopen them later.'], ['Simple exports', 'Download PDF or image files when your design is ready.']].map(([title, body]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-5 text-slate-400">{body}</p></div>)}</div><Link to="/privacy" className="mt-7 inline-flex text-sm font-semibold text-cyan-300 hover:text-white">Read the privacy policy →</Link></div>
          <div className="cmp-surface p-8 sm:p-10"><span className="cmp-eyebrow">Popular invitation categories</span><h2 className="mt-4 text-2xl font-bold text-slate-900">Choose a ready-made direction.</h2><p className="mt-2 text-sm leading-6 text-slate-600">Browse focused invitation categories before you open the editor.</p><div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{categories.map(([label, to]) => <Link key={to} to={to} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">{label} <span aria-hidden="true">→</span></Link>)}</div></div>
        </section>

        <section className="mt-16"><div className="text-center"><span className="cmp-eyebrow">How it works</span><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Three simple steps.</h2></div><div className="mt-8 grid gap-5 md:grid-cols-3">{[['01', 'Choose a template', 'Start with a focused template for the invoice, invitation or resume you need.'], ['02', 'Customize it', 'Change text, colors, details and images directly in the browser.'], ['03', 'Download', 'Export the finished design as a PDF or image when it is ready.']].map(([number, title, body]) => <div key={number} className="cmp-card"><span className="text-sm font-black text-indigo-600">{number}</span><h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></div>)}</div></section>
      </div>
    </div>
  )
}
