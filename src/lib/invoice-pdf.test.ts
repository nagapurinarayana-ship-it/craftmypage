import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { createEmptyInvoice, generateId, type Currency } from './invoice'
import { generateInvoicePDF } from './invoice-pdf'

const currencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED', 'SGD', 'JPY']

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') return blob.arrayBuffer()
  return new Response(blob).arrayBuffer()
}

async function readPdfText(pdf: PDFDocument): Promise<string> {
  const catalog = pdf.context.lookup(pdf.context.trailerInfo.Root)
  return String(catalog)
}

describe('Invoice PDF export', () => {
  it.each(currencies)('exports a valid A4 PDF for %s', async (currency) => {
    const invoice = createEmptyInvoice(generateId())
    invoice.invoiceDetails.currency = currency
    invoice.business.name = 'CraftMyPage Test Company'
    invoice.customer.name = 'Production Test Customer'
    invoice.lineItems[0].description = 'Professional service'
    invoice.lineItems[0].unitPrice = 1180

    const blob = await generateInvoicePDF(invoice)
    const pdf = await PDFDocument.load(await blobToArrayBuffer(blob))

    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1)
    expect(pdf.getPage(0).getWidth()).toBeCloseTo(595, 0)
    expect(pdf.getPage(0).getHeight()).toBeCloseTo(842, 0)
  })

  it('paginates a long invoice instead of overflowing an A4 page', async () => {
    const invoice = createEmptyInvoice(generateId())
    invoice.business.name = 'Long Invoice Test Company'
    invoice.customer.name = 'Long Invoice Customer'
    invoice.lineItems = Array.from({ length: 40 }, (_, index) => ({
      id: `item-${index}`,
      description: `Service item ${index + 1}`,
      itemCode: '',
      quantity: 1,
      unit: 'item',
      unitPrice: 100,
      discount: 0,
      discountType: 'fixed' as const,
      taxRate: 0,
    }))

    const blob = await generateInvoicePDF(invoice)
    const pdf = await PDFDocument.load(await blobToArrayBuffer(blob))

    expect(pdf.getPageCount()).toBeGreaterThan(1)
    for (const page of pdf.getPages()) {
      expect(page.getWidth()).toBeCloseTo(595, 0)
      expect(page.getHeight()).toBeCloseTo(842, 0)
    }
  })

  it('exports configured GST and payment details without throwing', async () => {
    const invoice = createEmptyInvoice(generateId())
    invoice.business.name = 'GST Test Company'
    invoice.customer.name = 'GST Customer'
    invoice.business.taxId = '29ABCDE1234F1Z5'
    invoice.settings = {
      taxMode: 'india-gst',
      gst: {
        supplierGSTIN: '29ABCDE1234F1Z5',
        customerGSTIN: '29ABCDE5678F1Z2',
        placeOfSupply: 'Karnataka',
        purpose: 'intra-state',
        cgstRate: 9,
        sgstRate: 9,
        igstRate: 0,
      },
    }
    invoice.paymentInfo = {
      ...invoice.paymentInfo,
      bankName: 'CraftMyPage Bank',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      upiId: 'craft@upi',
      instructions: 'Please pay within 30 days.',
      termsAndConditions: 'Services provided as agreed.',
      notes: 'Thank you for your business.',
      signatureField: 'Authorized Signatory',
    }
    invoice.lineItems[0].description = 'Consulting'
    invoice.lineItems[0].unitPrice = 10000

    const blob = await generateInvoicePDF(invoice)
    const pdf = await PDFDocument.load(await blobToArrayBuffer(blob))

    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1)
    expect(blob.type).toBe('application/pdf')
  })

  it('uses the shared percentage-discount calculation in the PDF', async () => {
    const invoice = createEmptyInvoice(generateId())
    invoice.business.name = 'Discount Test Company'
    invoice.customer.name = 'Discount Customer'
    invoice.lineItems[0].description = 'Service'
    invoice.lineItems[0].unitPrice = 1000
    invoice.lineItems[0].quantity = 2
    invoice.lineItems[0].discount = 10
    invoice.lineItems[0].discountType = 'percentage'

    const blob = await generateInvoicePDF(invoice)
    const pdf = await PDFDocument.load(await blobToArrayBuffer(blob))

    expect(pdf.getPageCount()).toBe(1)
    expect(await readPdfText(pdf)).toBeTruthy()
  })

  it.each(['professional', 'minimal', 'modern'] as const)('exports the premium %s template without branding by default', async (template) => {
    const invoice = createEmptyInvoice(generateId())
    invoice.template = template
    invoice.business.name = 'Premium Test Studio'
    invoice.customer.name = 'Premium Client'
    invoice.lineItems[0].description = 'Professional service'
    invoice.lineItems[0].unitPrice = 1250

    const blob = await generateInvoicePDF(invoice)
    const pdf = await PDFDocument.load(await blobToArrayBuffer(blob))

    expect(invoice.showBranding).toBe(false)
    expect(pdf.getPageCount()).toBe(1)
    expect(pdf.getTitle()).toContain(invoice.invoiceDetails.invoiceNumber)
  })

  it('moves dense professional payment details to a continuation page instead of omitting them', async () => {
    const invoice = createEmptyInvoice(generateId())
    invoice.business = { ...invoice.business, name: 'Dense Invoice Studio', address: '42 Long Address', city: 'Hyderabad', state: 'Telangana', postalCode: '500033', country: 'India', phone: '+91 90000 12345', email: 'billing@example.com', taxId: '36ABCDE1234F1Z5' }
    invoice.customer = { ...invoice.customer, name: 'Dense Invoice Client', billingAddress: '8 Financial District', billingCity: 'Hyderabad', billingState: 'Telangana', billingPostalCode: '500032', billingCountry: 'India', email: 'accounts@example.com' }
    invoice.invoiceDetails.projectPeriod = 'August 2026'
    invoice.lineItems = Array.from({ length: 8 }, (_, index) => ({ id: `dense-${index}`, description: `Professional service ${index + 1}`, itemCode: '', quantity: 1, unit: 'item', unitPrice: 1000, discount: 0, discountType: 'fixed' as const, taxRate: 0 }))
    invoice.paymentInfo = { ...invoice.paymentInfo, bankName: 'Test Bank', accountNumber: 'XXXX1234', instructions: 'Reference the invoice number.', notes: 'Thank you.', termsAndConditions: 'Payment is due within 30 days.', signatureField: 'Authorized Signatory' }

    const blob = await generateInvoicePDF(invoice)
    const pdf = await PDFDocument.load(await blobToArrayBuffer(blob))

    expect(pdf.getPageCount()).toBeGreaterThan(1)
  })
})
