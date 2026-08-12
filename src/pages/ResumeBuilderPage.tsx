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
    setProject({ id: createId('resume'), name: template.name, templateId, data: createEmptyResumeData(), createdAt: now, updatedAt: now })
    setShowPreview(false)
  }

  const updateData = (data: ResumeData) => {
    if (project) setProject({ ...project, data, updatedAt: Date.now() })
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
    downloadTextFile(resumeToPlainText(project.data), `${project.data.contact.fullName || 'resume'}.txt`)
  }

  const handleOpen = (saved: ResumeProject) => {
    setProject(JSON.parse(JSON.stringify(saved)))
    setShowPreview(false)
  }

  if (!project) {
    return (
      <div className="cmp-tool-shell">
        <div className="mb-8 max-w-3xl">
          <span className="cmp-eyebrow">Resume Builder</span>
          <h1 className="cmp-tool-title mt-3">Build a resume that looks polished and stays practical.</h1>
          <p className="cmp-tool-subtitle">
            Choose a focused template, add your experience and projects, then export a ready-to-share PDF. Your resume data stays in your browser.
          </p>
        </div>

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Choose your template</h2>
              <p className="mt-1 text-sm text-slate-500">Start with the structure that fits your career stage.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className="group cmp-card text-left"
                onClick={() => handleNew(template.id)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-700">
                  CV
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-indigo-700">{template.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{template.description}</p>
                <span className="mt-5 text-sm font-semibold text-indigo-600">Use template →</span>
              </button>
            ))}
          </div>
        </section>

        {savedResumes.length > 0 && (
          <section className="mt-12" aria-label="Saved resumes">
            <span className="cmp-eyebrow">Local drafts</span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Continue a saved resume</h2>
            <div className="mt-5 space-y-3">
              {savedResumes.map((saved) => (
                <div key={saved.id} className="cmp-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{saved.data.contact.fullName || 'Untitled resume'}</p>
                    <p className="mt-1 text-xs text-slate-500">{saved.name} · Updated {new Date(saved.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="cmp-secondary-btn px-4 py-2" onClick={() => handleOpen(saved)}>Open</button>
                    <button type="button" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100" onClick={() => handleDelete(saved.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="cmp-tool-shell">
      <div className="cmp-tool-header sticky top-20 z-30">
        <div>
          <button type="button" className="text-sm font-semibold text-indigo-700 hover:text-indigo-900" onClick={() => setProject(null)}>
            ← Back to templates
          </button>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{project.name}</h1>
          <p className="mt-1 text-xs text-slate-500">Your resume content stays local until you export it.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="cmp-secondary-btn px-4 py-2" onClick={() => setShowPreview(!showPreview)}>{showPreview ? 'Edit' : 'Preview'}</button>
          <button type="button" className="cmp-secondary-btn px-4 py-2" onClick={handleSave}>Save locally</button>
          <button type="button" className="cmp-secondary-btn px-4 py-2" onClick={handleDownloadTxt}>Download TXT</button>
          <button type="button" className="cmp-primary-btn px-4 py-2" onClick={handleDownloadPdf} disabled={exporting}>{exporting ? 'Exporting...' : 'Download PDF'}</button>
        </div>
      </div>

      {showPreview ? (
        <div className="mx-auto max-w-4xl"><ResumePreview data={project.data} /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="cmp-surface max-h-[80vh] overflow-y-auto p-5 sm:p-6">
            <ResumeForm data={project.data} onChange={updateData} />
          </div>
          <div className="hidden max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-sm lg:block">
            <ResumePreview data={project.data} />
          </div>
        </div>
      )}
    </div>
  )
}
