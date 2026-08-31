import { Link } from 'react-router-dom'

export default function ContactPage() {
  return (
    <div className="cmp-tool-shell">
      <div className="cmp-tool-header">
        <div>
          <p className="cmp-eyebrow">Help & contact</p>
          <h1 className="cmp-tool-title">Contact CraftMyPage</h1>
          <p className="cmp-tool-subtitle">
            Find help for invitations, invoices and resumes without leaving the CraftMyPage website.
          </p>
        </div>
        <span className="cmp-badge">Privacy-first support</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="cmp-surface p-6 sm:p-8">
          <span className="cmp-eyebrow">Support</span>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Having a problem with a tool?</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Start with the guides and retry the task in an up-to-date browser. If something still does not work,
            note the tool name, what you were trying to do, the browser/device you used and the exact step where
            the problem occurred.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="cmp-primary-btn" to="/guides">Browse help guides →</Link>
            <Link className="cmp-secondary-btn" to="/about">About CraftMyPage</Link>
          </div>
        </section>

        <section className="cmp-surface p-6 sm:p-8">
          <span className="cmp-eyebrow">Before reporting a problem</span>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Quick troubleshooting checklist</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Refresh the page and reopen the tool.</li>
            <li>Try the latest Chrome, Edge, Safari or Firefox available for your device.</li>
            <li>Check that your browser allows downloads for the site.</li>
            <li>For large documents, try a smaller file or fewer pages first.</li>
            <li>Do not include private document contents when describing a problem.</li>
          </ul>
        </section>

        <section className="cmp-surface p-6 sm:p-8 lg:col-span-2">
          <span className="cmp-eyebrow">Direct messages</span>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">A public support inbox is not enabled yet</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            CraftMyPage does not currently collect your name, email address or support message through this page.
            This avoids pretending that a message was submitted when there is no configured support backend.
            When a dedicated support channel is enabled, it will be shown here under the CraftMyPage brand.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            For document-handling details, read the{' '}
            <Link className="font-semibold text-indigo-700 underline" to="/privacy">Privacy Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
