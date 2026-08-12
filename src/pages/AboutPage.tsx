import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">About CraftMyPage</h1>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Our mission</h2>
        <p>
          CraftMyPage is a free, privacy-first design website for creating invitations, resumes,
          invoices, cover letters, and printable designs directly in your browser.
        </p>
        <p>
          We believe useful designs should not require an account, a subscription, or a watermark.
          Core editing and export workflows are designed to run on your device.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">What makes us different</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Every template is free to customize.</li>
          <li>PDF and PNG downloads are available from the core tools.</li>
          <li>No account or login is required for the core editors.</li>
          <li>No watermark or paid download gate is used.</li>
          <li>No document uploads are required for the core editing workflows.</li>
          <li>Fast, focused editors instead of a complicated all-in-one tool.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p>
          Choose a template, customize the text, colors, and layout, then download a PDF or image.
          Projects you choose to save remain in your browser and can be reopened on the same device.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Privacy promise</h2>
        <p>
          The core editors are designed for local browser processing. See our{' '}
          <Link to="/privacy" className="text-blue-700 underline">
            Privacy Policy
          </Link>{' '}
          for details about local storage and data handling.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Get started</h2>
        <p>
          Create your first design with the{' '}
          <Link to="/tools/invitation-maker" className="text-blue-700 underline">
            Invitation Maker
          </Link>{' '}
          or explore the{' '}
          <Link to="/tools/resume-builder" className="text-blue-700 underline">
            Resume Builder
          </Link>{' '}.
          You can also create invoices with the{' '}
          <Link to="/tools/invoice-maker" className="text-blue-700 underline">
            Invoice Maker
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
