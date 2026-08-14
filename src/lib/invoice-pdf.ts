import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { Invoice, Currency, InvoiceCalculations } from './invoice'
import { getCurrencyConfig } from './invoice'
import { calculateInvoice, calculateLineItemAmount } from './invoice-calculator'

const PAGE_SIZE: [number, number] = [595, 842]
const LEFT = 50
const RIGHT = 545
const CONTENT_WIDTH = RIGHT - LEFT

function formatPdfCurrency(amount: number, currency: Currency): string {
  const config = getCurrencyConfig(currency)
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  }).format(Math.max(0, amount))
  return `${currency} ${formatted}`
}

function safeText(value: string | undefined | null): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

export function sanitizeFileName(value: string): string {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')
  return cleaned || 'invoice'
}

export async function generateInvoicePDF(invoice: Invoice): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const calc = calculateInvoice(invoice)
  const businessName = safeText(invoice.business.name) || 'Invoice'
  const invoiceTitle = safeText(invoice.invoiceDetails.title) || 'Invoice'
  const invoiceNumber = safeText(invoice.invoiceDetails.invoiceNumber) || 'Draft'

  pdfDoc.setTitle(`${invoiceTitle} ${invoiceNumber}`.trim())
  pdfDoc.setAuthor(businessName)
  pdfDoc.setSubject(`Invoice ${invoiceNumber}`)
  pdfDoc.setCreator('CraftMyPage Invoice Maker')
  pdfDoc.setProducer('CraftMyPage Invoice Maker')
  pdfDoc.setKeywords(['invoice', 'CraftMyPage', invoiceNumber, businessName].filter(Boolean))

  if (invoice.template === 'professional') await renderProfessionalPDF(pdfDoc, invoice, calc)
  else if (invoice.template === 'minimal') await renderMinimalPDF(pdfDoc, invoice, calc)
  else await renderModernPDF(pdfDoc, invoice, calc)

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes.buffer], { type: 'application/pdf' })
}

function stringToRGB(hex: string) {
  const cleaned = safeText(hex).replace('#', '')
  const normalized = cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned
  const bigint = parseInt(normalized || '2563eb', 16)
  return rgb(((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255)
}

function drawContinuationHeader(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, y: number, accentRGB = stringToRGB(invoice.accentColor)): number {
  page.drawText(`${safeText(invoice.invoiceDetails.title) || 'Invoice'} — continued`, {
    x: LEFT, y, size: 13, font: bold, color: accentRGB,
  })
  page.drawText(`# ${safeText(invoice.invoiceDetails.invoiceNumber) || 'Draft'}`, {
    x: 450, y, size: 9, font, color: rgb(0.45, 0.45, 0.45),
  })
  return y - 28
}

function drawKeyValue(page: PDFPage, label: string, value: string, x: number, y: number, font: PDFFont, bold: PDFFont) {
  const clean = safeText(value)
  if (!clean) return
  page.drawText(label, { x, y, size: 8, font, color: rgb(0.42, 0.42, 0.42) })
  page.drawText(clean.substring(0, 48), { x, y: y - 12, size: 9, font: bold })
}

function businessLines(invoice: Invoice): string[] {
  return [
    invoice.business.name,
    invoice.business.contactPerson ? `Attn: ${invoice.business.contactPerson}` : '',
    invoice.business.address,
    invoice.business.city ? `${invoice.business.city}${invoice.business.state ? `, ${invoice.business.state}` : ''}${invoice.business.postalCode ? ` ${invoice.business.postalCode}` : ''}` : '',
    invoice.business.country,
    invoice.business.phone,
    invoice.business.email,
    invoice.business.website,
    invoice.business.taxId ? `Tax ID: ${invoice.business.taxId}` : '',
  ].map(safeText).filter(Boolean)
}

function customerLines(invoice: Invoice): string[] {
  return [
    invoice.customer.name,
    invoice.customer.contactPerson ? `Attn: ${invoice.customer.contactPerson}` : '',
    invoice.customer.billingAddress,
    invoice.customer.billingCity ? `${invoice.customer.billingCity}${invoice.customer.billingState ? `, ${invoice.customer.billingState}` : ''}${invoice.customer.billingPostalCode ? ` ${invoice.customer.billingPostalCode}` : ''}` : '',
    invoice.customer.billingCountry,
    invoice.customer.phone,
    invoice.customer.email,
    invoice.customer.taxId ? `Tax ID: ${invoice.customer.taxId}` : '',
  ].map(safeText).filter(Boolean)
}

function drawPartyBlock(page: PDFPage, title: string, lines: string[], x: number, y: number, font: PDFFont, bold: PDFFont, maxLines = 8) {
  page.drawText(title, { x, y, size: 10, font: bold })
  lines.slice(0, maxLines).forEach((line, index) => {
    page.drawText(line.substring(0, 52), { x, y: y - 15 - index * 12, size: 9, font, color: index === 0 ? rgb(0.12, 0.12, 0.12) : rgb(0.38, 0.38, 0.38) })
  })
}

function drawInvoiceMeta(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, y: number, accentRGB: ReturnType<typeof stringToRGB>, bordered = true): number {
  const items = [
    ['Issue Date', invoice.invoiceDetails.issueDate],
    ['Due Date', invoice.invoiceDetails.dueDate],
    ['Currency', invoice.invoiceDetails.currency],
    ['Payment Terms', invoice.invoiceDetails.paymentTerms],
  ]
  if (bordered) page.drawRectangle({ x: LEFT, y: y - 60, width: CONTENT_WIDTH, height: 60, borderColor: accentRGB, borderWidth: 1 })
  items.forEach((item, index) => drawKeyValue(page, item[0], item[1], LEFT + 20 + index * 120, y - 18, font, bold))
  return y - 78
}

function drawGstBlock(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, y: number, accentRGB: ReturnType<typeof stringToRGB>): number {
  if (invoice.settings.taxMode !== 'india-gst' || !invoice.settings.gst) return y
  const gst = invoice.settings.gst
  page.drawText('GST Details', { x: LEFT, y, size: 10, font: bold, color: accentRGB })
  const items = [
    ['Supplier GSTIN', gst.supplierGSTIN.toUpperCase()],
    ['Customer GSTIN', gst.customerGSTIN.toUpperCase()],
    ['Place of Supply', gst.placeOfSupply],
    ['Supply Type', gst.purpose === 'intra-state' ? 'Intra-state' : 'Inter-state'],
  ].filter(([, value]) => safeText(value))
  items.forEach((item, index) => drawKeyValue(page, item[0], item[1], LEFT + (index % 2) * 250, y - 15 - Math.floor(index / 2) * 34, font, bold))
  return y - (items.length > 2 ? 68 : 34)
}

function drawSummary(page: PDFPage, calc: InvoiceCalculations, invoice: Invoice, font: PDFFont, bold: PDFFont, x: number, y: number, accentRGB: ReturnType<typeof stringToRGB>, modern = false): number {
  const width = 200
  page.drawText(`Subtotal: ${formatPdfCurrency(calc.subtotal, invoice.invoiceDetails.currency)}`, { x, y, size: 9.5, font })
  y -= 15
  if (calc.discountAmount > 0) {
    page.drawText(`Discount: -${formatPdfCurrency(calc.discountAmount, invoice.invoiceDetails.currency)}`, { x, y, size: 9.5, font })
    y -= 15
  }
  if (calc.shippingCharge !== 0) {
    page.drawText(`Shipping: ${formatPdfCurrency(calc.shippingCharge, invoice.invoiceDetails.currency)}`, { x, y, size: 9.5, font })
    y -= 15
  }
  if (calc.adjustment !== 0) {
    page.drawText(`Adjustment: ${formatPdfCurrency(calc.adjustment, invoice.invoiceDetails.currency)}`, { x, y, size: 9.5, font })
    y -= 15
  }
  Object.entries(calc.taxBreakdown).forEach(([label, value]) => {
    page.drawText(`${label}: ${formatPdfCurrency(value, invoice.invoiceDetails.currency)}`, { x, y, size: 9, font })
    y -= 14
  })
  if (calc.amountPaid > 0) {
    page.drawText(`Paid: ${formatPdfCurrency(calc.amountPaid, invoice.invoiceDetails.currency)}`, { x, y, size: 9, font })
    y -= 14
  }
  page.drawLine({ start: { x, y: y + 5 }, end: { x: x + width, y: y + 5 }, thickness: 1, color: accentRGB })
  page.drawText(`${modern ? 'TOTAL' : 'TOTAL DUE'}: ${formatPdfCurrency(calc.balanceDue, invoice.invoiceDetails.currency)}`, {
    x, y: y - 15, size: modern ? 14 : 13, font: bold, color: accentRGB,
  })
  return y - 35
}

function drawPaymentAndTerms(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, x: number, y: number, accentRGB: ReturnType<typeof stringToRGB>): number {
  let cursor = y
  const payment = invoice.paymentInfo
  const paymentLines = [
    payment.bankName ? `Bank: ${safeText(payment.bankName)}` : '',
    payment.accountNumber ? `Account: ${safeText(payment.accountNumber)}` : '',
    payment.ifscCode ? `IFSC: ${safeText(payment.ifscCode).toUpperCase()}` : '',
    payment.upiId ? `UPI: ${safeText(payment.upiId).toUpperCase()}` : '',
    payment.instructions ? `Instructions: ${safeText(payment.instructions)}` : '',
  ].filter(Boolean)

  if (paymentLines.length) {
    page.drawText('Payment Details', { x, y: cursor, size: 10, font: bold, color: accentRGB })
    cursor -= 16
    paymentLines.slice(0, 7).forEach((line) => {
      page.drawText(line.substring(0, 80), { x, y: cursor, size: 8, font, color: rgb(0.35, 0.35, 0.35) })
      cursor -= 12
    })
    cursor -= 4
  }

  if (payment.notes) {
    page.drawText('Notes', { x, y: cursor, size: 9, font: bold })
    cursor -= 13
    page.drawText(safeText(payment.notes).substring(0, 120), { x, y: cursor, size: 8, font, color: rgb(0.38, 0.38, 0.38) })
    cursor -= 15
  }
  if (payment.termsAndConditions) {
    page.drawText('Terms & Conditions', { x, y: cursor, size: 9, font: bold })
    cursor -= 13
    page.drawText(safeText(payment.termsAndConditions).substring(0, 120), { x, y: cursor, size: 8, font, color: rgb(0.38, 0.38, 0.38) })
    cursor -= 15
  }
  if (payment.signatureField) {
    page.drawText(payment.signatureField.substring(0, 80), { x, y: cursor, size: 8, font: bold, color: rgb(0.38, 0.38, 0.38) })
    cursor -= 14
  }
  if (payment.thankYouMessage) {
    page.drawText(safeText(payment.thankYouMessage).substring(0, 100), { x, y: cursor, size: 8, font, color: rgb(0.4, 0.4, 0.4) })
    cursor -= 14
  }
  return cursor
}

function drawFooter(page: PDFPage, font: PDFFont) {
  page.drawText('Generated with CraftMyPage — Free invoice maker', { x: LEFT, y: 20, size: 8, font, color: rgb(0.6, 0.6, 0.6) })
}

async function renderProfessionalPDF(pdfDoc: PDFDocument, invoice: Invoice, calc: InvoiceCalculations) {
  let page = pdfDoc.addPage(PAGE_SIZE)
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  const accentRGB = stringToRGB(invoice.accentColor)
  let y = 750

  page.drawText(safeText(invoice.business.name) || 'Invoice', { x: LEFT, y, size: 28, font: bold, color: accentRGB })
  page.drawText(safeText(invoice.invoiceDetails.title) || 'Invoice', { x: 450, y, size: 24, font: bold })
  page.drawText(`# ${safeText(invoice.invoiceDetails.invoiceNumber) || 'Draft'}`, { x: 450, y: y - 25, size: 11, font, color: rgb(0.4, 0.4, 0.4) })
  if (invoice.invoiceDetails.referenceNumber) page.drawText(`Ref: ${safeText(invoice.invoiceDetails.referenceNumber)}`, { x: 450, y: y - 41, size: 9, font, color: rgb(0.45, 0.45, 0.45) })
  y -= 60

  drawPartyBlock(page, 'From:', businessLines(invoice), LEFT, y, font, bold)
  drawPartyBlock(page, 'Bill To:', customerLines(invoice), 350, y, font, bold)
  y -= 108
  y = drawInvoiceMeta(page, invoice, font, bold, y, accentRGB)
  if (invoice.invoiceDetails.projectPeriod) { drawKeyValue(page, 'Project / Service Period', invoice.invoiceDetails.projectPeriod, LEFT, y, font, bold); y -= 32 }
  y = drawGstBlock(page, invoice, font, bold, y, accentRGB)

  const tableX = LEFT
  const tableWidth = CONTENT_WIDTH
  const colWidths = [0.43, 0.12, 0.12, 0.13, 0.20]
  const drawHeader = () => {
    page.drawRectangle({ x: tableX, y: y - 30, width: tableWidth, height: 25, color: accentRGB })
    let currentX = tableX + 10
    ;['Description', 'Qty', 'Unit', 'Rate', 'Amount'].forEach((header, index) => {
      page.drawText(header, { x: currentX, y: y - 22, size: 9, font: bold, color: rgb(1, 1, 1) })
      currentX += tableWidth * colWidths[index]
    })
    y -= 35
  }
  drawHeader()

  invoice.lineItems.forEach((item) => {
    if (y < 90) { page = pdfDoc.addPage(PAGE_SIZE); y = drawContinuationHeader(page, invoice, font, bold, 760, accentRGB); drawHeader() }
    const amount = calculateLineItemAmount(item)
    page.drawText(safeText(item.description || 'Item').substring(0, 36), { x: tableX + 10, y, size: 8.5, font })
    page.drawText(String(item.quantity), { x: tableX + tableWidth * colWidths[0] + 10, y, size: 8.5, font })
    page.drawText(safeText(item.unit || 'pcs').substring(0, 10), { x: tableX + tableWidth * (colWidths[0] + colWidths[1]) + 10, y, size: 8.5, font })
    page.drawText(formatPdfCurrency(item.unitPrice, invoice.invoiceDetails.currency), { x: tableX + tableWidth * (colWidths[0] + colWidths[1] + colWidths[2]) + 6, y, size: 8.5, font })
    page.drawText(formatPdfCurrency(amount, invoice.invoiceDetails.currency), { x: tableX + tableWidth * (colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]) + 6, y, size: 8.5, font })
    y -= 20
  })

  if (y < 180) { page = pdfDoc.addPage(PAGE_SIZE); y = drawContinuationHeader(page, invoice, font, bold, 780, accentRGB) }
  y = drawSummary(page, calc, invoice, font, bold, RIGHT - 200, y, accentRGB)
  if (y > 120) y = drawPaymentAndTerms(page, invoice, font, bold, LEFT, y, accentRGB)
  drawFooter(page, font)
}

async function renderMinimalPDF(pdfDoc: PDFDocument, invoice: Invoice, calc: InvoiceCalculations) {
  let page = pdfDoc.addPage(PAGE_SIZE)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const accentRGB = stringToRGB(invoice.accentColor)
  let y = 760

  const nextPage = () => {
    page = pdfDoc.addPage(PAGE_SIZE)
    y = drawContinuationHeader(page, invoice, font, bold, 770, accentRGB)
  }

  page.drawText(safeText(invoice.business.name) || 'Invoice', { x: LEFT, y, size: 24, font: bold, color: accentRGB })
  page.drawText(safeText(invoice.invoiceDetails.title) || 'Invoice', { x: 450, y, size: 20, font: bold })
  page.drawText(safeText(invoice.invoiceDetails.invoiceNumber) || 'Draft', { x: 450, y: y - 24, size: 10, font, color: rgb(0.5, 0.5, 0.5) })
  y -= 58

  drawPartyBlock(page, 'From', businessLines(invoice), LEFT, y, font, bold, 6)
  drawPartyBlock(page, 'To', customerLines(invoice), 350, y, font, bold, 6)
  y -= 92
  y = drawInvoiceMeta(page, invoice, font, bold, y, accentRGB, false)
  if (invoice.invoiceDetails.projectPeriod) { page.drawText(`Project / Service Period: ${safeText(invoice.invoiceDetails.projectPeriod)}`, { x: LEFT, y, size: 8.5, font }); y -= 18 }
  y = drawGstBlock(page, invoice, font, bold, y, accentRGB)

  page.drawLine({ start: { x: LEFT, y }, end: { x: RIGHT, y }, thickness: 1, color: accentRGB })
  y -= 20
  page.drawText('Description', { x: LEFT, y, size: 9, font: bold })
  page.drawText('Amount', { x: 475, y, size: 9, font: bold })
  y -= 18

  invoice.lineItems.forEach((item) => {
    if (y < 120) nextPage()
    const amount = calculateLineItemAmount(item)
    page.drawText(safeText(item.description || 'Item').substring(0, 62), { x: LEFT, y, size: 9.5, font })
    page.drawText(formatPdfCurrency(amount, invoice.invoiceDetails.currency), { x: 470, y, size: 9.5, font: bold })
    page.drawText(`${item.quantity} × ${formatPdfCurrency(item.unitPrice, invoice.invoiceDetails.currency)}${item.discount > 0 ? ` · discount ${item.discount}${item.discountType === 'percentage' ? '%' : ''}` : ''}`, { x: LEFT, y: y - 12, size: 8, font, color: rgb(0.55, 0.55, 0.55) })
    y -= 30
  })

  if (y < 170) nextPage()
  y = drawSummary(page, calc, invoice, font, bold, 345, y, accentRGB)
  if (y > 100) y = drawPaymentAndTerms(page, invoice, font, bold, LEFT, y, accentRGB)
  drawFooter(page, font)
}

async function renderModernPDF(pdfDoc: PDFDocument, invoice: Invoice, calc: InvoiceCalculations) {
  let page = pdfDoc.addPage(PAGE_SIZE)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const accentRGB = stringToRGB(invoice.accentColor)
  let y = 680

  const nextPage = () => {
    page = pdfDoc.addPage(PAGE_SIZE)
    y = drawContinuationHeader(page, invoice, font, bold, 770, accentRGB)
  }

  page.drawRectangle({ x: 0, y: 700, width: 595, height: 100, color: accentRGB })
  page.drawText(safeText(invoice.business.name) || 'Invoice', { x: LEFT, y: 770, size: 24, font: bold, color: rgb(1, 1, 1) })
  page.drawText(safeText(invoice.invoiceDetails.title) || 'Invoice', { x: 450, y: 770, size: 18, font: bold, color: rgb(1, 1, 1) })
  page.drawText(`# ${safeText(invoice.invoiceDetails.invoiceNumber) || 'Draft'}`, { x: 450, y: 750, size: 10, font, color: rgb(1, 1, 1) })
  y = 670

  drawPartyBlock(page, 'From', businessLines(invoice), LEFT, y, font, bold, 6)
  drawPartyBlock(page, 'To', customerLines(invoice), 350, y, font, bold, 6)
  y -= 92
  y = drawInvoiceMeta(page, invoice, font, bold, y, accentRGB, false)
  if (invoice.invoiceDetails.projectPeriod) { page.drawText(`Project / Service Period: ${safeText(invoice.invoiceDetails.projectPeriod)}`, { x: LEFT, y, size: 8.5, font }); y -= 18 }
  y = drawGstBlock(page, invoice, font, bold, y, accentRGB)

  page.drawRectangle({ x: LEFT, y: y - 25, width: CONTENT_WIDTH, height: 25, color: accentRGB })
  page.drawText('Description', { x: LEFT + 10, y: y - 17, size: 9, font: bold, color: rgb(1, 1, 1) })
  page.drawText('Amount', { x: 475, y: y - 17, size: 9, font: bold, color: rgb(1, 1, 1) })
  y -= 38

  invoice.lineItems.forEach((item) => {
    if (y < 130) nextPage()
    const amount = calculateLineItemAmount(item)
    page.drawText(safeText(item.description || 'Item').substring(0, 60), { x: LEFT + 10, y, size: 9.5, font })
    page.drawText(formatPdfCurrency(amount, invoice.invoiceDetails.currency), { x: 470, y, size: 9.5, font: bold })
    page.drawText(`${item.quantity} × ${formatPdfCurrency(item.unitPrice, invoice.invoiceDetails.currency)}${item.discount > 0 ? ` · discount ${item.discount}${item.discountType === 'percentage' ? '%' : ''}` : ''}`, { x: LEFT + 10, y: y - 12, size: 8, font, color: rgb(0.55, 0.55, 0.55) })
    y -= 30
  })

  if (y < 175) nextPage()
  y = drawSummary(page, calc, invoice, font, bold, 345, y, accentRGB, true)
  if (y > 100) y = drawPaymentAndTerms(page, invoice, font, bold, LEFT, y, accentRGB)
  drawFooter(page, font)
}
