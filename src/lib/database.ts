import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { TemplateProject } from './template-engine'
import type { ResumeProject } from './resume'
import type { Invoice } from './invoice'

export interface CraftMyPageDB extends DBSchema {
  projects: { key: string; value: TemplateProject; indexes: { 'by-updated': number } }
  resumes: { key: string; value: ResumeProject; indexes: { 'by-updated': number } }
  invoices: { key: string; value: Invoice; indexes: { 'by-updated': number } }
}

const DB_NAME = 'craftmypage'
const DB_VERSION = 3
let dbPromise: Promise<IDBPDatabase<CraftMyPageDB>> | null = null

export function getCraftMyPageDb(): Promise<IDBPDatabase<CraftMyPageDB>> {
  if (dbPromise) return dbPromise
  dbPromise = openDB<CraftMyPageDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('projects')) {
        const store = db.createObjectStore('projects', { keyPath: 'id' })
        store.createIndex('by-updated', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('resumes')) {
        const store = db.createObjectStore('resumes', { keyPath: 'id' })
        store.createIndex('by-updated', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('invoices')) {
        const store = db.createObjectStore('invoices', { keyPath: 'id' })
        store.createIndex('by-updated', 'updatedAt')
      }
    },
  })
  return dbPromise
}
