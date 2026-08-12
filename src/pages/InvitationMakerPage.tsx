import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type Konva from 'konva'
import type { Template, TextElement, ImageElement } from '../lib/template-validator'
import { validateTemplate } from '../lib/template-validator'
import type { TemplateProject } from '../lib/template-engine'
import { createProject, updateProjectValue, setProjectImage } from '../lib/template-engine'
import { saveProject, getAllProjects, deleteProject, isStorageAvailable } from '../lib/storage'
import { downloadPng, downloadPdf, standardFilename } from '../lib/export'
import { useHistory } from '../lib/use-history'
import EditorCanvas from '../components/editor/EditorCanvas'
import EditorControls from '../components/editor/EditorControls'
import TemplateGallery from '../components/TemplateGallery'

const templateModules = import.meta.glob('../templates/*.json', { eager: true }) as Record<string, { default: unknown }>

function loadTemplates(): Template[] {
  const templates: Template[] = []
  for (const path of Object.keys(templateModules)) {
    if (path.endsWith('/example-template.json')) continue
    const result = validateTemplate(templateModules[path].default)
    if (result.valid) templates.push(templateModules[path].default as Template)
  }
  return templates
}

export default function InvitationMakerPage() {
  const templates = useMemo(loadTemplates, [])
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [savedProjects, setSavedProjects] = useState<TemplateProject[]>([])
  const [scale, setScale] = useState(0.4)
  const stageRef = useRef<Konva.Stage | null>(null)
  const history = useHistory<TemplateProject | null>(null)
  const project = history.state

  const refreshSaved = useCallback(() => {
    if (isStorageAvailable()) getAllProjects().then(setSavedProjects).catch(() => setSavedProjects([]))
  }, [])

  const openTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template)
    setSelectedKey(null)
    history.set(createProject(template))
  }, [history])

  useEffect(() => { refreshSaved() }, [refreshSaved])

  useEffect(() => {
    const requestedTemplateId = searchParams.get('template')
    if (!requestedTemplateId || selectedTemplate || project) return
    const template = templates.find((candidate) => candidate.id === requestedTemplateId)
    if (!template) return
    openTemplate(template)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('template')
    setSearchParams(nextParams, { replace: true })
  }, [openTemplate, project, searchParams, selectedTemplate, setSearchParams, templates])

  const handleUpdateValue = (key: string, value: string) => { if (project) history.set(updateProjectValue(project, key, value)) }
  const handleUpdateStyle = (key: string, patch: Partial<Pick<TextElement, 'fontSize' | 'fontFamily' | 'fill'>>) => {
    if (!project) return
    history.set({ ...project, elements: project.elements.map((el) => (el.key === key && el.type === 'text' ? { ...el, ...patch } : el)), updatedAt: Date.now() })
  }
  const handleUpdateElement = (key: string, patch: Partial<Pick<Template['elements'][number], 'x' | 'y' | 'width' | 'height' | 'rotation'>>) => {
    if (!project) return
    history.set({ ...project, elements: project.elements.map((el) => (el.key === key ? { ...el, ...patch } : el)), updatedAt: Date.now() })
  }
  const handlePhotoUpload = (key: string, file: File) => {
    if (!project) return
    const reader = new FileReader()
    reader.onload = () => { if (typeof reader.result === 'string') history.set(setProjectImage(project, key, reader.result)) }
    reader.readAsDataURL(file)
  }
  const handleSave = async () => { if (project) { await saveProject(project); refreshSaved() } }
  const handleDelete = async (id: string) => { await deleteProject(id); refreshSaved() }
  const handleDownloadPng = () => { if (stageRef.current && project) downloadPng(stageRef.current, standardFilename(project.name, 'invitation')) }
  const handleDownloadPdf = () => { if (stageRef.current && project) downloadPdf(stageRef.current, { filename: standardFilename(project.name, 'invitation'), title: project.name }) }

  const textElements = useMemo<TextElement[]>(() => (selectedTemplate ? selectedTemplate.elements.filter((el): el is TextElement => el.type === 'text') : []), [selectedTemplate])
  const imageElements = useMemo<ImageElement[]>(() => (selectedTemplate ? selectedTemplate.elements.filter((el): el is ImageElement => el.type === 'image') : []), [selectedTemplate])

  if (!selectedTemplate || !project) {
    return (
      <div className="cmp-tool-shell">
        <div className="mb-8 max-w-3xl"><span className="cmp-eyebrow">Invitation Maker</span><h1 className="cmp-tool-title mt-3">Create an invitation you are proud to send.</h1><p className="cmp-tool-subtitle">Start from a curated template, customize the details and export a finished invitation without an account or server upload.</p></div>
        <TemplateGallery templates={templates} onSelect={openTemplate} />
        {savedProjects.length > 0 && <section className="mt-12" aria-label="Saved projects"><div className="mb-5 flex items-end justify-between"><div><span className="cmp-eyebrow">Local drafts</span><h2 className="mt-2 text-2xl font-bold text-slate-900">Continue a saved invitation</h2></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{savedProjects.map((saved) => <div key={saved.id} className="cmp-surface flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="truncate font-semibold text-slate-900">{saved.name}</p><p className="mt-1 text-xs text-slate-500">Updated {new Date(saved.updatedAt).toLocaleDateString()}</p></div><div className="flex shrink-0 gap-2"><button type="button" className="cmp-secondary-btn px-3 py-2" onClick={() => { const template = templates.find((t) => t.id === saved.templateId); if (template) { setSelectedTemplate(template); setSelectedKey(null); history.set(saved) } }}>Open</button><button type="button" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100" onClick={() => handleDelete(saved.id)}>Delete</button></div></div>)}</div></section>}
      </div>
    )
  }

  return (
    <div className="cmp-tool-shell">
      <div className="cmp-tool-header sticky top-20 z-30">
        <div className="min-w-0"><button type="button" className="text-sm font-semibold text-indigo-700 hover:text-indigo-900" onClick={() => { setSelectedTemplate(null); setSelectedKey(null); history.set(null) }}>← Back to templates</button><h1 className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900">{selectedTemplate.name}</h1><p className="mt-1 text-xs text-slate-500">Changes are kept locally until you choose to save or export.</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" className="cmp-secondary-btn px-4 py-2 disabled:opacity-40" onClick={history.undo} disabled={!history.canUndo}>Undo</button><button type="button" className="cmp-secondary-btn px-4 py-2 disabled:opacity-40" onClick={history.redo} disabled={!history.canRedo}>Redo</button><button type="button" className="cmp-secondary-btn px-4 py-2" onClick={handleSave}>Save locally</button><button type="button" className="cmp-secondary-btn px-4 py-2" onClick={() => window.print()}>Print</button><button type="button" className="cmp-secondary-btn px-4 py-2" onClick={handleDownloadPng}>Download PNG</button><button type="button" className="cmp-primary-btn px-4 py-2" onClick={handleDownloadPdf}>Download PDF</button></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0"><div className="invitation-editor-print-root cmp-surface overflow-hidden p-3 sm:p-5"><EditorCanvas template={selectedTemplate} project={project} selectedKey={selectedKey} onSelect={setSelectedKey} onUpdateElement={handleUpdateElement} onStageReady={(stage) => { stageRef.current = stage }} scale={scale} /><div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 print:hidden"><label htmlFor="zoom" className="text-sm font-semibold text-slate-600">Zoom</label><input id="zoom" type="range" min={0.2} max={1} step={0.05} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-40 accent-indigo-600" /><span className="text-sm font-medium text-slate-500">{Math.round(scale * 100)}%</span></div></div></div>
        <aside className="space-y-4 print:hidden"><div className="cmp-surface p-4"><p className="text-sm font-semibold text-slate-900">Customize</p><p className="mt-1 text-xs text-slate-500">Select a text element on the canvas to edit it.</p><div className="mt-4"><EditorControls elements={textElements} project={project} selectedKey={selectedKey} onUpdateValue={handleUpdateValue} onUpdateStyle={handleUpdateStyle} /></div></div>{imageElements.length > 0 && <section className="cmp-surface p-4" aria-label="Photo upload"><p className="text-sm font-semibold text-slate-900">Photos</p><p className="mt-1 text-xs text-slate-500">Images are read locally in your browser.</p><div className="mt-4 space-y-3">{imageElements.map((el) => <label key={el.key} className="block text-sm"><span className="mb-1 block font-medium text-slate-700">{el.alt ?? 'Photo'}</span><input type="file" accept="image/jpeg,image/png,image/webp" className="w-full rounded-xl border border-slate-200 bg-white p-2 text-sm" onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePhotoUpload(el.key, file) }} /></label>)}</div></section>}</aside>
      </div>
      <style>{`@page { size: A4; margin: 0; } @media print { html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; } body * { visibility: hidden !important; } .invitation-editor-print-root, .invitation-editor-print-root * { visibility: visible !important; } .invitation-editor-print-root { position: absolute !important; inset: 0 !important; padding: 0 !important; border: 0 !important; box-shadow: none !important; background: #fff !important; } .invitation-editor-print-root canvas { display: block !important; margin: 0 auto !important; max-width: 100% !important; height: auto !important; } }`}</style>
    </div>
  )
}
