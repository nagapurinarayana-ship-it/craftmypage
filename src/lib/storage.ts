import type { TemplateProject } from './template-engine'
import { getCraftMyPageDb } from './database'
import { sanitizeTemplate } from './template-validator'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isSafeImageData(value: unknown): value is string {
  return typeof value === 'string'
    && value.length <= 8_000_000
    && (/^data:image\/(jpeg|png|webp);base64,/.test(value) || /^https?:\/\//i.test(value))
}

function isValidTemplateProject(value: unknown): value is TemplateProject {
  if (!isRecord(value)) return false
  if (!isString(value.id) || value.id.length === 0) return false
  if (!isString(value.templateId) || value.templateId.length === 0) return false
  if (!isString(value.name) || value.name.length > 500) return false
  if (!isFiniteNumber(value.createdAt) || !isFiniteNumber(value.updatedAt)) return false
  if (!isRecord(value.values) || !isRecord(value.images) || !Array.isArray(value.elements)) return false

  const values = value.values
  if (!Object.values(values).every((entry) => isString(entry) && entry.length <= 10_000)) return false

  const images = value.images
  if (!Object.values(images).every(isSafeImageData)) return false

  const template = sanitizeTemplate({
    id: value.templateId,
    category: 'party',
    name: value.name,
    canvas: { width: 1500, height: 2100, size: 'portrait' },
    elements: value.elements,
  })
  return Boolean(template)
}

export async function saveProject(project: TemplateProject): Promise<void> {
  if (!isValidTemplateProject(project)) throw new Error('Invalid invitation project data')
  const db = await getCraftMyPageDb()
  await db.put('projects', project)
}

export async function getProject(id: string): Promise<TemplateProject | undefined> {
  const db = await getCraftMyPageDb()
  const project = await db.get('projects', id)
  if (!project) return undefined
  if (isValidTemplateProject(project)) return project
  if (isRecord(project) && isString(project.id)) await db.delete('projects', project.id)
  return undefined
}

export async function getAllProjects(): Promise<TemplateProject[]> {
  const db = await getCraftMyPageDb()
  const projects = await db.getAllFromIndex('projects', 'by-updated')
  const valid: TemplateProject[] = []
  for (const project of projects) {
    if (isValidTemplateProject(project)) valid.push(project)
    else if (isRecord(project) && isString(project.id)) await db.delete('projects', project.id)
  }
  return valid.reverse()
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getCraftMyPageDb()
  await db.delete('projects', id)
}

export async function deleteAllProjects(): Promise<void> {
  const db = await getCraftMyPageDb()
  await db.clear('projects')
}

export function isStorageAvailable(): boolean {
  return typeof indexedDB !== 'undefined'
}
