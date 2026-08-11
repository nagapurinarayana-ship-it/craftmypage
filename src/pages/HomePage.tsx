import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Create free invitations, resumes and printable designs</h1>
      <p className="mt-2">
        Customize original templates and download high-quality PDFs or images. No account,
        no watermark and no file uploads.
      </p>
      <div className="mt-6">
        <Link
          to="/invitation-maker"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded mr-3"
        >
          Create an Invitation
        </Link>
        <Link to="/resume-builder" className="inline-block border px-4 py-2 rounded">
          Build a Resume
        </Link>
      </div>
    </div>
  )
}