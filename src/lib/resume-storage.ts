import type { ResumeProject } from './resume'
import { getCraftMyPageDb } from './database'

export async function saveResume(project: ResumeProject): Promise<void> {
  const db = await getCraftMyPageDb()
  await db.put('resumes', project)
}
export async function getResume(id: string): Promise<ResumeProject | undefined> {
  const db = await getCraftMyPageDb()
  return db.get('resumes', id)
}
export async function getAllResumes(): Promise<ResumeProject[]> {
  const db = await getCraftMyPageDb()
  return (await db.getAllFromIndex('resumes', 'by-updated')).reverse()
}
export async function deleteResume(id: string): Promise<void> {
  const db = await getCraftMyPageDb()
  await db.delete('resumes', id)
}
export async function deleteAllResumes(): Promise<void> {
  const db = await getCraftMyPageDb()
  await db.clear('resumes')
}
