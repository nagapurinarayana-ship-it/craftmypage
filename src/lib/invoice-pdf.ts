import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { Invoice, Currency } from './invoice'
import { getCurrencyConfig } from './invoice'
import { calculateInvoice, calculateLineItemAmount } from './invoice-calculator'

function formatPdfCurrency(amount: number, currency: Currency): string {
  const config = getCurrencyConfig(currency)
  const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: config.decimalPlaces, maximumFractionDigits: config.decimalPlaces }).format(Math.max(0, amount))
  return `${currency} ${formatted}`
}

function safeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function sanitizeFileName(value: string): string {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')
  return cleaned || 'invoice'
}

export async function generateInvoicePDF(invoice: Invoice): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const calc = calculateInvoice(invoice)
  if (invoice.template === 'professional') await renderProfessionalPDF(pdfDoc, invoice, calc)
  else if (invoice.template === 'minimal') await renderMinimalPDF(pdfDoc, invoice, calc)
  else await renderModernPDF(pdfDoc, invoice, calc)
  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes.buffer], { type: 'application/pdf' })
}

function addContinuationHeader(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, y: number): number {
  page.drawText(`${safeText(invoice.invoiceDetails.title)} — continued`, { x: 50, y, size: 13, font: bold, color: stringToRGB(invoice.accentColor) })
  page.drawText(`# ${safeText(invoice.invoiceDetails.invoiceNumber)}`, { x: 450, y, size: 9, font, color: rgb(0.45, 0.45, 0.45) })
  return y - 28
}

function drawKeyValue(page: PDFPage, label: string, value: string, x: number, y: number, font: PDFFont, bold: PDFFont) {
  if (!value) return
  page.drawText(label, { x, y, size: 8, font, color: rgb(0.42, 0.42, 0.42) })
  page.drawText(value, { x, y: y - 12, size: 9, font: bold })
}

function drawPaymentBlock(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, x: number, y: number): number {
  const payment = invoice.paymentInfo
  const lines: string[] = []
  if (payment.bankName) lines.push(`Bank: ${safeText(payment.bankName)}`)
  if (payment.accountNumber) lines.push(`Account: ${safeText(payment.accountNumber)}`)
  if (payment.ifscCode) lines.push(`IFSC: ${safeText(payment.ifscCode).toUpperCase()}`)
  if (payment.upiId) lines.push(`UPI: ${safeText(payment.upiId).toUpperCase()}`)
  if (payment.instructions) lines.push(`Instructions: ${safeText(payment.instructions)}`)
  if (!lines.length) return y

  page.drawText('Payment Details', { x, y, size: 10, font: bold, color: stringToRGB(invoice.accentColor) })
  let cursor = y - 16
  for (const line of lines.slice(0, 8)) {
    page.drawText(line.substring(0, 80), { x, y: cursor, size: 8, font, color: rgb(0.35, 0.35, 0.35) })
    cursor -= 12
  }
  return cursor - 4
}

function drawTermsBlock(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, x: number, y: number): number {
  let cursor = y
  if (invoice.paymentInfo.notes) {
    page.drawText('Notes', { x, y: cursor, size: 9, font: bold })
    cursor -= 13
    page.drawText(safeText(invoice.paymentInfo.notes).substring(0, 120), { x, y: cursor, size: 8, font, color: rgb(0.38, 0.38, 0.38) })
    cursor -= 15
  }
  if (invoice.paymentInfo.termsAndConditions) {
    page.drawText('Terms & Conditions', { x, y: cursor, size: 9, font: bold })
    cursor -= 13
    page.drawText(safeText(invoice.paymentInfo.termsAndConditions).substring(0, 120), { x, y: cursor, size: 8, font, color: rgb(0.38, 0.38, 0.38) })
    cursor -= 15
  }
  return cursor
}

async function renderProfessionalPDF(pdfDoc: PDFDocument, invoice: Invoice, calc: ReturnType<typeof calculateInvoice>) {
  const pageSize: [number, number] = [595, 842]
  let page = pdfDoc.addPage(pageSize)
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  const accentRGB = stringToRGB(invoice.accentColor)
  let yPos = 750

  page.drawText(safeText(invoice.business.name), { x: 50, y: yPos, size: 28, font: timesBold, color: accentRGB })
  page.drawText(safeText(invoice.invoiceDetails.title), { x: 450, y: yPos, size: 24, font: timesBold })
  page.drawText(`# ${safeText(invoice.invoiceDetails.invoiceNumber)}`, { x: 450, y: yPos - 25, size: 11, font: timesRoman, color: rgb(0.4, 0.4, 0.4) })
  if (invoice.invoiceDetails.referenceNumber) page.drawText(`Ref: ${safeText(invoice.invoiceDetails.referenceNumber)}`, { x: 450, y: yPos - 41, size: 9, font: timesRoman, color: rgb(0.45, 0.45, 0.45) })
  yPos -= 60

  page.drawText('From:', { x: 50, y: yPos, size: 10, font: timesBold })
  const businessInfo = [invoice.business.name, invoice.business.address, invoice.business.city ? `${invoice.business.city}${invoice.business.state ? ', ' + invoice.business.state : ''}${invoice.business.postalCode ? ' ' + invoice.business.postalCode : ''}` : '', invoice.business.country, invoice.business.phone, invoice.business.email, invoice.business.website, invoice.business.taxId ? `Tax ID: ${invoice.business.taxId}` : ''].filter(Boolean)
  businessInfo.forEach((line, i) => page.drawText(safeText(line), { x: 50, y: yPos - 15 - i * 12, size: 10, font: timesRoman }))
  page.drawText('Bill To:', { x: 350, y: yPos, size: 10, font: timesBold })
  const customerInfo = [invoice.customer.name, invoice.customer.billingAddress, invoice.customer.billingCity ? `${invoice.customer.billingCity}${invoice.customer.billingState ? ', ' + invoice.customer.billingState : ''}${invoice.customer.billingPostalCode ? ' ' + invoice.customer.billingPostalCode : ''}` : '', invoice.customer.billingCountry, invoice.customer.phone, invoice.customer.email, invoice.customer.taxId ? `Tax ID: ${invoice.customer.taxId}` : ''].filter(Boolean)
  customerInfo.forEach((line, i) => page.drawText(safeText(line), { x: 350, y: yPos - 15 - i * 12, size: 10, font: timesRoman }))

  yPos -= 108
  page.drawRectangle({ x: 50, y: yPos - 60, width: 495, height: 60, borderColor: accentRGB, borderWidth: 1 })
  const metaItems = [['Issue Date', invoice.invoiceDetails.issueDate], ['Due Date', invoice.invoiceDetails.dueDate], ['Currency', invoice.invoiceDetails.currency], ['Terms', invoice.invoiceDetails.paymentTerms]]
  metaItems.forEach((item, i) => drawKeyValue(page, item[0], item[1], 70 + i * 120, yPos - 18, timesRoman, timesBold))
  yPos -= 78

  if (invoice.invoiceDetails.projectPeriod) {
    drawKeyValue(page, 'Project / Service Period', safeText(invoice.invoiceDetails.projectPeriod), 50, yPos, timesRoman, timesBold)
    yPos -= 32
  }

  if (invoice.settings.taxMode === 'india-gst' && invoice.settings.gst) {
    const gst = invoice.settings.gst
    page.drawText('GST Details', { x: 50, y: yPos, size: 10, font: timesBold, color: accentRGB })
    yPos -= 15
    const gstItems = [
      ['Supplier GSTIN', gst.supplierGSTIN ? gst.supplierGSTIN.toUpperCase() : ''],
      ['Customer GSTIN', gst.customerGSTIN ? gst.customerGSTIN.toUpperCase() : ''],
      ['Place of Supply', gst.placeOfSupply],
      ['Supply Type', gst.purpose === 'intra-state' ? 'Intra-state' : 'Inter-state'],
    ].filter(([, value]) => value)
    gstItems.forEach((item, i) => drawKeyValue(page, item[0], item[1], 50 + (i % 2) * 250, yPos, timesRoman, timesBold))
    yPos -= gstItems.length > 2 ? 34 : 22
  }

  const tableX = 50
  const tableWidth = 495
  const colWidths = [0.43, 0.12, 0.12, 0.13, 0.20]
  const drawTableHeader = () => {
    page.drawRectangle({ x: tableX, y: yPos - 30, width: tableWidth, height: 25, color: accentRGB })
    let currentX = tableX + 10
    ;['Description', 'Qty', 'Unit', 'Rate', 'Amount'].forEach((header, i) => { page.drawText(header, { x: currentX, y: yPos - 22, size: 9, font: timesBold, color: rgb(1, 1, 1) }); currentX += tableWidth * colWidths[i] })
    yPos -= 35
  }
  drawTableHeader()

  invoice.lineItems.forEach((item) => {
    if (yPos < 90) { page = pdfDoc.addPage(pageSize); yPos = 760; yPos = addContinuationHeader(page, invoice, timesRoman, timesBold, yPos); drawTableHeader() }
    const itemAmount = calculateLineItemAmount(item)
    page.drawText(safeText(item.description || 'Item').substring(0, 36), { x: tableX + 10, y: yPos, size: 8.5, font: timesRoman })
    page.drawText(String(item.quantity), { x: tableX + tableWidth * colWidths[0] + 10, y: yPos, size: 8.5, font: timesRoman })
    page.drawText(safeText(item.unit || 'pcs').substring(0, 10), { x: tableX + tableWidth * (colWidths[0] + colWidths[1]) + 10, y: yPos, size: 8.5, font: timesRoman })
    page.drawText(formatPdfCurrency(item.unitPrice, invoice.invoiceDetails.currency), { x: tableX + tableWidth * (colWidths[0] + colWidths[1] + colWidths[2]) + 6, y: yPos, size: 8.5, font: timesRoman })
    page.drawText(formatPdfCurrency(itemAmount, invoice.invoiceDetails.currency), { x: tableX + tableWidth * (colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]) + 6, y: yPos, size: 8.5, font: timesRoman })
    yPos -= 20
  })

  if (yPos < 180) { page = pdfDoc.addPage(pageSize); yPos = 780; yPos = addContinuationHeader(page, invoice, timesRoman, timesBold, yPos) }
  const summaryX = tableX + tableWidth - 200
  page.drawText(`Subtotal: ${formatPdfCurrency(calc.subtotal, invoice.invoiceDetails.currency)}`, { x: summaryX, y: yPos, size: 10, font: timesRoman }); yPos -= 15
  if (calc.discountAmount > 0) { page.drawText(`Discount: -${formatPdfCurrency(calc.discountAmount, invoice.invoiceDetails.currency)}`, { x: summaryX, y: yPos, size: 10, font: timesRoman }); yPos -= 15 }
  Object.entries(calc.taxBreakdown).forEach(([label, value]) => { page.drawText(`${label}: ${formatPdfCurrency(value, invoice.invoiceDetails.currency)}`, { x: summaryX, y: yPos, size: 9, font: timesRoman }); yPos -= 14 })
  page.drawLine({ start: { x: summaryX, y: yPos + 5 }, end: { x: summaryX + 200, y: yPos + 5 }, thickness: 1, color: accentRGB })
  page.drawText(`TOTAL DUE: ${formatPdfCurrency(calc.balanceDue, invoice.invoiceDetails.currency)}`, { x: summaryX, y: yPos - 15, size: 14, font: timesBold, color: accentRGB })
  yPos -= 38

  if (yPos > 130) yPos = drawPaymentBlock(page, invoice, timesRoman, timesBold, 50, yPos)
  if (yPos > 90) yPos = drawTermsBlock(page, invoice, timesRoman, timesBold, 50, yPos)
  if (invoice.paymentInfo.thankYouMessage && yPos > 60) page.drawText(safeText(invoice.paymentInfo.thankYouMessage).substring(0, 100), { x: 50, y: yPos, size: 8, font: timesRoman, color: rgb(0.4, 0.4, 0.4) })
  page.drawText('Generated with CraftMyPage — Free invoice maker', { x: 50, y: 20, size: 8, font: timesRoman, color: rgb(0.6, 0.6, 0.6) })
}

async function renderMinimalPDF(pdfDoc: PDFDocument, invoice: Invoice, calc: ReturnType<typeof calculateInvoice>) {
  const pageSize: [number, number] = [595, 842]
  let page = pdfDoc.addPage(pageSize)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  let yPos = 750
  const nextPage = () => { page = pdfDoc.addPage(pageSize); yPos = 760; page.drawText(`${invoice.invoiceDetails.title} — continued`, { x: 50, y: yPos, size: 13, font: helveticaBold, color: stringToRGB(invoice.accentColor) }); yPos -= 28 }
  page.drawText(invoice.business.name, { x: 50, y: yPos, size: 24, font: helveticaBold }); page.drawText(invoice.invoiceDetails.title, { x: 450, y: yPos, size: 20, font: helveticaBold }); page.drawText(invoice.invoiceDetails.invoiceNumber, { x: 450, y: yPos - 25, size: 10, font: helvetica, color: rgb(0.5, 0.5, 0.5) }); yPos -= 60
  page.drawText('From', { x: 50, y: yPos, size: 10, font: helveticaBold }); page.drawText(invoice.business.name, { x: 50, y: yPos - 15, size: 10, font: helvetica }); if (invoice.business.email) page.drawText(invoice.business.email, { x: 50, y: yPos - 28, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.5) }); page.drawText('To', { x: 350, y: yPos, size: 10, font: helveticaBold }); page.drawText(invoice.customer.name, { x: 350, y: yPos - 15, size: 10, font: helvetica }); yPos -= 100
  page.drawText('Issued', { x: 50, y: yPos, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.5) }); page.drawText(invoice.invoiceDetails.issueDate, { x: 50, y: yPos - 12, size: 10, font: helveticaBold }); page.drawText('Due', { x: 350, y: yPos, size: 9, font: helvetica, color: rgb(0.5, 0.5, 0.5) }); page.drawText(invoice.invoiceDetails.dueDate, { x: 350, y: yPos - 12, size: 10, font: helveticaBold }); yPos -= 50
  invoice.lineItems.forEach((item) => { if (yPos < 90) nextPage(); const itemAmount = calculateLineItemAmount(item); page.drawText((item.description || 'Item').substring(0, 60), { x: 50, y: yPos, size: 10, font: helveticaBold }); page.drawText(formatPdfCurrency(itemAmount, invoice.invoiceDetails.currency), { x: 500, y: yPos, size: 10, font: helveticaBold }); page.drawText(`${item.quantity} × ${formatPdfCurrency(item.unitPrice, invoice.invoiceDetails.currency)}`, { x: 50, y: yPos - 12, size: 9, font: helvetica, color: rgb(0.6, 0.6, 0.6) }); yPos -= 30 })
  if (yPos < 120) nextPage()
  page.drawText(`Total: ${formatPdfCurrency(calc.grandTotal, invoice.invoiceDetails.currency)}`, { x: 380, y: yPos, size: 14, font: helveticaBold }); page.drawText('Created with CraftMyPage', { x: 50, y: 20, size: 8, font: helvetica, color: rgb(0.7, 0.7, 0.7) })
}

async function renderModernPDF(pdfDoc: PDFDocument, invoice: Invoice, calc: ReturnType<typeof calculateInvoice>) {
  const pageSize: [number, number] = [595, 842]
  let page = pdfDoc.addPage(pageSize)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const accentRGB = stringToRGB(invoice.accentColor)
  page.drawRectangle({ x: 0, y: 700, width: 595, height: 100, color: accentRGB }); page.drawText(invoice.business.name, { x: 50, y: 770, size: 24, font: helveticaBold, color: rgb(1, 1, 1) }); page.drawText(invoice.invoiceDetails.title, { x: 450, y: 770, size: 18, font: helveticaBold, color: rgb(1, 1, 1) }); page.drawText(invoice.invoiceDetails.invoiceNumber, { x: 450, y: 750, size: 10, font: helvetica, color: rgb(1, 1, 1) })
  let yPos = 680; const col1 = 50; const col2 = 350
  page.drawText('From', { x: col1, y: yPos, size: 10, font: helveticaBold }); page.drawText(invoice.business.name, { x: col1, y: yPos - 15, size: 9, font: helvetica }); if (invoice.business.email) page.drawText(invoice.business.email, { x: col1, y: yPos - 27, size: 9, font: helvetica }); page.drawText('To', { x: col2, y: yPos, size: 10, font: helveticaBold }); page.drawText(invoice.customer.name, { x: col2, y: yPos - 15, size: 9, font: helvetica }); yPos -= 80
  page.drawText('Issue Date', { x: col1, y: yPos, size: 8, font: helvetica, color: rgb(0.6, 0.6, 0.6) }); page.drawText(invoice.invoiceDetails.issueDate, { x: col1, y: yPos - 10, size: 9, font: helveticaBold }); page.drawText('Due Date', { x: col2, y: yPos, size: 8, font: helvetica, color: rgb(0.6, 0.6, 0.6) }); page.drawText(invoice.invoiceDetails.dueDate, { x: col2, y: yPos - 10, size: 9, font: helveticaBold }); yPos -= 50
  invoice.lineItems.forEach((item) => { if (yPos < 90) { page = pdfDoc.addPage(pageSize); yPos = 760; page.drawText(`${invoice.invoiceDetails.title} — continued`, { x: 50, y: yPos, size: 13, font: helveticaBold, color: accentRGB }); yPos -= 28 } const itemAmount = calculateLineItemAmount(item); page.drawText((item.description || 'Item').substring(0, 48), { x: col1, y: yPos, size: 10, font: helvetica }); page.drawText(formatPdfCurrency(itemAmount, invoice.invoiceDetails.currency), { x: 500, y: yPos, size: 10, font: helveticaBold }); yPos -= 22 })
  if (yPos < 140) { page = pdfDoc.addPage(pageSize); yPos = 760; page.drawText(`${invoice.invoiceDetails.title} — continued`, { x: 50, y: yPos, size: 13, font: helveticaBold, color: accentRGB); yPos -= 28 }
  page.drawText(`Subtotal: ${formatPdfCurrency(calc.subtotal, invoice.invoiceDetails.currency)}`, { x: 360, y: yPos, size: 10, font: helvetica }); yPos -= 15
  if (calc.discountAmount > 0) { page.drawText(`Discount: -${formatPdfCurrency(calc.discountAmount, invoice.invoiceDetails.currency)}`, { x: 360, y: yPos, size: 10, font: helvetica }); yPos -= 15 }
  if (calc.taxAmount > 0) { page.drawText(`Tax: ${formatPdfCurrency(calc.taxAmount, invoice.invoiceDetails.currency)}`, { x: 360, y: yPos, size: 10, font: helvetica }); yPos -= 15 }
  page.drawText(`TOTAL: ${formatPdfCurrency(calc.grandTotal, invoice.invoiceDetails.currency)}`, { x: 360, y: yPos - 10, size: 14, font: helveticaBold, color: accentRGB })
  page.drawText('Created with CraftMyPage', { x: 50, y: 20, size: 8, font: helvetica, color: rgb(0.7, 0.7, 0.7) })
}

function stringToRGB(hex: string) {
  const cleaned = hex.replace('#', '')
  const bigint = parseInt(cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned, 16)
  return rgb(((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255)
}
