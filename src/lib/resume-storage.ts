import type { ResumeProject, ResumeData, ResumeSectionKey, ResumeTemplateId } from './resume'
import { getCraftMyPageDb } from './database'

const RESUME_TEMPLATES = new Set<ResumeTemplateId>([
  'ats-classic', 'ats-modern', 'software-engineer', 'experienced-professional',
  'student-fresher', 'minimal-one-page', 'two-page-professional', 'academic-cv',
])

const SECTIONS: ResumeSectionKey[] = [
  'contact', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'languages', 'custom',
]
void SECTIONS

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
function isString(value: unknown): value is string { return typeof value === 'string' }
function isFiniteNumber(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value) }
function isStringArray(value: unknown): value is string[] { return Array.isArray(value) && value.every(isString) }

function isEntryArray(value: unknown, keys: readonly string[]): value is Record<string, unknown>[] {
  return Array.isArray(value) && value.every((entry) => isRecord(entry) && keys.every((key) => isString(entry[key])))
}

function isValidResumeData(value: unknown): value is ResumeData {
  if (!isRecord(value)) return false
  const contact = value.contact
  const experience = value.experience
  if (!isRecord(contact)) return false
  const contactKeys = ['fullName', 'jobTitle', 'email', 'phone', 'location', 'website', 'linkedin']
  if (!contactKeys.every((key) => isString(contact[key]))) return false
  if (!isString(value.summary) || !isStringArray(value.skills)) return false
  if (!isEntryArray(experience, ['id', 'company', 'role', 'location', 'startDate', 'endDate', 'description'])) return false
  if (!isEntryArray(value.education, ['id', 'school', 'degree', 'field', 'startDate', 'endDate', 'description'])) return false
  if (!isEntryArray(value.projects, ['id', 'name', 'link', 'description'])) return false
  if (!isEntryArray(value.certifications, ['id', 'name', 'issuer', 'year'])) return false
  if (!isEntryArray(value.achievements, ['id', 'title', 'description'])) return false
  if (!isEntryArray(value.languages, ['id', 'name', 'proficiency'])) return false
  if (!isEntryArray(value.customSections, ['id', 'title', 'content'])) return false
  for (const entry of experience) if (typeof entry.current !== 'boolean') return false
  return true
}

function isValidResumeProject(value: unknown): value is ResumeProject {
  if (!isRecord(value)) return false
  const id = value.id
  const name = value.name
  const templateId = value.templateId
  const createdAt = value.createdAt
  const updatedAt = value.updatedAt
  const data = value.data
  return isString(id)
    && isString(name)
    && isString(templateId)
    && RESUME_TEMPLATES.has(templateId as ResumeTemplateId)
    && isFiniteNumber(createdAt)
    && isFiniteNumber(updatedAt)
    && isValidResumeData(data)
}

export async function saveResume(project: ResumeProject): Promise<void> {
  if (!isValidResumeProject(project)) throw new Error('Invalid resume data cannot be saved.')
  const db = await getCraftMyPageDb()
  await db.put('resumes', project)
}

export async function getResume(id: string): Promise<ResumeProject | undefined> {
  const db = await getCraftMyPageDb()
  const value = await db.get('resumes', id)
  if (isValidResumeProject(value)) return value
  await db.delete('resumes', id)
  return undefined
}

export async function getAllResumes(): Promise<ResumeProject[]> {
  const db = await getCraftMyPageDb()
  const values = await db.getAllFromIndex('resumes', 'by-updated')
  const valid: ResumeProject[] = []
  for (const value of values) {
    if (isValidResumeProject(value)) valid.push(value)
    else if (isRecord(value) && isString(value.id)) await db.delete('resumes', value.id)
  }
  return valid.reverse()
}

export async function deleteResume(id: string): Promise<void> { const db = await getCraftMyPageDb(); await db.delete('resumes', id) }
export async function deleteAllResumes(): Promise<void> { const db = await getCraftMyPageDb(); await db.clear('resumes') }
