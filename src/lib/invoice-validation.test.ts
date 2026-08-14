import { describe, expect, it } from 'vitest'
import { createEmptyInvoice, generateId, isValidInvoice } from './invoice'

function validInvoice() {
  const invoice = createEmptyInvoice(generateId())
  invoice.business.name = 'Example Business'
  invoice.customer.name = 'Example Customer'
  invoice.lineItems[0].description = 'Consulting'
  invoice.lineItems[0].unitPrice = 1000
  return invoice
}

describe('Invoice validation', () => {
  it('rejects a due date earlier than the issue date', () => {
    const invoice = validInvoice()
    invoice.invoiceDetails.issueDate = '2026-08-13'
    invoice.invoiceDetails.dueDate = '2026-08-12'

    expect(isValidInvoice(invoice).errors).toContain('Due date cannot be earlier than the issue date')
  })

  it('rejects percentage discounts above 100%', () => {
    const invoice = validInvoice()
    invoice.lineItems[0].discountType = 'percentage'
    invoice.lineItems[0].discount = 101

    expect(isValidInvoice(invoice).errors).toContain('Percentage discount cannot exceed 100%')
  })

  it('rejects fixed discounts above the line subtotal', () => {
    const invoice = validInvoice()
    invoice.lineItems[0].quantity = 2
    invoice.lineItems[0].unitPrice = 100
    invoice.lineItems[0].discount = 201

    expect(isValidInvoice(invoice).errors).toContain('Fixed discount cannot exceed the line-item subtotal')
  })

  it('rejects GST rate combinations that contradict the supply type', () => {
    const invoice = validInvoice()
    invoice.settings = {
      taxMode: 'india-gst',
      gst: {
        supplierGSTIN: '29ABCDE1234F1Z5',
        customerGSTIN: '29ABCDE5678F1Z2',
        placeOfSupply: 'Karnataka',
        purpose: 'intra-state',
        cgstRate: 9,
        sgstRate: 9,
        igstRate: 18,
      },
    }

    expect(isValidInvoice(invoice).errors).toContain('IGST must be 0 for an intra-state invoice')
  })
})
