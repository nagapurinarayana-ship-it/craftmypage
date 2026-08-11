import DOMPurify from 'dompurify'
import { Template, sanitizeTemplate } from './template-validator'

export type TemplateProject = {
  id: string
  templateId: string
  name: string
  createdAt: number
  updatedAt: number
  values: Record<string, string>
  elements: Template['elements']
  images: Record<string, string>
}

function sanitizeText(value: string): string {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

export function createProject(
  template: Template,
  existing?: {
    id?: string
    name?: string
    values?: Record<string, string>
    images?: Record<string, string>
  }
): TemplateProject {
  const now = Date.now()
  const values: Record<string, string> = {}
  for (const el of template.elements) {
    if (el.type === 'text' && el.editable && el.key) {
      const existingValue = existing?.values?.[el.key]
      values[el.key] = sanitizeText(existingValue ?? el.default ?? '')
    }
  }

  return {
    id: existing?.id ?? crypto.randomUUID(),
    templateId: template.id,
    name: sanitizeText(existing?.name ?? template.name),
    createdAt: now,
    updatedAt: now,
    values,
    elements: template.elements,
    images: existing?.images ?? {},
  }
}

export function updateProjectValue(
  project: TemplateProject,
  key: string,
  value: string
): TemplateProject {
  return {
    ...project,
    values: {
      ...project.values,
      [key]: sanitizeText(value),
    },
    updatedAt: Date.now(),
  }
}

export function importTemplate(json: unknown): Template | null {
  return sanitizeTemplate(json)
}

export function isEditableTextElement(el: Template['elements'][number]): boolean {
  return el.type === 'text' && Boolean(el.editable)
}

export function setProjectImage(
  project: TemplateProject,
  key: string,
  dataUrl: string
): TemplateProject {
  return {
    ...project,
    images: {
      ...project.images,
      [key]: dataUrl,
    },
    updatedAt: Date.now(),
  }
}
