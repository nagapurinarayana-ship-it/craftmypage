import { describe, expect, it } from 'vitest'
import { createEmptyInvoice, generateId } from './invoice'
import { calculateInvoice } from './invoice-calculator'

describe('Invoice production calculations', () => {
  it('keeps tax-inclusive totals unchanged while exposing included tax', () => {
    const invoice = createEmptyInvoice(generateId())
    invoice.lineItems = [{ id: 'item-1', description: 'Service', itemCode: '', quantity: 1, unit: 'item', unitPrice: 1180, discount: 0, discountType: 'fixed', taxRate: 18 }]
    invoice.settings.taxMode = 'simple'
    invoice.settings.simpleTax = { taxType: 'vat', taxLabel: 'VAT', inclusive: true }

    const result = calculateInvoice(invoice)

    expect(result.discountedSubtotal).toBe(1180)
    expect(result.subtotalBeforeTax).toBe(1000)
    expect(result.taxAmount).toBeCloseTo(180, 2)
    expect(result.grandTotal).toBe(1180)
  })

  it('clamps invalid negative quantity and unit price', () => {
    const invoice = createEmptyInvoice(generateId())
    invoice.lineItems = [{ id: 'item-1', description: 'Invalid input', itemCode: '', quantity: -5, unit: 'item', unitPrice: -100, discount: 0, discountType: 'fixed', taxRate: 0 }]
    const result = calculateInvoice(invoice)
    expect(result.subtotal).toBe(0)
    expect(result.grandTotal).toBe(0)
  })
})
