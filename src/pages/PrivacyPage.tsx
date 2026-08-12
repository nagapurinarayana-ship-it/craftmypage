export default function PrivacyPage() {
  return (
    <div className="cmp-tool-shell">
      <div className="cmp-tool-header">
        <div>
          <p className="cmp-eyebrow">Privacy</p>
          <h1 className="cmp-tool-title">Privacy Policy</h1>
          <p className="cmp-tool-subtitle">Last updated: 12 August 2026</p>
        </div>
        <span className="cmp-badge">Core processing stays in your browser</span>
      </div>

      <article className="cmp-surface p-6 sm:p-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">1. Privacy-first by design</h2>
          <p className="text-slate-600 leading-7">
            CraftMyPage is designed so the core invitation, resume and invoice workflows run locally in
            your browser on your own device.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li>No account or login is required for the core tools.</li>
            <li>No database or cloud storage is used for saved projects.</li>
            <li>Documents, photos and invoice data are not uploaded by the core editors.</li>
            <li>No watermark or paid download gate is used by the core tools.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">2. Local storage</h2>
          <p className="text-slate-600 leading-7">
            Projects you choose to save are stored locally in your browser using IndexedDB and
            localStorage. You can delete saved information by clearing this site's browser data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">3. Invoice processing</h2>
          <p className="text-slate-600 leading-7">
            The Invoice Maker processes invoice information in your browser. Business details, customer
            details, line items and uploaded business logos are handled locally by the editor.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li>Generated PDFs are created in your browser.</li>
            <li>Invoice drafts saved with “Save Draft” remain in your browser's IndexedDB.</li>
            <li>Clearing browser data removes locally saved drafts; CraftMyPage does not maintain backups.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">4. Advertising and third parties</h2>
          <p className="text-slate-600 leading-7">
            CraftMyPage may display advertising and sponsored links outside the core editing controls.
            Third-party advertising providers may process technical request information according to their
            own privacy policies. The core PDF, invitation, resume and invoice workflows do not send your
            document contents to those providers.
          </p>
          <p className="text-slate-600 leading-7">
            Advertising scripts are intentionally kept separate from the application's editing and export
            code. Sponsored links are marked as sponsored where applicable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">5. Core data handling</h2>
          <p className="text-slate-600 leading-7">
            CraftMyPage does not require you to upload your invitation content, resume content, invoice
            data or photos to use the core editors. Features that rely on third-party services, including
            advertising, are separate from local document processing.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">6. Contact</h2>
          <p className="text-slate-600 leading-7">
            Questions about this policy can be sent through the{' '}
            <a href="/contact" className="text-indigo-700 underline underline-offset-2">
              Contact page
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  )
}
