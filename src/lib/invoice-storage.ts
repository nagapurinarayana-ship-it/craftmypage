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
function isValidISODate(value: unknown): value is string {
  if (!isString(value) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function isValidInvoiceData(data: unknown): data is Invoice {
  if (!isRecord(data)) return false
  if (!isString(data.id) || !isRecord(data.business) || !isRecord(data.customer) || !isRecord(data.invoiceDetails)) return false
  if (!Array.isArray(data.lineItems) || !isRecord(data.settings) || !isRecord(data.paymentInfo)) return false
  if (!['professional', 'minimal', 'modern'].includes(String(data.template))) return false
  if (!isString(data.accentColor) || !/^#[0-9a-fA-F]{6}$/.test(data.accentColor)) return false

  const business = data.business
  const customer = data.customer
  const invoiceDetails = data.invoiceDetails
  const paymentInfo = data.paymentInfo
  const settings = data.settings

  const businessKeys = ['name', 'contactPerson', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country', 'website', 'taxId']
  const customerKeys = ['name', 'contactPerson', 'email', 'phone', 'billingAddress', 'billingCity', 'billingState', 'billingPostalCode', 'billingCountry', 'taxId', 'shippingAddress', 'shippingCity', 'shippingState', 'shippingPostalCode', 'shippingCountry']
  const invoiceKeys = ['invoiceNumber', 'issueDate', 'dueDate', 'referenceNumber', 'paymentTerms', 'title', 'projectPeriod']
  const paymentKeys = ['instructions', 'bankName', 'accountNumber', 'ifscCode', 'upiId', 'notes', 'termsAndConditions', 'thankYouMessage', 'signatureField']

  if (!businessKeys.every((key) => isString(business[key]))) return false
  if (!customerKeys.every((key) => isString(customer[key]))) return false
  if (!invoiceKeys.every((key) => isString(invoiceDetails[key]))) return false
  if (!paymentKeys.every((key) => isString(paymentInfo[key]))) return false
  if (!isString(business.logo) && business.logo !== null) return false
  if (!isString(invoiceDetails.currency) || !['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED', 'SGD', 'JPY'].includes(invoiceDetails.currency)) return false
  if (typeof customer.shippingAddressSame !== 'boolean') return false
  if (!isString(data.draftName) || !isFiniteNumber(data.createdAt) || !isFiniteNumber(data.updatedAt)) return false
  if (!isValidISODate(invoiceDetails.issueDate) || !isValidISODate(invoiceDetails.dueDate) || invoiceDetails.dueDate < invoiceDetails.issueDate) return false
  if (!['none', 'simple', 'india-gst'].includes(String(settings.taxMode))) return false

  for (const item of data.lineItems) {
    if (!isRecord(item)) return false
    if (!isString(item.id) || !isString(item.description) || !isString(item.itemCode) || !isString(item.unit)) return false
    if (!isFiniteNumber(item.quantity) || item.quantity <= 0) return false
    if (!isFiniteNumber(item.unitPrice) || item.unitPrice < 0) return false
    if (!isFiniteNumber(item.discount) || item.discount < 0) return false
    if (!['fixed', 'percentage'].includes(String(item.discountType))) return false
    if (item.discountType === 'percentage' && item.discount > 100) return false
    if (item.discountType === 'fixed' && item.discount > item.quantity * item.unitPrice) return false
    if (!isFiniteNumber(item.taxRate) || item.taxRate < 0 || item.taxRate > 100) return false
  }

  if (settings.taxMode === 'india-gst') {
    if (!isRecord(settings.gst)) return false
    const gst = settings.gst
    if (!['intra-state', 'inter-state'].includes(String(gst.purpose))) return false
    if (!isString(gst.supplierGSTIN) || !isString(gst.customerGSTIN) || !isString(gst.placeOfSupply)) return false
    if (![gst.cgstRate, gst.sgstRate, gst.igstRate].every((rate) => isFiniteNumber(rate) && rate >= 0 && rate <= 100)) return false
    if (gst.purpose === 'intra-state' && gst.igstRate !== 0) return false
    if (gst.purpose === 'inter-state' && (gst.cgstRate !== 0 || gst.sgstRate !== 0)) return false
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