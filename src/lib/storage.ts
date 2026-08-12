import type { TemplateProject } from './template-engine'
import { getCraftMyPageDb } from './database'

export async function saveProject(project: TemplateProject): Promise<void> {
  const db = await getCraftMyPageDb()
  await db.put('projects', project)
}
export async function getProject(id: string): Promise<TemplateProject | undefined> {
  const db = await getCraftMyPageDb()
  return db.get('projects', id)
}
export async function getAllProjects(): Promise<TemplateProject[]> {
  const db = await getCraftMyPageDb()
  return (await db.getAllFromIndex('projects', 'by-updated')).reverse()
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
