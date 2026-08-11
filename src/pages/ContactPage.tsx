import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-gray-600">
        Have a question, suggestion, or feedback? We would love to hear from you.
      </p>

      {submitted ? (
        <div className="mt-6 border rounded-lg bg-green-50 p-4" role="status">
          <p className="font-medium text-green-800">Thank you for your message!</p>
          <p className="mt-1 text-green-700">
            This is a demo form. In production, your message would be sent without storing any
            personal data on a server.
          </p>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="block mb-1 text-gray-700">Your name</span>
            <input
              type="text"
              name="name"
              className="w-full border rounded px-2 py-1.5 text-gray-900"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="block mb-1 text-gray-700">Your email</span>
            <input
              type="email"
              name="email"
              className="w-full border rounded px-2 py-1.5 text-gray-900"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="block mb-1 text-gray-700">Message</span>
            <textarea
              name="message"
              rows={5}
              className="w-full border rounded px-2 py-1.5 text-gray-900"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Send message
          </button>
        </form>
      )}
    </div>
  )
}