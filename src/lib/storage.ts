import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { TemplateProject } from './template-engine'

interface ProjectDB extends DBSchema {
  projects: {
    key: string
    value: TemplateProject
    indexes: { 'by-updated': number }
  }
}

const DB_NAME = 'craftmypage'
const DB_VERSION = 1
const STORE = 'projects'

let dbPromise: Promise<IDBPDatabase<ProjectDB>> | null = null

function getDB(): Promise<IDBPDatabase<ProjectDB>> {
  const existing = dbPromise
  if (existing) return existing
  const created = openDB<ProjectDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('by-updated', 'updatedAt')
      }
    },
  })
  dbPromise = created
  return created
}

export async function saveProject(project: TemplateProject): Promise<void> {
  const db = await getDB()
  await db.put(STORE, project)
}

export async function getProject(id: string): Promise<TemplateProject | undefined> {
  const db = await getDB()
  return db.get(STORE, id)
}

export async function getAllProjects(): Promise<TemplateProject[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex(STORE, 'by-updated')
  return all.reverse()
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE, id)
}

export async function deleteAllProjects(): Promise<void> {
  const db = await getDB()
  await db.clear(STORE)
}

export function isStorageAvailable(): boolean {
  return typeof indexedDB !== 'undefined'
}