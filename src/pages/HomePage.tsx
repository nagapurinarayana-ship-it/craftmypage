import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Create free invitations, resumes, invoices and printable designs</h1>
      <p className="mt-2">
        Customize original templates and download high-quality PDFs or images. No account,
        no watermark and no file uploads.
      </p>
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/tools/invitation-maker"
            className="block p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center font-medium"
          >
            Create an Invitation
          </Link>
          <Link
            to="/tools/invoice-maker"
            className="block p-4 bg-green-600 text-white rounded-md hover:bg-green-700 text-center font-medium"
          >
            Create an Invoice
          </Link>
          <Link
            to="/tools/resume-builder"
            className="block p-4 border rounded-md hover:bg-gray-50 text-center font-medium"
          >
            Build a Resume
          </Link>
        </div>
      </div>
    </div>
  )
}