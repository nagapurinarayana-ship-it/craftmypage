import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="cmp-tool-shell">
      <div className="cmp-tool-header">
        <div>
          <p className="cmp-eyebrow">About</p>
          <h1 className="cmp-tool-title">About CraftMyPage</h1>
          <p className="cmp-tool-subtitle">Focused browser-based tools for invoices, invitations and resumes.</p>
        </div>
        <span className="cmp-badge">Privacy-first · Browser based</span>
      </div>
      <article className="cmp-surface space-y-8 p-6 sm:p-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Our mission</h2>
          <p className="leading-7 text-slate-600">CraftMyPage is a free, privacy-first design website for creating invitations, resumes, invoices and other printable documents directly in your browser.</p>
          <p className="leading-7 text-slate-600">Useful document tools should not require an account, subscription or watermark just to create a finished file. The core editing and export workflows are designed to run on your device.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">What makes us different</h2>
          <ul className="list-disc space-y-2 pl-6 text-slate-600">
            <li>Templates are free to customize.</li>
            <li>PDF and PNG downloads are available from the core tools.</li>
            <li>No account or login is required for the core editors.</li>
            <li>No watermark or paid download gate is used.</li>
            <li>No document uploads are required for the core editing workflows.</li>
            <li>Focused editors instead of a complicated all-in-one interface.</li>
          </ul>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Get started</h2>
          <p className="leading-7 text-slate-600">Start with the <Link to="/tools/invoice-maker" className="font-semibold text-indigo-700 underline">Invoice Maker</Link>, <Link to="/tools/invitation-maker" className="font-semibold text-indigo-700 underline">Invitation Maker</Link>, or <Link to="/tools/resume-builder" className="font-semibold text-indigo-700 underline">Resume Builder</Link>.</p>
        </section>
      </article>
    </div>
  )
}
