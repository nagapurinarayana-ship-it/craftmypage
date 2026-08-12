import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

const templateModules = import.meta.glob('../templates/*.json', { eager: true }) as Record<
  string,
  { default: unknown }
>

function loadTemplates(): Template[] {
  const templates: Template[] = []
  for (const path of Object.keys(templateModules)) {
    const result = validateTemplate(templateModules[path].default)
    if (result.valid) {
      templates.push(templateModules[path].default as Template)
    }
  }
  return templates
}

export default function InvitationMakerPage() {
  const templates = useMemo(loadTemplates, [])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [savedProjects, setSavedProjects] = useState<TemplateProject[]>([])
  const [scale, setScale] = useState(0.4)
  const stageRef = useRef<Konva.Stage | null>(null)

  const history = useHistory<TemplateProject | null>(null)
  const project = history.state

  const refreshSaved = useCallback(() => {
    if (isStorageAvailable()) {
      getAllProjects().then(setSavedProjects).catch(() => setSavedProjects([]))
    }
  }, [])

  useEffect(() => {
    refreshSaved()
  }, [refreshSaved])

  const handleSelectTemplate = (template: Template) => {
    const newProject = createProject(template)
    setSelectedTemplate(template)
    setSelectedKey(null)
    history.set(newProject)
  }

  const handleUpdateValue = (key: string, value: string) => {
    if (!project) return
    history.set(updateProjectValue(project, key, value))
  }

  const handleUpdateStyle = (
    key: string,
    patch: Partial<Pick<TextElement, 'fontSize' | 'fontFamily' | 'fill'>>
  ) => {
    if (!project) return
    history.set({
      ...project,
      elements: project.elements.map((el) =>
        el.key === key && el.type === 'text' ? { ...el, ...patch } : el
      ),
      updatedAt: Date.now(),
    })
  }

  const handleUpdateElement = (
    key: string,
    patch: Partial<Pick<Template['elements'][number], 'x' | 'y' | 'width' | 'height' | 'rotation'>>
  ) => {
    if (!project) return
    history.set({
      ...project,
      elements: project.elements.map((el) => (el.key === key ? { ...el, ...patch } : el)),
      updatedAt: Date.now(),
    })
  }

  const handlePhotoUpload = (key: string, file: File) => {
    if (!project) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        history.set(setProjectImage(project, key, reader.result))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!project) return
    await saveProject(project)
    refreshSaved()
  }

  const handleDelete = async (id: string) => {
    await deleteProject(id)
    refreshSaved()
  }

  const handleDownloadPng = () => {
    if (!stageRef.current || !project) return
    downloadPng(stageRef.current, standardFilename(project.name, 'invitation'))
  }

  const handleDownloadPdf = () => {
    if (!stageRef.current || !project) return
    downloadPdf(stageRef.current, {
      filename: standardFilename(project.name, 'invitation'),
      title: project.name,
    })
  }

  const handleStageReady = (stage: Konva.Stage) => {
    stageRef.current = stage
  }

  const textElements = useMemo<TextElement[]>(
    () => (selectedTemplate ? selectedTemplate.elements.filter((el): el is TextElement => el.type === 'text') : []),
    [selectedTemplate]
  )

  const imageElements = useMemo<ImageElement[]>(
    () => (selectedTemplate ? selectedTemplate.elements.filter((el): el is ImageElement => el.type === 'image') : []),
    [selectedTemplate]
  )

  if (!selectedTemplate || !project) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Invitation Maker</h1>
        <TemplateGallery templates={templates} onSelect={handleSelectTemplate} />
        {savedProjects.length > 0 && (
          <section className="mt-10" aria-label="Saved projects">
            <h2 className="text-xl font-semibold mb-4">Your saved projects</h2>
            <ul className="space-y-2">
              {savedProjects.map((saved) => (
                <li key={saved.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <p className="font-medium">{saved.name}</p>
                    <p className="text-sm text-gray-600">
                      Updated {new Date(saved.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="border rounded px-3 py-1 text-sm hover:bg-gray-50"
                      onClick={() => {
                        const template = templates.find((t) => t.id === saved.templateId)
                        if (template) {
                          setSelectedTemplate(template)
                          setSelectedKey(null)
                          history.set(saved)
                        }
                      }}
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            type="button"
            className="text-sm text-blue-700 hover:underline"
            onClick={() => {
              setSelectedTemplate(null)
              setSelectedKey(null)
              history.set(null)
            }}
          >
            ← Back to templates
          </button>
          <h1 className="text-2xl font-bold mt-1">{selectedTemplate.name}</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="border rounded px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
            onClick={history.undo}
            disabled={!history.canUndo}
          >
            Undo
          </button>
          <button
            type="button"
            className="border rounded px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
            onClick={history.redo}
            disabled={!history.canRedo}
          >
            Redo
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
            onClick={handleDownloadPng}
          >
            Download PNG
          </button>
          <button
            type="button"
            className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm hover:bg-blue-700"
            onClick={handleDownloadPdf}
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <EditorCanvas
            template={selectedTemplate}
            project={project}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            onUpdateElement={handleUpdateElement}
            onStageReady={handleStageReady}
            scale={scale}
          />
          <div className="mt-3 flex items-center gap-3">
            <label htmlFor="zoom" className="text-sm text-gray-600">
              Zoom
            </label>
            <input
              id="zoom"
              type="range"
              min={0.2}
              max={1}
              step={0.05}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-40"
            />
            <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
          </div>
        </div>
        <div className="w-full lg:w-80 space-y-4">
          <EditorControls
            elements={textElements}
            project={project}
            selectedKey={selectedKey}
            onUpdateValue={handleUpdateValue}
            onUpdateStyle={handleUpdateStyle}
          />
          {imageElements.length > 0 && (
            <section className="border rounded-lg bg-white p-4" aria-label="Photo upload">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Photos</h3>
              <div className="space-y-3">
                {imageElements.map((el) => (
                  <label key={el.key} className="block text-sm">
                    <span className="block mb-1 text-gray-700">{el.alt ?? 'Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handlePhotoUpload(el.key, file)
                      }}
                    />
                  </label>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
