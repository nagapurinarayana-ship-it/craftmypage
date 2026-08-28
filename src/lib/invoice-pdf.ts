import { PDFDocument, PDFName, PDFString, StandardFonts, rgb, type PDFFont, type PDFPage, type PDFImage } from 'pdf-lib'
import type { Invoice, Currency, InvoiceCalculations } from './invoice'
import { getCurrencyConfig } from './invoice'
import { calculateInvoice, calculateLineItemAmount } from './invoice-calculator'

const PAGE_SIZE: [number, number] = [595, 842]
const LEFT = 50
const RIGHT = 545
const CONTENT_WIDTH = RIGHT - LEFT

function formatPdfCurrency(amount: number, currency: Currency): string {
  const config = getCurrencyConfig(currency)
  const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: config.decimalPlaces, maximumFractionDigits: config.decimalPlaces }).format(Math.max(0, amount))
  return `${currency} ${formatted}`
}
function safeText(value: string | undefined | null): string { return String(value ?? '').replace(/\s+/g, ' ').trim() }
export function sanitizeFileName(value: string): string { const cleaned = value.trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, ''); return cleaned || 'invoice' }

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
  pdfDoc.catalog.set(PDFName.of('Lang'), PDFString.of('en-US'))
  if (invoice.template === 'professional') await renderProfessionalPDF(pdfDoc, invoice, calc)
  else if (invoice.template === 'minimal') await renderMinimalPDF(pdfDoc, invoice, calc)
  else await renderModernPDF(pdfDoc, invoice, calc)
  addPageNumbers(pdfDoc, invoice)
  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes.buffer], { type: 'application/pdf' })
}

async function embedInvoiceLogo(pdfDoc: PDFDocument, source: string | null | undefined): Promise<PDFImage | null> {
  if (!source || !source.startsWith('data:image/')) return null
  try {
    const comma = source.indexOf(',')
    if (comma < 0) return null
    const mime = source.slice(5, comma).split(';')[0].toLowerCase()
    const encoded = source.slice(comma + 1)
    const binary = atob(encoded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    if (mime === 'image/png') return await pdfDoc.embedPng(bytes)
    if (mime === 'image/jpeg' || mime === 'image/jpg') return await pdfDoc.embedJpg(bytes)
    if (mime === 'image/webp') {
      const image = new Image()
      image.src = source
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth || image.width
      canvas.height = image.naturalHeight || image.height
      const context = canvas.getContext('2d')
      if (!context) return null
      context.drawImage(image, 0, 0)
      const png = canvas.toDataURL('image/png')
      const pngBinary = atob(png.slice(png.indexOf(',') + 1))
      const pngBytes = Uint8Array.from(pngBinary, (char) => char.charCodeAt(0))
      return await pdfDoc.embedPng(pngBytes)
    }
  } catch {
    return null
  }
  return null
}

function drawInvoiceLogo(page: PDFPage, logo: PDFImage | null, x: number, y: number, maxWidth: number, maxHeight: number) {
  if (!logo) return
  const scale = Math.min(maxWidth / logo.width, maxHeight / logo.height)
  const width = logo.width * scale
  const height = logo.height * scale
  page.drawImage(logo, { x, y: y + (maxHeight - height) / 2, width, height })
}

function stringToRGB(hex: string) {
  const cleaned = safeText(hex).replace('#', '')
  const normalized = cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned
  const bigint = parseInt(normalized || '2563eb', 16)
  return rgb(((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255)
}
function drawContinuationHeader(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, y: number, accentRGB = stringToRGB(invoice.accentColor)): number {
  page.drawText(`${safeText(invoice.invoiceDetails.title) || 'Invoice'} — continued`, { x: LEFT, y, size: 13, font: bold, color: accentRGB })
  page.drawText(`# ${safeText(invoice.invoiceDetails.invoiceNumber) || 'Draft'}`, { x: 450, y, size: 9, font, color: rgb(0.45, 0.45, 0.45) })
  return y - 28
}
function drawKeyValue(page: PDFPage, label: string, value: string, x: number, y: number, font: PDFFont, bold: PDFFont) {
  const clean = safeText(value); if (!clean) return
  page.drawText(label, { x, y, size: 8, font, color: rgb(0.42, 0.42, 0.42) })
  page.drawText(clean.substring(0, 48), { x, y: y - 12, size: 9, font: bold })
}
function drawRightAlignedText(page: PDFPage, text: string, right: number, y: number, size: number, font: PDFFont, color = rgb(0.12, 0.12, 0.12)) {
  page.drawText(text, { x: right - font.widthOfTextAtSize(text, size), y, size, font, color })
}
function businessLines(invoice: Invoice): string[] { return [invoice.business.name, invoice.business.contactPerson ? `Attn: ${invoice.business.contactPerson}` : '', invoice.business.address, invoice.business.city ? `${invoice.business.city}${invoice.business.state ? `, ${invoice.business.state}` : ''}${invoice.business.postalCode ? ` ${invoice.business.postalCode}` : ''}` : '', invoice.business.country, invoice.business.phone, invoice.business.email, invoice.business.website, invoice.business.taxId ? `Tax ID: ${invoice.business.taxId}` : ''].map(safeText).filter(Boolean) }
function customerLines(invoice: Invoice): string[] { return [invoice.customer.name, invoice.customer.contactPerson ? `Attn: ${invoice.customer.contactPerson}` : '', invoice.customer.billingAddress, invoice.customer.billingCity ? `${invoice.customer.billingCity}${invoice.customer.billingState ? `, ${invoice.customer.billingState}` : ''}${invoice.customer.billingPostalCode ? ` ${invoice.customer.billingPostalCode}` : ''}` : '', invoice.customer.billingCountry, invoice.customer.phone, invoice.customer.email, invoice.customer.taxId ? `Tax ID: ${invoice.customer.taxId}` : ''].map(safeText).filter(Boolean) }
function drawPartyBlock(page: PDFPage, title: string, lines: string[], x: number, y: number, font: PDFFont, bold: PDFFont, maxLines = 8) { page.drawText(title, { x, y, size: 10, font: bold }); lines.slice(0, maxLines).forEach((line, index) => page.drawText(line.substring(0, 52), { x, y: y - 15 - index * 12, size: 9, font, color: index === 0 ? rgb(0.12, 0.12, 0.12) : rgb(0.38, 0.38, 0.38) })) }
function drawInvoiceMeta(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, y: number, accentRGB: ReturnType<typeof stringToRGB>, bordered = true): number {
  const items = [['Issue Date', invoice.invoiceDetails.issueDate], ['Due Date', invoice.invoiceDetails.dueDate], ['Currency', invoice.invoiceDetails.currency], ['Payment Terms', invoice.invoiceDetails.paymentTerms]]
  if (bordered) page.drawRectangle({ x: LEFT, y: y - 60, width: CONTENT_WIDTH, height: 60, borderColor: accentRGB, borderWidth: 1 })
  items.forEach((item, index) => drawKeyValue(page, item[0], item[1], LEFT + 20 + index * 120, y - 18, font, bold))
  return y - 78
}
function drawGstBlock(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, y: number, accentRGB: ReturnType<typeof stringToRGB>): number {
  if (invoice.settings.taxMode !== 'india-gst' || !invoice.settings.gst) return y
  const gst = invoice.settings.gst
  page.drawText('GST Details', { x: LEFT, y, size: 10, font: bold, color: accentRGB })
  const items = [['Supplier GSTIN', gst.supplierGSTIN.toUpperCase()], ['Customer GSTIN', gst.customerGSTIN.toUpperCase()], ['Place of Supply', gst.placeOfSupply], ['Supply Type', gst.purpose === 'intra-state' ? 'Intra-state' : 'Inter-state']].filter(([, value]) => safeText(value))
  items.forEach((item, index) => drawKeyValue(page, item[0], item[1], LEFT + (index % 2) * 250, y - 15 - Math.floor(index / 2) * 34, font, bold))
  return y - (items.length > 2 ? 68 : 34)
}
function drawSummary(page: PDFPage, calc: InvoiceCalculations, invoice: Invoice, font: PDFFont, bold: PDFFont, x: number, y: number, accentRGB: ReturnType<typeof stringToRGB>, modern = false): number {
  const width = 200
  const rows: Array<[string, string]> = [['Subtotal', formatPdfCurrency(calc.subtotal, invoice.invoiceDetails.currency)]]
  if (calc.discountAmount > 0) rows.push(['Discount', `-${formatPdfCurrency(calc.discountAmount, invoice.invoiceDetails.currency)}`])
  if (calc.shippingCharge !== 0) rows.push(['Shipping', formatPdfCurrency(calc.shippingCharge, invoice.invoiceDetails.currency)])
  if (calc.adjustment !== 0) rows.push(['Adjustment', formatPdfCurrency(calc.adjustment, invoice.invoiceDetails.currency)])
  Object.entries(calc.taxBreakdown).forEach(([label, value]) => rows.push([label, formatPdfCurrency(value, invoice.invoiceDetails.currency)]))
  if (calc.amountPaid > 0) rows.push(['Paid', formatPdfCurrency(calc.amountPaid, invoice.invoiceDetails.currency)])
  const panelHeight = rows.length * 15 + 42
  page.drawRectangle({ x: x - 12, y: y - panelHeight + 10, width: width + 24, height: panelHeight, color: rgb(0.97, 0.98, 1) })
  rows.forEach(([label, value]) => {
    page.drawText(label, { x, y, size: 9, font, color: rgb(0.38, 0.42, 0.5) })
    drawRightAlignedText(page, value, x + width, y, 9, font)
    y -= 15
  })
  page.drawLine({ start: { x, y: y + 5 }, end: { x: x + width, y: y + 5 }, thickness: 1.5, color: accentRGB })
  page.drawText(modern ? 'TOTAL' : 'TOTAL DUE', { x, y: y - 16, size: 11, font: bold, color: accentRGB })
  drawRightAlignedText(page, formatPdfCurrency(calc.balanceDue, invoice.invoiceDetails.currency), x + width, y - 17, modern ? 14 : 13, bold, accentRGB)
  return y - 40
}
function drawPaymentAndTerms(page: PDFPage, invoice: Invoice, font: PDFFont, bold: PDFFont, x: number, y: number, accentRGB: ReturnType<typeof stringToRGB>): number {
  let cursor = y; const payment = invoice.paymentInfo
  const paymentLines = [payment.bankName ? `Bank: ${safeText(payment.bankName)}` : '', payment.accountNumber ? `Account: ${safeText(payment.accountNumber)}` : '', payment.ifscCode ? `IFSC: ${safeText(payment.ifscCode).toUpperCase()}` : '', payment.upiId ? `UPI: ${safeText(payment.upiId).toUpperCase()}` : '', payment.instructions ? `Instructions: ${safeText(payment.instructions)}` : ''].filter(Boolean)
  if (paymentLines.length) { page.drawText('Payment Details', { x, y: cursor, size: 10, font: bold, color: accentRGB }); cursor -= 16; paymentLines.slice(0, 7).forEach((line) => { page.drawText(line.substring(0, 80), { x, y: cursor, size: 8, font, color: rgb(0.35, 0.35, 0.35) }); cursor -= 12 }); cursor -= 4 }
  if (payment.notes) { page.drawText('Notes', { x, y: cursor, size: 9, font: bold }); cursor -= 13; page.drawText(safeText(payment.notes).substring(0, 120), { x, y: cursor, size: 8, font, color: rgb(0.38, 0.38, 0.38) }); cursor -= 15 }
  if (payment.termsAndConditions) { page.drawText('Terms & Conditions', { x, y: cursor, size: 9, font: bold }); cursor -= 13; page.drawText(safeText(payment.termsAndConditions).substring(0, 120), { x, y: cursor, size: 8, font, color: rgb(0.38, 0.38, 0.38) }); cursor -= 15 }
  if (payment.signatureField) { page.drawText(payment.signatureField.substring(0, 80), { x, y: cursor, size: 8, font: bold, color: rgb(0.38, 0.38, 0.38) }); cursor -= 14 }
  if (payment.thankYouMessage) { page.drawText(safeText(payment.thankYouMessage).substring(0, 100), { x, y: cursor, size: 8, font, color: rgb(0.4, 0.4, 0.4) }); cursor -= 14 }
  return cursor
}
function hasPaymentAndTerms(invoice: Invoice): boolean {
  const payment = invoice.paymentInfo
  return Boolean(payment.bankName || payment.accountNumber || payment.ifscCode || payment.upiId || payment.instructions || payment.notes || payment.termsAndConditions || payment.signatureField || payment.thankYouMessage)
}
function drawFooter(page: PDFPage, font: PDFFont, invoice: Invoice) {
  if (!invoice.showBranding) return
  page.drawText('Created with CraftMyPage', { x: LEFT, y: 20, size: 7, font, color: rgb(0.72, 0.72, 0.72) })
}
function addPageNumbers(pdfDoc: PDFDocument, invoice: Invoice) {
  const pages = pdfDoc.getPages()
  pages.forEach((page, index) => {
    if (pages.length === 1 && !invoice.showBranding) return
    const label = `Page ${index + 1} of ${pages.length}`
    page.drawText(label, { x: 280, y: 20, size: 7, color: rgb(0.62, 0.62, 0.62) })
  })
}

async function renderProfessionalPDF(pdfDoc: PDFDocument, invoice: Invoice, calc: InvoiceCalculations) {
  let page = pdfDoc.addPage(PAGE_SIZE)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const accentRGB = stringToRGB(invoice.accentColor)
  const logo = await embedInvoiceLogo(pdfDoc, invoice.business.logo)
  let y = 710
  drawInvoiceLogo(page, logo, LEFT, 735, 56, 40)
  page.drawText(safeText(invoice.business.name) || 'Invoice', { x: LEFT, y, size: 28, font: bold, color: accentRGB })
  page.drawText(safeText(invoice.invoiceDetails.title) || 'Invoice', { x: 450, y, size: 24, font: bold })
  page.drawText(`# ${safeText(invoice.invoiceDetails.invoiceNumber) || 'Draft'}`, { x: 450, y: y - 25, size: 11, font, color: rgb(0.4, 0.4, 0.4) })
  if (invoice.invoiceDetails.referenceNumber) page.drawText(`Ref: ${safeText(invoice.invoiceDetails.referenceNumber)}`, { x: 450, y: y - 41, size: 9, font, color: rgb(0.45, 0.45, 0.45) })
  y -= 70
  drawPartyBlock(page, 'From:', businessLines(invoice), LEFT, y, font, bold)
  drawPartyBlock(page, 'Bill To:', customerLines(invoice), 350, y, font, bold)
  y -= 108
  y = drawInvoiceMeta(page, invoice, font, bold, y, accentRGB)
  if (invoice.invoiceDetails.projectPeriod) { drawKeyValue(page, 'Project / Service Period', invoice.invoiceDetails.projectPeriod, LEFT, y, font, bold); y -= 32 }
  y = drawGstBlock(page, invoice, font, bold, y, accentRGB)

  const tableX = LEFT; const tableWidth = CONTENT_WIDTH; const colWidths = [0.43, 0.12, 0.12, 0.13, 0.20]
  const drawHeader = () => {
    page.drawRectangle({ x: tableX, y: y - 31, width: tableWidth, height: 28, color: accentRGB })
    let currentX = tableX + 10
    ;['Description', 'Qty', 'Unit', 'Rate', 'Amount'].forEach((header, index) => { page.drawText(header, { x: currentX, y: y - 20, size: 9, font: bold, color: rgb(1, 1, 1) }); currentX += tableWidth * colWidths[index] })
    y -= 43
  }
  drawHeader()
  invoice.lineItems.forEach((item) => {
    if (y < 105) { page = pdfDoc.addPage(PAGE_SIZE); y = drawContinuationHeader(page, invoice, font, bold, 760, accentRGB); drawHeader() }
    const amount = calculateLineItemAmount(item)
    page.drawText(safeText(item.description || 'Item').substring(0, 36), { x: tableX + 10, y, size: 8.5, font })
    page.drawText(String(item.quantity), { x: tableX + tableWidth * colWidths[0] + 10, y, size: 8.5, font })
    page.drawText(safeText(item.unit || 'pcs').substring(0, 10), { x: tableX + tableWidth * (colWidths[0] + colWidths[1]) + 10, y, size: 8.5, font })
    drawRightAlignedText(page, formatPdfCurrency(item.unitPrice, invoice.invoiceDetails.currency), tableX + tableWidth * (colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]) - 8, y, 8.5, font)
    drawRightAlignedText(page, formatPdfCurrency(amount, invoice.invoiceDetails.currency), RIGHT - 8, y, 8.5, font)
    page.drawLine({ start: { x: tableX, y: y - 9 }, end: { x: tableX + tableWidth, y: y - 9 }, thickness: 0.45, color: rgb(0.85, 0.85, 0.85) })
    y -= 28
  })
  y -= 10
  if (y < 180) { page = pdfDoc.addPage(PAGE_SIZE); y = drawContinuationHeader(page, invoice, font, bold, 780, accentRGB) }
  y = drawSummary(page, calc, invoice, font, bold, RIGHT - 200, y, accentRGB)
  if (hasPaymentAndTerms(invoice)) {
    if (y <= 120) { page = pdfDoc.addPage(PAGE_SIZE); y = drawContinuationHeader(page, invoice, font, bold, 780, accentRGB) }
    y = drawPaymentAndTerms(page, invoice, font, bold, LEFT, y, accentRGB)
  }
  drawFooter(page, font, invoice)
}

async function renderMinimalPDF(pdfDoc: PDFDocument, invoice: Invoice, calc: InvoiceCalculations) {
  let page = pdfDoc.addPage(PAGE_SIZE)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const accentRGB = stringToRGB(invoice.accentColor)
  const logo = await embedInvoiceLogo(pdfDoc, invoice.business.logo)
  let y = 760
  drawInvoiceLogo(page, logo, LEFT, 708, 48, 34)
  const nextPage = () => { page = pdfDoc.addPage(PAGE_SIZE); y = drawContinuationHeader(page, invoice, font, bold, 770, accentRGB) }
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
  page.drawLine({ start: { x: LEFT, y }, end: { x: RIGHT, y }, thickness: 1, color: accentRGB }); y -= 20
  page.drawText('Description', { x: LEFT, y, size: 9, font: bold }); page.drawText('Amount', { x: 475, y, size: 9, font: bold }); y -= 18
  invoice.lineItems.forEach((item) => { if (y < 120) nextPage(); const amount = calculateLineItemAmount(item); page.drawText(safeText(item.description || 'Item').substring(0, 62), { x: LEFT, y, size: 9.5, font }); page.drawText(formatPdfCurrency(amount, invoice.invoiceDetails.currency), { x: 470, y, size: 9.5, font: bold }); page.drawText(`${item.quantity} × ${formatPdfCurrency(item.unitPrice, invoice.invoiceDetails.currency)}${item.discount > 0 ? ` · discount ${item.discount}${item.discountType === 'percentage' ? '%' : ''}` : ''}`, { x: LEFT, y: y - 12, size: 8, font, color: rgb(0.55, 0.55, 0.55) }); y -= 30 })
  if (y < 170) nextPage(); y = drawSummary(page, calc, invoice, font, bold, 345, y, accentRGB); if (hasPaymentAndTerms(invoice)) { if (y <= 100) nextPage(); y = drawPaymentAndTerms(page, invoice, font, bold, LEFT, y, accentRGB) } drawFooter(page, font, invoice)
}

async function renderModernPDF(pdfDoc: PDFDocument, invoice: Invoice, calc: InvoiceCalculations) {
  let page = pdfDoc.addPage(PAGE_SIZE)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const accentRGB = stringToRGB(invoice.accentColor)
  const logo = await embedInvoiceLogo(pdfDoc, invoice.business.logo)
  let y = 680
  const nextPage = () => { page = pdfDoc.addPage(PAGE_SIZE); y = drawContinuationHeader(page, invoice, font, bold, 770, accentRGB) }
  page.drawRectangle({ x: 0, y: 700, width: 595, height: 100, color: accentRGB })
  drawInvoiceLogo(page, logo, LEFT, 748, 44, 34)
  page.drawText(safeText(invoice.business.name) || 'Invoice', { x: LEFT + 54, y: 770, size: 24, font: bold, color: rgb(1, 1, 1) })
  page.drawText(safeText(invoice.invoiceDetails.title) || 'Invoice', { x: 450, y: 770, size: 18, font: bold, color: rgb(1, 1, 1) })
  page.drawText(`# ${safeText(invoice.invoiceDetails.invoiceNumber) || 'Draft'}`, { x: 450, y: 750, size: 10, font, color: rgb(1, 1, 1) })
  y = 670
  drawPartyBlock(page, 'From', businessLines(invoice), LEFT, y, font, bold, 6); drawPartyBlock(page, 'To', customerLines(invoice), 350, y, font, bold, 6)
  y -= 92; y = drawInvoiceMeta(page, invoice, font, bold, y, accentRGB, false)
  if (invoice.invoiceDetails.projectPeriod) { page.drawText(`Project / Service Period: ${safeText(invoice.invoiceDetails.projectPeriod)}`, { x: LEFT, y, size: 8.5, font }); y -= 18 }
  y = drawGstBlock(page, invoice, font, bold, y, accentRGB)
  page.drawRectangle({ x: LEFT, y: y - 25, width: CONTENT_WIDTH, height: 25, color: accentRGB })
  page.drawText('Description', { x: LEFT + 10, y: y - 17, size: 9, font: bold, color: rgb(1, 1, 1) }); page.drawText('Amount', { x: 475, y: y - 17, size: 9, font: bold, color: rgb(1, 1, 1) }); y -= 38
  invoice.lineItems.forEach((item) => { if (y < 130) nextPage(); const amount = calculateLineItemAmount(item); page.drawText(safeText(item.description || 'Item').substring(0, 60), { x: LEFT + 10, y, size: 9.5, font }); page.drawText(formatPdfCurrency(amount, invoice.invoiceDetails.currency), { x: 470, y, size: 9.5, font: bold }); page.drawText(`${item.quantity} × ${formatPdfCurrency(item.unitPrice, invoice.invoiceDetails.currency)}${item.discount > 0 ? ` · discount ${item.discount}${item.discountType === 'percentage' ? '%' : ''}` : ''}`, { x: LEFT + 10, y: y - 12, size: 8, font, color: rgb(0.55, 0.55, 0.55) }); y -= 30 })
  if (y < 175) nextPage(); y = drawSummary(page, calc, invoice, font, bold, 345, y, accentRGB, true); if (hasPaymentAndTerms(invoice)) { if (y <= 100) nextPage(); y = drawPaymentAndTerms(page, invoice, font, bold, LEFT, y, accentRGB) } drawFooter(page, font, invoice)
}
