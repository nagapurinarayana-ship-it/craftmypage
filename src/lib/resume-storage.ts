import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { ResumeProject } from './resume'

interface ResumeDB extends DBSchema {
  projects: {
    key: string
    value: ResumeProject
    indexes: { 'by-updated': number }
  }
  resumes: {
    key: string
    value: ResumeProject
    indexes: { 'by-updated': number }
  }
}

const DB_NAME = 'craftmypage'
const DB_VERSION = 2
const STORE = 'resumes'

let dbPromise: Promise<IDBPDatabase<ResumeDB>> | null = null

function getDB(): Promise<IDBPDatabase<ResumeDB>> {
  const existing = dbPromise
  if (existing) return existing
  const created = openDB<ResumeDB>(DB_NAME, DB_VERSION, {
    upgrade(db: IDBPDatabase<ResumeDB>) {
      if (!db.objectStoreNames.contains('projects')) {
        const store = db.createObjectStore('projects', { keyPath: 'id' })
        store.createIndex('by-updated', 'updatedAt')
      }
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('by-updated', 'updatedAt')
      }
    },
  })
  dbPromise = created
  return created
}

export async function saveResume(project: ResumeProject): Promise<void> {
  const db = await getDB()
  await db.put(STORE, project)
}

export async function getResume(id: string): Promise<ResumeProject | undefined> {
  const db = await getDB()
  return db.get(STORE, id)
}

export async function getAllResumes(): Promise<ResumeProject[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex(STORE, 'by-updated')
  return all.reverse()
}

export async function deleteResume(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE, id)
}

export async function deleteAllResumes(): Promise<void> {
  const db = await getDB()
  await db.clear(STORE)
}