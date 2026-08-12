import { Link } from 'react-router-dom'

const tools = [
  {
    href: '/tools/invitation-maker',
    title: 'Free Invitation Maker',
    description:
      'Create birthday, wedding, engagement, baby shower, housewarming and other invitations from editable templates.',
    cta: 'Create an Invitation',
    className: 'bg-blue-600 text-white hover:bg-blue-700',
  },
  {
    href: '/tools/invoice-maker',
    title: 'Free Invoice Maker',
    description:
      'Create professional invoices in your browser, save drafts locally, and download a PDF without uploading customer or business data.',
    cta: 'Create an Invoice',
    className: 'bg-green-600 text-white hover:bg-green-700',
  },
  {
    href: '/tools/resume-builder',
    title: 'Free Resume Builder',
    description:
      'Build a clean resume with reusable templates, keep your content on your device, and export a ready-to-share document.',
    cta: 'Build a Resume',
    className: 'border hover:bg-gray-50',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Create free invitations, resumes, invoices and printable designs
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600 text-lg">
          Customize original templates and download high-quality PDFs or images directly from your browser.
          No account, no watermark, and no document uploads are required.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <article key={tool.href} className="border rounded-xl p-5 bg-white shadow-sm">
              <h2 className="text-xl font-semibold">{tool.title}</h2>
              <p className="mt-2 text-sm text-gray-600 min-h-20">{tool.description}</p>
              <Link
                to={tool.href}
                className={`mt-5 block rounded-md px-4 py-3 text-center font-medium transition-colors ${tool.className}`}
              >
                {tool.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold">Why use CraftMyPage?</h2>
          <ul className="mt-4 list-disc pl-6 space-y-2 text-gray-700">
            <li>Templates are free to customize and download.</li>
            <li>Your design data and saved drafts stay in your browser.</li>
            <li>PDF and image exports are generated on your device.</li>
            <li>No account or subscription is required for the core tools.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">How it works</h2>
          <ol className="mt-4 list-decimal pl-6 space-y-2 text-gray-700">
            <li>Choose a template or tool.</li>
            <li>Customize the text, layout, and available design options.</li>
            <li>Download your finished PDF or image.</li>
          </ol>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Explore popular invitation templates</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            ['birthday', 'Birthday'],
            ['wedding', 'Wedding'],
            ['engagement', 'Engagement'],
            ['baby', 'Baby Shower'],
            ['housewarming', 'Housewarming'],
            ['naming', 'Naming Ceremony'],
            ['party', 'Party'],
            ['anniversary', 'Anniversary'],
          ].map(([slug, label]) => (
            <Link
              key={slug}
              to={`/invitations/${slug}`}
              className="border rounded-full px-4 py-2 text-sm hover:bg-gray-50"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="border rounded-xl p-6 bg-gray-50">
        <h2 className="text-2xl font-semibold">Create privately in your browser</h2>
        <p className="mt-2 text-gray-700">
          CraftMyPage is designed around local browser processing. We do not require you to upload
          invitation photos, resume content, or invoice data to use the core editors.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy" className="text-blue-700 underline">Read the Privacy Policy</Link>
          <Link to="/guides" className="text-blue-700 underline">Read our guides</Link>
        </div>
      </section>
    </div>
  )
}
