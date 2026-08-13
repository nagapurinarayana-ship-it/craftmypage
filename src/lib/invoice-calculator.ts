import type { Invoice, InvoiceCalculations, LineItem, TaxMode } from './invoice'

const MINOR_UNITS = 100

export function toMinorUnits(amount: number): number {
  return Math.round(amount * MINOR_UNITS)
}

export function fromMinorUnits(amount: number): number {
  return Math.round(amount) / MINOR_UNITS
}

function getGrossAmount(item: LineItem): number {
  if (!Number.isFinite(item.quantity) || !Number.isFinite(item.unitPrice)) return 0
  return Math.max(0, item.quantity) * Math.max(0, item.unitPrice)
}

function getDiscountAmount(item: LineItem, grossAmount: number): number {
  if (!Number.isFinite(item.discount) || item.discount <= 0) return 0
  const raw = item.discountType === 'percentage' ? (grossAmount * item.discount) / 100 : item.discount
  return Math.min(Math.max(0, raw), grossAmount)
}

export function calculateLineItemAmount(item: LineItem): number {
  const grossAmount = getGrossAmount(item)
  return Math.max(0, grossAmount - getDiscountAmount(item, grossAmount))
}

export function calculateInvoice(invoice: Invoice): InvoiceCalculations {
  const taxMode: TaxMode = invoice.settings.taxMode
  let subtotal = 0
  let totalDiscount = 0

  for (const item of invoice.lineItems) {
    const grossAmount = getGrossAmount(item)
    const discount = getDiscountAmount(item, grossAmount)
    totalDiscount += discount
    subtotal += Math.max(0, grossAmount - discount)
  }

  subtotal = roundToDecimalPlaces(subtotal, 2)
  const discountAmount = roundToDecimalPlaces(totalDiscount, 2)
  const discountedSubtotal = roundToDecimalPlaces(subtotal, 2)
  const shippingCharge = 0
  const adjustment = 0
  let subtotalBeforeTax = roundToDecimalPlaces(discountedSubtotal + shippingCharge + adjustment, 2)

  let taxAmount = 0
  const taxBreakdown: Record<string, number> = {}

  if (taxMode === 'simple' && invoice.settings.simpleTax) {
    const simpleTax = invoice.settings.simpleTax

    if (simpleTax.inclusive) {
      let inclusiveTax = 0
      for (const item of invoice.lineItems) {
        const itemAmount = calculateLineItemAmount(item)
        const rate = clampPercentage(item.taxRate)
        if (itemAmount > 0 && rate > 0) inclusiveTax += itemAmount - itemAmount / (1 + rate / 100)
      }
      taxAmount = roundToDecimalPlaces(inclusiveTax, 2)
      subtotalBeforeTax = roundToDecimalPlaces(Math.max(0, subtotalBeforeTax - taxAmount), 2)
    } else {
      let totalTaxableAmount = 0
      let weightedTaxRate = 0
      for (const item of invoice.lineItems) {
        const itemAmount = calculateLineItemAmount(item)
        const rate = clampPercentage(item.taxRate)
        totalTaxableAmount += itemAmount
        weightedTaxRate += itemAmount * rate
      }
      if (totalTaxableAmount > 0) {
        const avgTaxRate = weightedTaxRate / totalTaxableAmount
        taxAmount = roundToDecimalPlaces((subtotalBeforeTax * avgTaxRate) / 100, 2)
      }
    }

    if (taxAmount > 0) taxBreakdown[simpleTax.taxLabel || 'Tax'] = taxAmount
  } else if (taxMode === 'india-gst' && invoice.settings.gst) {
    const gst = invoice.settings.gst
    let cgstTotal = 0
    let sgstTotal = 0
    let igstTotal = 0

    const cgstRate = clampPercentage(gst.cgstRate)
    const sgstRate = clampPercentage(gst.sgstRate)
    const igstRate = clampPercentage(gst.igstRate)

    for (const item of invoice.lineItems) {
      const itemAmount = calculateLineItemAmount(item)
      if (itemAmount <= 0) continue

      if (gst.purpose === 'intra-state') {
        cgstTotal += (itemAmount * cgstRate) / 100
        sgstTotal += (itemAmount * sgstRate) / 100
      } else {
        igstTotal += (itemAmount * igstRate) / 100
      }
    }

    cgstTotal = roundToDecimalPlaces(cgstTotal, 2)
    sgstTotal = roundToDecimalPlaces(sgstTotal, 2)
    igstTotal = roundToDecimalPlaces(igstTotal, 2)
    taxAmount = roundToDecimalPlaces(cgstTotal + sgstTotal + igstTotal, 2)
    if (cgstTotal > 0) taxBreakdown[`CGST (${cgstRate}%)`] = cgstTotal
    if (sgstTotal > 0) taxBreakdown[`SGST (${sgstRate}%)`] = sgstTotal
    if (igstTotal > 0) taxBreakdown[`IGST (${igstRate}%)`] = igstTotal
  }

  const grandTotal = roundToDecimalPlaces(subtotalBeforeTax + taxAmount, 2)
  const amountPaid = 0
  const balanceDue = roundToDecimalPlaces(grandTotal - amountPaid, 2)

  return { subtotal, discountAmount, discountedSubtotal, shippingCharge, adjustment, subtotalBeforeTax, taxAmount, taxBreakdown, amountPaid, balanceDue, grandTotal }
}

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
}

export function roundToDecimalPlaces(amount: number, places: number): number {
  if (!Number.isFinite(amount)) return 0
  const factor = Math.pow(10, places)
  return Math.round(amount * factor) / factor
}

export function isValidCalculations(calc: InvoiceCalculations): boolean {
  return Number.isFinite(calc.subtotal)
    && Number.isFinite(calc.discountAmount)
    && Number.isFinite(calc.discountedSubtotal)
    && Number.isFinite(calc.shippingCharge)
    && Number.isFinite(calc.adjustment)
    && Number.isFinite(calc.subtotalBeforeTax)
    && Number.isFinite(calc.taxAmount)
    && Number.isFinite(calc.amountPaid)
    && Number.isFinite(calc.balanceDue)
    && Number.isFinite(calc.grandTotal)
    && Object.values(calc.taxBreakdown).every((value) => Number.isFinite(value))
}
