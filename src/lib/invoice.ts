// Invoice data types and utilities

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'AED' | 'SGD' | 'JPY'

export type TaxMode = 'none' | 'simple' | 'india-gst'

export type TaxType = 'no-tax' | 'vat' | 'sales-tax' | 'tax'

export type GSTPurpose = 'intra-state' | 'inter-state'

export interface BusinessDetails {
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  website: string
  taxId: string
  logo: string | null
}

export interface CustomerDetails {
  name: string
  contactPerson: string
  email: string
  phone: string
  billingAddress: string
  billingCity: string
  billingState: string
  billingPostalCode: string
  billingCountry: string
  taxId: string
  shippingAddressSame: boolean
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
}

export interface LineItem {
  id: string
  description: string
  itemCode: string
  quantity: number
  unit: string
  unitPrice: number
  discount: number
  discountType: 'fixed' | 'percentage'
  taxRate: number
}

export interface InvoiceDetails {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  referenceNumber: string
  currency: Currency
  paymentTerms: string
  title: string
  projectPeriod: string
}

export interface SimpleTaxSettings {
  taxType: TaxType
  taxLabel: string
  inclusive: boolean
}

export interface GSTSettings {
  supplierGSTIN: string
  customerGSTIN: string
  placeOfSupply: string
  purpose: GSTPurpose
  cgstRate: number
  sgstRate: number
  igstRate: number
}

export interface InvoiceSettings {
  taxMode: TaxMode
  simpleTax?: SimpleTaxSettings
  gst?: GSTSettings
}

export interface PaymentInfo {
  instructions: string
  bankName: string
  accountNumber: string
  ifscCode: string
  upiId: string
  notes: string
  termsAndConditions: string
  thankYouMessage: string
  signatureField: string
}

export interface InvoiceCalculations {
  subtotal: number
  discountAmount: number
  discountedSubtotal: number
  shippingCharge: number
  adjustment: number
  subtotalBeforeTax: number
  taxAmount: number
  taxBreakdown: Record<string, number>
  amountPaid: number
  balanceDue: number
  grandTotal: number
}

export interface Invoice {
  id: string
  business: BusinessDetails
  customer: CustomerDetails
  invoiceDetails: InvoiceDetails
  lineItems: LineItem[]
  settings: InvoiceSettings
  paymentInfo: PaymentInfo
  template: 'professional' | 'minimal' | 'modern'
  accentColor: string
  calculations: InvoiceCalculations
  createdAt: number
  updatedAt: number
  draftName: string
}

export function createEmptyInvoice(id: string): Invoice {
  return {
    id,
    business: {
      name: '', contactPerson: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '', country: '', website: '', taxId: '', logo: null,
    },
    customer: {
      name: '', contactPerson: '', email: '', phone: '', billingAddress: '', billingCity: '', billingState: '', billingPostalCode: '', billingCountry: '', taxId: '', shippingAddressSame: true, shippingAddress: '', shippingCity: '', shippingState: '', shippingPostalCode: '', shippingCountry: '',
    },
    invoiceDetails: {
      invoiceNumber: generateDefaultInvoiceNumber(),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      referenceNumber: '', currency: 'INR', paymentTerms: 'Net 30', title: 'Invoice', projectPeriod: '',
    },
    lineItems: [{ id: generateId(), description: '', itemCode: '', unit: 'pcs', quantity: 1, unitPrice: 0, discount: 0, discountType: 'fixed', taxRate: 0 }],
    settings: { taxMode: 'none' },
    paymentInfo: { instructions: '', bankName: '', accountNumber: '', ifscCode: '', upiId: '', notes: '', termsAndConditions: '', thankYouMessage: '', signatureField: '' },
    template: 'professional', accentColor: '#2563eb',
    calculations: { subtotal: 0, discountAmount: 0, discountedSubtotal: 0, shippingCharge: 0, adjustment: 0, subtotalBeforeTax: 0, taxAmount: 0, taxBreakdown: {}, amountPaid: 0, balanceDue: 0, grandTotal: 0 },
    createdAt: Date.now(), updatedAt: Date.now(), draftName: 'Untitled Invoice',
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateDefaultInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return `INV-${year}-${month}-${random}`
}

export function isValidInvoice(invoice: Invoice): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const { invoiceDetails } = invoice

  if (!invoice.business.name.trim()) errors.push('Business name is required')
  if (!invoice.customer.name.trim()) errors.push('Customer name is required')
  if (!invoiceDetails.invoiceNumber.trim()) errors.push('Invoice number is required')
  if (!isValidISODate(invoiceDetails.issueDate)) errors.push('Issue date must be valid YYYY-MM-DD format')
  if (!isValidISODate(invoiceDetails.dueDate)) errors.push('Due date must be valid YYYY-MM-DD format')
  if (isValidISODate(invoiceDetails.issueDate) && isValidISODate(invoiceDetails.dueDate) && invoiceDetails.dueDate < invoiceDetails.issueDate) {
    errors.push('Due date cannot be earlier than the issue date')
  }
  if (invoice.lineItems.length === 0) errors.push('At least one line item is required')

  for (const item of invoice.lineItems) {
    if (!item.description.trim()) errors.push('Line item must have a description')
    if (!isFinite(item.quantity) || item.quantity <= 0) errors.push('Line item quantity must be a positive number')
    if (!isFinite(item.unitPrice) || item.unitPrice < 0) errors.push('Line item unit price must be non-negative')
    if (!isFinite(item.discount) || item.discount < 0) errors.push('Line item discount must be non-negative')
    if (item.discountType === 'percentage' && item.discount > 100) errors.push('Percentage discount cannot exceed 100%')
    if (item.discountType === 'fixed' && isFinite(item.quantity) && isFinite(item.unitPrice) && item.discount > item.quantity * item.unitPrice) errors.push('Fixed discount cannot exceed the line-item subtotal')
    if (!isFinite(item.taxRate) || item.taxRate < 0 || item.taxRate > 100) errors.push('Line item tax rate must be between 0% and 100%')
  }

  if (invoice.settings.taxMode === 'simple' && invoice.settings.simpleTax) {
    if (!isFinite(invoice.settings.simpleTax.inclusive ? 0 : 0)) errors.push('Invalid simple tax configuration')
  }

  if (invoice.settings.taxMode === 'india-gst') {
    const gst = invoice.settings.gst
    if (!gst) {
      errors.push('GST settings are required when India GST mode is selected')
    } else {
      const rates = [gst.cgstRate, gst.sgstRate, gst.igstRate]
      if (rates.some((rate) => !isFinite(rate) || rate < 0 || rate > 100)) errors.push('GST rates must be between 0% and 100%')
      if (gst.purpose === 'intra-state' && gst.igstRate !== 0) errors.push('IGST must be 0 for an intra-state invoice')
      if (gst.purpose === 'inter-state' && (gst.cgstRate !== 0 || gst.sgstRate !== 0)) errors.push('CGST and SGST must be 0 for an inter-state invoice')
    }
  }

  return { valid: errors.length === 0, errors: [...new Set(errors)] }
}

export function isValidISODate(dateString: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

const CURRENCY_CONFIG: Record<Currency, { symbol: string; name: string; decimalPlaces: number }> = {
  INR: { symbol: '₹', name: 'Indian Rupee', decimalPlaces: 2 },
  USD: { symbol: '$', name: 'US Dollar', decimalPlaces: 2 },
  EUR: { symbol: '€', name: 'Euro', decimalPlaces: 2 },
  GBP: { symbol: '£', name: 'British Pound', decimalPlaces: 2 },
  CAD: { symbol: '$', name: 'Canadian Dollar', decimalPlaces: 2 },
  AUD: { symbol: '$', name: 'Australian Dollar', decimalPlaces: 2 },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', decimalPlaces: 2 },
  SGD: { symbol: '$', name: 'Singapore Dollar', decimalPlaces: 2 },
  JPY: { symbol: '¥', name: 'Japanese Yen', decimalPlaces: 0 },
}

export function getCurrencyConfig(currency: Currency) {
  return CURRENCY_CONFIG[currency]
}

export function formatCurrency(amount: number, currency: Currency): string {
  const config = getCurrencyConfig(currency)
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency, minimumFractionDigits: config.decimalPlaces, maximumFractionDigits: config.decimalPlaces,
  }).format(amount)
}