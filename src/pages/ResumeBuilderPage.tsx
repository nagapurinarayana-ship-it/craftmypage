import { useCallback, useEffect, useState } from 'react'
import type { ResumeData, ResumeProject, ResumeTemplateId } from '../lib/resume'
import { createEmptyResumeData, createId } from '../lib/resume'
import { saveResume, getAllResumes, deleteResume } from '../lib/resume-storage'
import { exportResumeToPdf, resumeToPlainText, downloadTextFile } from '../lib/resume-export'
import ResumeForm from '../components/resume/ResumeForm'
import ResumePreview from '../components/resume/ResumePreview'

const TEMPLATES: { id: ResumeTemplateId; name: string; description: string }[] = [
  { id: 'ats-classic', name: 'ATS Classic', description: 'Clean, single-column, ATS-friendly' },
  { id: 'ats-modern', name: 'ATS Modern', description: 'Modern layout with ATS-safe structure' },
  { id: 'software-engineer', name: 'Software Engineer', description: 'Optimized for tech roles' },
  { id: 'experienced-professional', name: 'Experienced Professional', description: 'For senior professionals' },
  { id: 'student-fresher', name: 'Student / Fresher', description: 'Great for graduates' },
  { id: 'minimal-one-page', name: 'Minimal One-Page', description: 'Concise single page' },
  { id: 'two-page-professional', name: 'Two-Page Professional', description: 'Detailed two-page layout' },
  { id: 'academic-cv', name: 'Academic CV', description: 'For research and academia' },
]

export default function ResumeBuilderPage() {
  const [project, setProject] = useState<ResumeProject | null>(null)
  const [savedResumes, setSavedResumes] = useState<ResumeProject[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [exporting, setExporting] = useState(false)

  const refreshSaved = useCallback(() => {
    getAllResumes().then(setSavedResumes).catch(() => setSavedResumes([]))
  }, [])

  useEffect(() => {
    refreshSaved()
  }, [refreshSaved])

  const handleNew = (templateId: ResumeTemplateId) => {
    const template = TEMPLATES.find((t) => t.id === templateId)!
    const now = Date.now()
    setProject({
      id: createId('resume'),
      name: template.name,
      templateId,
      data: createEmptyResumeData(),
      createdAt: now,
      updatedAt: now,
    })
    setShowPreview(false)
  }

  const updateData = (data: ResumeData) => {
    if (!project) return
    setProject({ ...project, data, updatedAt: Date.now() })
  }

  const handleSave = async () => {
    if (!project) return
    await saveResume(project)
    refreshSaved()
  }

  const handleDelete = async (id: string) => {
    await deleteResume(id)
    refreshSaved()
  }

  const handleDownloadPdf = async () => {
    if (!project) return
    setExporting(true)
    try {
      const blob = await exportResumeToPdf(project.data)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.data.contact.fullName || 'resume'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadTxt = () => {
    if (!project) return
    const text = resumeToPlainText(project.data)
    downloadTextFile(text, `${project.data.contact.fullName || 'resume'}.txt`)
  }

  const handleOpen = (saved: ResumeProject) => {
    setProject(JSON.parse(JSON.stringify(saved)))
    setShowPreview(false)
  }

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>
        <p className="text-gray-600 mb-6">
          Choose a template to get started. Your data stays in your browser.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              className="text-left border rounded-lg p-4 hover:shadow-md transition-shadow"
              onClick={() => handleNew(template.id)}
            >
              <h2 className="font-semibold">{template.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </button>
          ))}
        </div>

        {savedResumes.length > 0 && (
          <section className="mt-10" aria-label="Saved resumes">
            <h2 className="text-xl font-semibold mb-4">Your saved resumes</h2>
            <ul className="space-y-2">
              {savedResumes.map((saved) => (
                <li key={saved.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <p className="font-medium">{saved.data.contact.fullName || 'Untitled resume'}</p>
                    <p className="text-sm text-gray-600">
                      {saved.name} — Updated {new Date(saved.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="border rounded px-3 py-1 text-sm hover:bg-gray-50"
                      onClick={() => handleOpen(saved)}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="border rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(saved.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            type="button"
            className="text-sm text-blue-700 hover:underline"
            onClick={() => setProject(null)}
          >
            ← Back to templates
          </button>
          <h1 className="text-2xl font-bold mt-1">{project.name}</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="border rounded px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            className="border rounded px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={handleSave}
          >
            Save locally
          </button>
          <button
            type="button"
            className="border rounded px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={handleDownloadTxt}
          >
            Download TXT
          </button>
          <button
            type="button"
            className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm hover:bg-blue-700 disabled:opacity-50"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {showPreview ? (
        <ResumePreview data={project.data} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="max-h-[80vh] overflow-y-auto pr-2">
            <ResumeForm data={project.data} onChange={updateData} />
          </div>
          <div className="hidden lg:block max-h-[80vh] overflow-y-auto border rounded-lg p-4 bg-gray-50">
            <ResumePreview data={project.data} />
          </div>
        </div>
      )}
    </div>
  )
}