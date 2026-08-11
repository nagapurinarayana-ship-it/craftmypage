import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Invoice } from './invoice'

interface InvoiceDB extends DBSchema {
  invoices: {
    key: string
    value: Invoice
    indexes: { 'by-updated': number }
  }
}

const DB_NAME = 'craftmypage'
const DB_VERSION = 1
const STORE = 'invoices'

let dbPromise: Promise<IDBPDatabase<InvoiceDB>> | null = null

function getDB(): Promise<IDBPDatabase<InvoiceDB>> {
  const existing = dbPromise
  if (existing) return existing
  const created = openDB<InvoiceDB>(DB_NAME, DB_VERSION, {
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

export async function saveInvoice(invoice: Invoice): Promise<void> {
  const db = await getDB()
  invoice.updatedAt = Date.now()
  await db.put(STORE, invoice)
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  const db = await getDB()
  return db.get(STORE, id)
}

export async function getAllInvoices(): Promise<Invoice[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex(STORE, 'by-updated')
  return all.reverse() // Most recent first
}

export async function deleteInvoice(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE, id)
}

export async function deleteAllInvoices(): Promise<void> {
  const db = await getDB()
  await db.clear(STORE)
}

export async function exportInvoiceJSON(invoice: Invoice): Promise<string> {
  return JSON.stringify(invoice, null, 2)
}

export async function importInvoiceJSON(jsonString: string): Promise<Invoice> {
  try {
    const data = JSON.parse(jsonString) as unknown
    if (!isValidInvoiceData(data)) {
      throw new Error('Invalid invoice data structure')
    }
    return data as Invoice
  } catch (error) {
    throw new Error(`Failed to import invoice: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Minimal validation for imported JSON
function isValidInvoiceData(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const obj = data as Record<string, unknown>

  return (
    typeof obj.id === 'string' &&
    typeof obj.business === 'object' &&
    typeof obj.customer === 'object' &&
    typeof obj.invoiceDetails === 'object' &&
    Array.isArray(obj.lineItems) &&
    typeof obj.settings === 'object' &&
    typeof obj.calculations === 'object'
  )
}
