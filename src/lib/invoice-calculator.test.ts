import { describe, it, expect } from 'vitest'
import {
  calculateLineItemAmount,
  calculateInvoice,
  roundToDecimalPlaces,
  isValidCalculations,
} from './invoice-calculator'
import { createEmptyInvoice, generateId } from './invoice'

describe('Invoice Calculator', () => {
  describe('calculateLineItemAmount', () => {
    it('calculates quantity * unitPrice', () => {
      const item = {
        id: '1', description: 'Item', itemCode: '', quantity: 5, unit: 'pcs', unitPrice: 100,
        discount: 0, discountType: 'fixed' as const, taxRate: 0,
      }
      expect(calculateLineItemAmount(item)).toBeCloseTo(500, 2)
    })
    it('subtracts fixed discount', () => {
      const item = {
        id: '1', description: 'Item', itemCode: '', quantity: 5, unit: 'pcs', unitPrice: 100,
        discount: 50, discountType: 'fixed' as const, taxRate: 0,
      }
      expect(calculateLineItemAmount(item)).toBeCloseTo(450, 2)
    })
    it('subtracts percentage discount', () => {
      const item = {
        id: '1', description: 'Item', itemCode: '', quantity: 10, unit: 'pcs', unitPrice: 100,
        discount: 10, discountType: 'percentage' as const, taxRate: 0,
      }
      expect(calculateLineItemAmount(item)).toBeCloseTo(900, 2)
    })
    it('handles decimal quantities', () => {
      const item = {
        id: '1', description: 'Item', itemCode: '', quantity: 2.5, unit: 'kg', unitPrice: 100,
        discount: 0, discountType: 'fixed' as const, taxRate: 0,
      }
      expect(calculateLineItemAmount(item)).toBeCloseTo(250, 2)
    })
    it('handles zero and negative values safely', () => {
      const item = {
        id: '1', description: 'Item', itemCode: '', quantity: -1, unit: 'pcs', unitPrice: 100,
        discount: 0, discountType: 'fixed' as const, taxRate: 0,
      }
      expect(isFinite(calculateLineItemAmount(item))).toBe(true)
    })
  })

  describe('roundToDecimalPlaces', () => {
    it('rounds to 2 decimal places', () => {
      expect(roundToDecimalPlaces(123.456, 2)).toBe(123.46)
      expect(roundToDecimalPlaces(123.4, 2)).toBe(123.4)
    })
    it('handles NaN and Infinity gracefully', () => {
      expect(roundToDecimalPlaces(NaN, 2)).toBe(0)
      expect(roundToDecimalPlaces(Infinity, 2)).toBe(0)
      expect(roundToDecimalPlaces(-Infinity, 2)).toBe(0)
    })
  })

  describe('calculateInvoice - No Tax Mode', () => {
    it('calculates subtotal for single item', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [{ id: '1', description: 'Consulting', itemCode: '', quantity: 10, unit: 'hrs', unitPrice: 100, discount: 0, discountType: 'fixed', taxRate: 0 }]
      invoice.settings.taxMode = 'none'
      const calc = calculateInvoice(invoice)
      expect(calc.subtotal).toBeCloseTo(1000, 2)
      expect(calc.discountAmount).toBe(0)
      expect(calc.taxAmount).toBe(0)
      expect(calc.grandTotal).toBeCloseTo(1000, 2)
      expect(isValidCalculations(calc)).toBe(true)
    })
    it('calculates subtotal for multiple items', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [
        { id: '1', description: 'Item 1', itemCode: '', quantity: 5, unit: 'pcs', unitPrice: 100, discount: 0, discountType: 'fixed', taxRate: 0 },
        { id: '2', description: 'Item 2', itemCode: '', quantity: 3, unit: 'pcs', unitPrice: 50, discount: 0, discountType: 'fixed', taxRate: 0 },
      ]
      invoice.settings.taxMode = 'none'
      const calc = calculateInvoice(invoice)
      expect(calc.subtotal).toBeCloseTo(650, 2)
      expect(calc.grandTotal).toBeCloseTo(650, 2)
    })
    it('calculates with line-item discounts', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [{ id: '1', description: 'Item', itemCode: '', quantity: 10, unit: 'pcs', unitPrice: 100, discount: 50, discountType: 'fixed', taxRate: 0 }]
      invoice.settings.taxMode = 'none'
      const calc = calculateInvoice(invoice)
      expect(calc.subtotal).toBeCloseTo(950, 2)
      expect(calc.discountAmount).toBeCloseTo(50, 2)
    })
  })

  describe('calculateInvoice - Simple Tax Mode', () => {
    it('calculates exclusive tax correctly', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [{ id: '1', description: 'Item', itemCode: '', quantity: 10, unit: 'pcs', unitPrice: 100, discount: 0, discountType: 'fixed', taxRate: 18 }]
      invoice.settings.taxMode = 'simple'
      invoice.settings.simpleTax = { taxType: 'vat', taxLabel: 'VAT', inclusive: false }
      const calc = calculateInvoice(invoice)
      expect(calc.subtotalBeforeTax).toBeCloseTo(1000, 2)
      expect(calc.taxAmount).toBeCloseTo(180, 2)
      expect(calc.grandTotal).toBeCloseTo(1180, 2)
    })
    it('handles multiple items with different tax rates', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [
        { id: '1', description: 'Item A', itemCode: '', quantity: 10, unit: 'pcs', unitPrice: 100, discount: 0, discountType: 'fixed', taxRate: 18 },
        { id: '2', description: 'Item B', itemCode: '', quantity: 5, unit: 'pcs', unitPrice: 100, discount: 0, discountType: 'fixed', taxRate: 5 },
      ]
      invoice.settings.taxMode = 'simple'
      invoice.settings.simpleTax = { taxType: 'vat', taxLabel: 'VAT', inclusive: false }
      const calc = calculateInvoice(invoice)
      expect(calc.subtotalBeforeTax).toBeCloseTo(1500, 2)
      expect(calc.taxAmount).toBeGreaterThan(0)
      expect(isFinite(calc.taxAmount)).toBe(true)
    })
  })

  describe('calculateInvoice - India GST Mode', () => {
    const gst = {
      supplierGSTIN: '27AABCC1234F1Z0', customerGSTIN: '27XXYYZZ1234F1Z0', placeOfSupply: 'Gujarat',
      purpose: 'intra-state' as const, cgstRate: 9, sgstRate: 9, igstRate: 18,
    }

    it('calculates CGST and SGST for configured taxable GST rates', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [{ id: '1', description: 'Product', itemCode: 'HSN12345', quantity: 10, unit: 'pcs', unitPrice: 1000, discount: 0, discountType: 'fixed', taxRate: 1 }]
      invoice.settings.taxMode = 'india-gst'
      invoice.settings.gst = gst
      const calc = calculateInvoice(invoice)
      expect(calc.subtotalBeforeTax).toBeCloseTo(10000, 2)
      expect(calc.taxBreakdown['CGST (9%)'] ?? 0).toBeCloseTo(900, 2)
      expect(calc.taxBreakdown['SGST (9%)'] ?? 0).toBeCloseTo(900, 2)
      expect(calc.taxAmount).toBeCloseTo(1800, 2)
      expect(calc.grandTotal).toBeCloseTo(11800, 2)
    })

    it('applies configured GST when a line item has no generic tax rate', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [{ id: '1', description: 'Product', itemCode: 'HSN12345', quantity: 10, unit: 'pcs', unitPrice: 1000, discount: 0, discountType: 'fixed', taxRate: 0 }]
      invoice.settings.taxMode = 'india-gst'
      invoice.settings.gst = gst
      const calc = calculateInvoice(invoice)
      expect(calc.taxAmount).toBeCloseTo(1800, 2)
      expect(calc.grandTotal).toBeCloseTo(11800, 2)
    })

    it('calculates IGST for inter-state transaction', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [{ id: '1', description: 'Product', itemCode: 'HSN12345', quantity: 10, unit: 'pcs', unitPrice: 1000, discount: 0, discountType: 'fixed', taxRate: 1 }]
      invoice.settings.taxMode = 'india-gst'
      invoice.settings.gst = { supplierGSTIN: '27AABCC1234F1Z0', customerGSTIN: '06XXYYZZ1234F1Z0', placeOfSupply: 'Maharashtra', purpose: 'inter-state', cgstRate: 0, sgstRate: 0, igstRate: 18 }
      const calc = calculateInvoice(invoice)
      expect(calc.taxBreakdown['IGST (18%)'] ?? 0).toBeCloseTo(1800, 2)
      expect(calc.taxAmount).toBeCloseTo(1800, 2)
      expect(calc.grandTotal).toBeCloseTo(11800, 2)
    })
  })

  describe('calculateInvoice - Edge Cases', () => {
    it('handles empty invoice', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = []
      const calc = calculateInvoice(invoice)
      expect(isValidCalculations(calc)).toBe(true)
      expect(calc.subtotal).toBe(0)
      expect(calc.grandTotal).toBe(0)
    })
    it('handles invoice with invalid quantity', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [{ id: '1', description: 'Item', itemCode: '', quantity: NaN, unit: 'pcs', unitPrice: 100, discount: 0, discountType: 'fixed', taxRate: 0 }]
      const calc = calculateInvoice(invoice)
      expect(isValidCalculations(calc)).toBe(true)
      expect(calc.subtotal).toBe(0)
    })
    it('caps fixed discount at the gross amount', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [{ id: '1', description: 'Item', itemCode: '', quantity: 1, unit: 'pcs', unitPrice: 100, discount: 200, discountType: 'fixed', taxRate: 0 }]
      const calc = calculateInvoice(invoice)
      expect(calc.subtotal).toBe(0)
      expect(calc.grandTotal).toBe(0)
    })
    it('keeps all calculations finite', () => {
      const invoice = createEmptyInvoice(generateId())
      invoice.lineItems = [{ id: '1', description: 'Item', itemCode: '', quantity: 10, unit: 'pcs', unitPrice: 100, discount: 50, discountType: 'percentage', taxRate: 18 }]
      invoice.settings.taxMode = 'simple'
      invoice.settings.simpleTax = { taxType: 'vat', taxLabel: 'VAT', inclusive: false }
      const calc = calculateInvoice(invoice)
      expect(isValidCalculations(calc)).toBe(true)
    })
  })
})
