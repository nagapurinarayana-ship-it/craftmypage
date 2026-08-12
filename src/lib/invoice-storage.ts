import type { Invoice } from './invoice'
import { calculateInvoice } from './invoice-calculator'
import { getCraftMyPageDb } from './database'

export async function saveInvoice(invoice: Invoice): Promise<void> {
  const db = await getCraftMyPageDb()
  await db.put('invoices', { ...invoice, updatedAt: Date.now() })
}
export async function getInvoice(id: string): Promise<Invoice | undefined> {
  const db = await getCraftMyPageDb()
  return db.get('invoices', id)
}
export async function getAllInvoices(): Promise<Invoice[]> {
  const db = await getCraftMyPageDb()
  return (await db.getAllFromIndex('invoices', 'by-updated')).reverse()
}
export async function deleteInvoice(id: string): Promise<void> {
  const db = await getCraftMyPageDb()
  await db.delete('invoices', id)
}
export async function deleteAllInvoices(): Promise<void> {
  const db = await getCraftMyPageDb()
  await db.clear('invoices')
}
export async function exportInvoiceJSON(invoice: Invoice): Promise<string> {
  return JSON.stringify(invoice, null, 2)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isValidInvoiceData(data: unknown): data is Invoice {
  if (!isRecord(data)) return false
  if (!isString(data.id) || !isRecord(data.business) || !isRecord(data.customer) || !isRecord(data.invoiceDetails)) return false
  if (!Array.isArray(data.lineItems) || !isRecord(data.settings) || !isRecord(data.paymentInfo)) return false
  if (!['professional', 'minimal', 'modern'].includes(data.template as string)) return false
  if (!isString(data.accentColor) || !/^#[0-9a-fA-F]{6}$/.test(data.accentColor)) return false

  const businessKeys = ['name', 'contactPerson', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country', 'website', 'taxId']
  const customerKeys = ['name', 'contactPerson', 'email', 'phone', 'billingAddress', 'billingCity', 'billingState', 'billingPostalCode', 'billingCountry', 'taxId', 'shippingAddress', 'shippingCity', 'shippingState', 'shippingPostalCode', 'shippingCountry']
  const invoiceKeys = ['invoiceNumber', 'issueDate', 'dueDate', 'referenceNumber', 'paymentTerms', 'title', 'projectPeriod']
  const paymentKeys = ['instructions', 'bankName', 'accountNumber', 'ifscCode', 'upiId', 'notes', 'termsAndConditions', 'thankYouMessage', 'signatureField']

  if (!businessKeys.every((key) => isString(data.business[key]))) return false
  if (!customerKeys.every((key) => isString(data.customer[key]))) return false
  if (!invoiceKeys.every((key) => isString(data.invoiceDetails[key]))) return false
  if (!paymentKeys.every((key) => isString(data.paymentInfo[key]))) return false
  if (!isString(data.business.logo) && data.business.logo !== null) return false
  if (!isString(data.invoiceDetails.currency) || !['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED', 'SGD', 'JPY'].includes(data.invoiceDetails.currency)) return false
  if (typeof data.customer.shippingAddressSame !== 'boolean') return false
  if (!isString(data.draftName) || !isFiniteNumber(data.createdAt) || !isFiniteNumber(data.updatedAt)) return false

  for (const item of data.lineItems) {
    if (!isRecord(item)) return false
    if (!isString(item.id) || !isString(item.description) || !isString(item.itemCode) || !isString(item.unit)) return false
    if (!isFiniteNumber(item.quantity) || item.quantity <= 0) return false
    if (!isFiniteNumber(item.unitPrice) || item.unitPrice < 0) return false
    if (!isFiniteNumber(item.discount) || item.discount < 0) return false
    if (!['fixed', 'percentage'].includes(item.discountType)) return false
    if (!isFiniteNumber(item.taxRate) || item.taxRate < 0) return false
  }

  return true
}

export async function importInvoiceJSON(jsonString: string): Promise<Invoice> {
  if (jsonString.length > 2_000_000) throw new Error('Invoice JSON is too large to import safely.')
  try {
    const data = JSON.parse(jsonString) as unknown
    if (!isValidInvoiceData(data)) throw new Error('Invalid invoice data structure')
    return { ...data, calculations: calculateInvoice(data) }
  } catch (error) {
    throw new Error(`Failed to import invoice: ${error instanceof Error ? error.message : String(error)}`)
  }
}
