export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-gray-600">Last updated: 11 August 2026</p>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">1. Privacy-first by design</h2>
        <p>
          CraftMyPage is a free, privacy-first design website. Everything you create is processed
          locally in your browser on your own device.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>No account or login is required.</li>
          <li>No database or cloud storage is used.</li>
          <li>No document uploads are sent to any server.</li>
          <li>No watermark or paid download gate exists.</li>
          <li>Your designs and personal data stay on your device.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">2. Local storage</h2>
        <p>
          Projects you choose to save are stored locally in your browser using IndexedDB and
          localStorage. You can delete all saved information at any time by clearing your browser's
          site data.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">3. What we do not collect</h2>
        <p>
          We do not collect names, email addresses, phone numbers, invitation content, resume
          content, or uploaded photos. We do not use analytics trackers or third-party cookies.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">4. Advertising</h2>
        <p>
          If display advertising is introduced, non-intrusive ads may be shown outside the editing
          canvas. No ad network will receive your design or personal content.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">5. Contact</h2>
        <p>
          Questions about this policy can be sent through the{' '}
          <a href="/contact" className="text-blue-700 underline">
            Contact page
          </a>
          .
        </p>
      </section>
    </div>
  )
}