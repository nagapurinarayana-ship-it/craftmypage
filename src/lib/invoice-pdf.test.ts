import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { createEmptyInvoice, generateId, type Currency } from './invoice'
import { generateInvoicePDF } from './invoice-pdf'

const currencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED', 'SGD', 'JPY']

describe('Invoice PDF export', () => {
  it.each(currencies)('exports a valid A4 PDF for %s', async (currency) => {
    const invoice = createEmptyInvoice(generateId())
    invoice.invoiceDetails.currency = currency
    invoice.business.name = 'CraftMyPage Test Company'
    invoice.customer.name = 'Production Test Customer'
    invoice.lineItems[0].description = 'Professional service'
    invoice.lineItems[0].unitPrice = 1180

    const blob = await generateInvoicePDF(invoice)
    const pdf = await PDFDocument.load(await blob.arrayBuffer())

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
    const pdf = await PDFDocument.load(await blob.arrayBuffer())

    expect(pdf.getPageCount()).toBeGreaterThan(1)
    for (const page of pdf.getPages()) {
      expect(page.getWidth()).toBeCloseTo(595, 0)
      expect(page.getHeight()).toBeCloseTo(842, 0)
    }
  })
})
