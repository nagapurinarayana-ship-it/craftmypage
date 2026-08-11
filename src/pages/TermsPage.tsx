export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-gray-600">Last updated: 11 August 2026</p>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">1. Acceptance of terms</h2>
        <p>
          By using CraftMyPage, you agree to these Terms of Service. If you do not agree, please do
          not use the website.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">2. Free service</h2>
        <p>
          CraftMyPage is provided free of charge. All core features — creating, editing, and
          downloading invitations, resumes, and designs — are available without payment, account, or
          watermark.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">3. Local processing</h2>
        <p>
          All designs are created and processed locally in your browser. We do not store your
          documents, personal data, or uploaded images on any server.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">4. Acceptable use</h2>
        <p>You agree not to use CraftMyPage to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Create content that is unlawful, harmful, or infringes others' rights.</li>
          <li>Attempt to disrupt, overload, or compromise the website.</li>
          <li>Copy or redistribute our original templates or assets without permission.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">5. Intellectual property</h2>
        <p>
          The CraftMyPage name, original templates, and website content are owned by CraftMyPage.
          Your own designs and content remain yours.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">6. Disclaimer and liability</h2>
        <p>
          CraftMyPage is provided "as is" without warranties of any kind. To the fullest extent
          permitted by law, we are not liable for any damages arising from your use of the website.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">7. Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the website after changes
          constitutes acceptance of the revised terms.
        </p>
      </section>
    </div>
  )
}