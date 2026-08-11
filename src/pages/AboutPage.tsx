import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">About CraftMyPage</h1>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Our mission</h2>
        <p>
          CraftMyPage is a completely free, privacy-first design website for creating invitations,
          resumes, cover letters, and printable designs — all directly in your browser.
        </p>
        <p>
          We believe beautiful, useful designs should not require an account, a subscription, or a
          watermark. Everything you create stays on your device.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">What makes us different</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Every template is genuinely free.</li>
          <li>Unlimited PDF and PNG downloads.</li>
          <li>No account or login required.</li>
          <li>No watermark or paid download gate.</li>
          <li>No server uploads — your data never leaves your device.</li>
          <li>Fast, focused editors instead of a complicated all-in-one tool.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p>
          Choose a template, customize the text, colors, and layout, then download a high-quality
          PDF or image. Your project can be saved locally in your browser and reopened anytime.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Privacy promise</h2>
        <p>
          We do not collect your personal information, store your documents, or upload your photos.
          All processing happens locally in your browser. See our{' '}
          <Link to="/privacy" className="text-blue-700 underline">
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
      </section>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Get started</h2>
        <p>
          Create your first design with the{' '}
          <Link to="/invitation-maker" className="text-blue-700 underline">
            Invitation Maker
          </Link>{' '}
          or the{' '}
          <Link to="/resume-builder" className="text-blue-700 underline">
            Resume Builder
          </Link>
          .
        </p>
      </section>
    </div>
  )
}