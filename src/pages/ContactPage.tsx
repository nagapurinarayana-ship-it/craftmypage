export default function ContactPage() {
  return (
    <div className="cmp-tool-shell">
      <div className="cmp-tool-header">
        <div>
          <p className="cmp-eyebrow">Contact</p>
          <h1 className="cmp-tool-title">Contact CraftMyPage</h1>
          <p className="cmp-tool-subtitle">For support, bug reports and product feedback, use the project issue tracker.</p>
        </div>
        <span className="cmp-badge">No message is submitted from this page</span>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="cmp-surface p-6 sm:p-8">
          <span className="cmp-eyebrow">Support</span>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Report a problem or request a feature</h2>
          <p className="mt-3 leading-7 text-slate-600">Include the tool name, steps to reproduce the issue, and any browser/device details that matter.</p>
          <a className="cmp-primary-btn mt-6" href="https://github.com/nagapurinarayana-ship-it/craftmypage/issues" target="_blank" rel="noopener noreferrer">Open GitHub issues →</a>
        </section>
        <section className="cmp-surface p-6 sm:p-8">
          <span className="cmp-eyebrow">Privacy</span>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">No fake send step</h2>
          <p className="mt-3 leading-7 text-slate-600">This page does not collect your name, email address, or message and then pretend it was delivered.</p>
          <p className="mt-4 text-sm leading-6 text-slate-500">For document privacy details, read the <a className="font-semibold text-indigo-700 underline" href="/privacy">Privacy Policy</a>.</p>
        </section>
      </div>
    </div>
  )
}
