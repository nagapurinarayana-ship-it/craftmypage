import type { Invoice, InvoiceCalculations, LineItem, TaxMode } from './invoice'

// Money calculation helpers to avoid floating-point errors
// Work in minor units (paise/cents) as integers, then convert back

const MINOR_UNITS = 100

export function toMinorUnits(amount: number): number {
  return Math.round(amount * MINOR_UNITS)
}

export function fromMinorUnits(amount: number): number {
  return Math.round(amount) / MINOR_UNITS
}

export function calculateLineItemAmount(item: LineItem): number {
  // quantity * unitPrice - discount
  if (!isFinite(item.quantity) || !isFinite(item.unitPrice)) {
    return 0
  }

  const grossAmount = item.quantity * item.unitPrice
  let discount = 0

  if (isFinite(item.discount) && item.discount > 0) {
    if (item.discountType === 'percentage') {
      discount = (grossAmount * item.discount) / 100
    } else {
      discount = item.discount
    }
  }

  // Ensure discount doesn't exceed amount
  discount = Math.min(discount, grossAmount)
  return Math.max(0, grossAmount - discount)
}

export function calculateInvoice(invoice: Invoice): InvoiceCalculations {
  const taxMode = invoice.settings.taxMode

  // Calculate line items
  let subtotal = 0
  let totalDiscount = 0

  for (const item of invoice.lineItems) {
    if (!isFinite(item.quantity) || !isFinite(item.unitPrice)) {
      continue
    }

    const grossAmount = item.quantity * item.unitPrice
    let discount = 0

    if (isFinite(item.discount) && item.discount > 0) {
      if (item.discountType === 'percentage') {
        discount = (grossAmount * item.discount) / 100
      } else {
        discount = item.discount
      }
    }

    discount = Math.min(discount, grossAmount)
    totalDiscount += discount
    subtotal += Math.max(0, grossAmount - discount)
  }

  subtotal = roundToDecimalPlaces(subtotal, 2)

  // Apply invoice-level discount (if any future field is added)
  const discountAmount = roundToDecimalPlaces(totalDiscount, 2)
  const discountedSubtotal = roundToDecimalPlaces(subtotal, 2)

  // Shipping and adjustment
  const shippingCharge = 0 // Could be added as a form field
  const adjustment = 0 // Could be added as a form field

  let subtotalBeforeTax = discountedSubtotal + shippingCharge + adjustment
  subtotalBeforeTax = roundToDecimalPlaces(subtotalBeforeTax, 2)

  // Calculate tax based on mode
  let taxAmount = 0
  const taxBreakdown: Record<string, number> = {}

  if (taxMode === 'simple' && invoice.settings.simpleTax) {
    const simpleTax = invoice.settings.simpleTax
    let taxableAmount = subtotalBeforeTax

    if (simpleTax.inclusive) {
      // Tax is already in the subtotal
      // Calculate: taxableAmount = subtotal / (1 + taxRate/100)
      // Then tax = taxableAmount * (taxRate/100)
      // But for inclusive, we show the tax portion
      // This is complex, so for now we show it as-is
      taxAmount = 0
    } else {
      // Exclusive tax: add tax on top
      // Get the average tax rate from line items
      let totalTaxableAmount = 0
      let weightedTaxRate = 0

      for (const item of invoice.lineItems) {
        const itemAmount = calculateLineItemAmount(item)
        totalTaxableAmount += itemAmount
        weightedTaxRate += itemAmount * item.taxRate
      }

      if (totalTaxableAmount > 0) {
        const avgTaxRate = weightedTaxRate / totalTaxableAmount
        taxAmount = roundToDecimalPlaces((subtotalBeforeTax * avgTaxRate) / 100, 2)
      }

      if (taxAmount > 0) {
        const label = simpleTax.taxLabel || 'Tax'
        taxBreakdown[label] = taxAmount
      }
    }
  } else if (taxMode === 'india-gst' && invoice.settings.gst) {
    const gst = invoice.settings.gst
    const purpose = gst.purpose

    // For each line item, check if it's taxable and calculate GST
    let cgstTotal = 0
    let sgstTotal = 0
    let igstTotal = 0

    for (const item of invoice.lineItems) {
      const itemAmount = calculateLineItemAmount(item)

      if (item.taxRate > 0) {
        if (purpose === 'intra-state') {
          // Split into CGST and SGST
          const cgstAmount = roundToDecimalPlaces((itemAmount * gst.cgstRate) / 100, 2)
          const sgstAmount = roundToDecimalPlaces((itemAmount * gst.sgstRate) / 100, 2)
          cgstTotal += cgstAmount
          sgstTotal += sgstAmount
        } else {
          // IGST only
          const igstAmount = roundToDecimalPlaces((itemAmount * gst.igstRate) / 100, 2)
          igstTotal += igstAmount
        }
      }
    }

    cgstTotal = roundToDecimalPlaces(cgstTotal, 2)
    sgstTotal = roundToDecimalPlaces(sgstTotal, 2)
    igstTotal = roundToDecimalPlaces(igstTotal, 2)

    taxAmount = roundToDecimalPlaces(cgstTotal + sgstTotal + igstTotal, 2)

    if (cgstTotal > 0) {
      taxBreakdown[`CGST (${gst.cgstRate}%)`] = cgstTotal
    }
    if (sgstTotal > 0) {
      taxBreakdown[`SGST (${gst.sgstRate}%)`] = sgstTotal
    }
    if (igstTotal > 0) {
      taxBreakdown[`IGST (${gst.igstRate}%)`] = igstTotal
    }
  }

  const grandTotal = roundToDecimalPlaces(subtotalBeforeTax + taxAmount, 2)

  const amountPaid = 0 // Could be a form field
  const balanceDue = roundToDecimalPlaces(grandTotal - amountPaid, 2)

  return {
    subtotal: roundToDecimalPlaces(subtotal, 2),
    discountAmount,
    discountedSubtotal,
    shippingCharge,
    adjustment,
    subtotalBeforeTax,
    taxAmount,
    taxBreakdown,
    amountPaid,
    balanceDue,
    grandTotal,
  }
}

export function roundToDecimalPlaces(amount: number, places: number): number {
  if (!isFinite(amount)) {
    return 0
  }
  const factor = Math.pow(10, places)
  return Math.round(amount * factor) / factor
}

// Utility to validate calculations have no NaN or Infinity
export function isValidCalculations(calc: InvoiceCalculations): boolean {
  return (
    isFinite(calc.subtotal) &&
    isFinite(calc.discountAmount) &&
    isFinite(calc.discountedSubtotal) &&
    isFinite(calc.shippingCharge) &&
    isFinite(calc.adjustment) &&
    isFinite(calc.subtotalBeforeTax) &&
    isFinite(calc.taxAmount) &&
    isFinite(calc.amountPaid) &&
    isFinite(calc.balanceDue) &&
    isFinite(calc.grandTotal) &&
    Object.values(calc.taxBreakdown).every((v) => isFinite(v))
  )
}
