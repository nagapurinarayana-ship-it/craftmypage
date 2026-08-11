import { PDFDocument, PDFPage, StandardFonts, rgb } from 'pdf-lib'
import type { Invoice } from '../lib/invoice'
import { formatCurrency, getCurrencyConfig } from '../lib/invoice'
import { calculateInvoice } from '../lib/invoice-calculator'

export async function generateInvoicePDF(invoice: Invoice): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const pageWidth = 595 // A4 width in points
  const pageHeight = 842 // A4 height in points

  const calc = calculateInvoice(invoice)

  // We'll generate based on template type
  if (invoice.template === 'professional') {
    await renderProfessionalPDF(pdfDoc, invoice, calc)
  } else if (invoice.template === 'minimal') {
    await renderMinimalPDF(pdfDoc, invoice, calc)
  } else {
    await renderModernPDF(pdfDoc, invoice, calc)
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes.buffer], { type: 'application/pdf' })
}

async function renderProfessionalPDF(
  pdfDoc: PDFDocument,
  invoice: Invoice,
  calc: ReturnType<typeof calculateInvoice>
) {
  const page = pdfDoc.addPage([595, 842])
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  let yPos = 750

  // Header
  page.drawText(invoice.business.name, {
    x: 50,
    y: yPos,
    size: 28,
    font: timesBold,
    color: stringToRGB(invoice.accentColor),
  })

  yPos -= 40

  page.drawText(invoice.invoiceDetails.title, {
    x: 450,
    y: yPos,
    size: 24,
    font: timesBold,
  })

  page.drawText(`# ${invoice.invoiceDetails.invoiceNumber}`, {
    x: 450,
    y: yPos - 25,
    size: 11,
    font: timesRoman,
    color: rgb(0.4, 0.4, 0.4),
  })

  yPos -= 60

  // Business and Customer Info
  page.drawText('From:', {
    x: 50,
    y: yPos,
    size: 10,
    font: timesBold,
  })

  const businessInfo = [
    invoice.business.name,
    invoice.business.address,
    `${invoice.business.city}${invoice.business.state ? ', ' + invoice.business.state : ''}`,
    invoice.business.phone,
    invoice.business.email,
  ].filter(Boolean)

  businessInfo.forEach((line, i) => {
    page.drawText(line, {
      x: 50,
      y: yPos - 15 - i * 12,
      size: 10,
      font: timesRoman,
    })
  })

  page.drawText('Bill To:', {
    x: 350,
    y: yPos,
    size: 10,
    font: timesBold,
  })

  const customerInfo = [
    invoice.customer.name,
    invoice.customer.billingAddress,
    `${invoice.customer.billingCity}${invoice.customer.billingState ? ', ' + invoice.customer.billingState : ''}`,
    invoice.customer.phone,
    invoice.customer.email,
  ].filter(Boolean)

  customerInfo.forEach((line, i) => {
    page.drawText(line, {
      x: 350,
      y: yPos - 15 - i * 12,
      size: 10,
      font: timesRoman,
    })
  })

  yPos -= 100

  // Invoice Details Box
  const accentRGB = stringToRGB(invoice.accentColor)
  page.drawRectangle({
    x: 50,
    y: yPos - 60,
    width: 495,
    height: 60,
    borderColor: accentRGB,
    borderWidth: 1,
  })

  const metaItems = [
    ['Issue Date', invoice.invoiceDetails.issueDate],
    ['Due Date', invoice.invoiceDetails.dueDate],
    ['Currency', invoice.invoiceDetails.currency],
    ['Terms', invoice.invoiceDetails.paymentTerms],
  ]

  metaItems.forEach((item, i) => {
    page.drawText(item[0], {
      x: 70 + i * 120,
      y: yPos - 25,
      size: 9,
      font: timesRoman,
      color: rgb(0.4, 0.4, 0.4),
    })
    page.drawText(item[1], {
      x: 70 + i * 120,
      y: yPos - 40,
      size: 10,
      font: timesBold,
    })
  })

  yPos -= 90

  // Line items table
  const tableX = 50
  const tableWidth = 495
  let colWidths = [0.5, 0.15, 0.15, 0.2]

  // Header
  page.drawRectangle({
    x: tableX,
    y: yPos - 30,
    width: tableWidth,
    height: 25,
    color: accentRGB,
  })

  const headers = ['Description', 'Qty', 'Unit Price', 'Amount']
  let currentX = tableX + 10

  headers.forEach((header, i) => {
    page.drawText(header, {
      x: currentX,
      y: yPos - 22,
      size: 10,
      font: timesBold,
      color: rgb(1, 1, 1),
    })
    currentX += tableWidth * colWidths[i]
  })

  yPos -= 35

  // Items
  invoice.lineItems.forEach((item) => {
    const itemAmount = Math.max(0, item.quantity * item.unitPrice - (item.discount || 0))

    page.drawText(item.description.substring(0, 30), {
      x: tableX + 10,
      y: yPos,
      size: 9,
      font: timesRoman,
    })

    page.drawText(String(item.quantity), {
      x: tableX + tableWidth * colWidths[0] + 10,
      y: yPos,
      size: 9,
      font: timesRoman,
    })

    page.drawText(formatCurrency(item.unitPrice, invoice.invoiceDetails.currency), {
      x: tableX + tableWidth * (colWidths[0] + colWidths[1]) + 10,
      y: yPos,
      size: 9,
      font: timesRoman,
    })

    page.drawText(formatCurrency(itemAmount, invoice.invoiceDetails.currency), {
      x: tableX + tableWidth * (colWidths[0] + colWidths[1] + colWidths[2]) + 10,
      y: yPos,
      size: 9,
      font: timesRoman,
    })

    yPos -= 20
  })

  // Summary
  yPos -= 10

  const summaryX = tableX + tableWidth - 200
  page.drawText(`Subtotal: ${formatCurrency(calc.subtotal, invoice.invoiceDetails.currency)}`, {
    x: summaryX,
    y: yPos,
    size: 10,
    font: timesRoman,
  })

  yPos -= 15

  if (calc.discountAmount > 0) {
    page.drawText(
      `Discount: -${formatCurrency(calc.discountAmount, invoice.invoiceDetails.currency)}`,
      {
        x: summaryX,
        y: yPos,
        size: 10,
        font: timesRoman,
      }
    )
    yPos -= 15
  }

  if (calc.taxAmount > 0) {
    page.drawText(`Tax: ${formatCurrency(calc.taxAmount, invoice.invoiceDetails.currency)}`, {
      x: summaryX,
      y: yPos,
      size: 10,
      font: timesRoman,
    })
    yPos -= 15
  }

  page.drawLine({
    start: { x: summaryX, y: yPos + 5 },
    end: { x: summaryX + 200, y: yPos + 5 },
    thickness: 1,
  })

  yPos -= 20

  page.drawText(
    `TOTAL: ${formatCurrency(calc.grandTotal, invoice.invoiceDetails.currency)}`,
    {
      x: summaryX,
      y: yPos,
      size: 14,
      font: timesBold,
      color: accentRGB,
    }
  )

  // Footer
  page.drawText('Generated with CraftMyPage — Free invoice maker', {
    x: 50,
    y: 20,
    size: 8,
    font: timesRoman,
    color: rgb(0.6, 0.6, 0.6),
  })
}

async function renderMinimalPDF(
  pdfDoc: PDFDocument,
  invoice: Invoice,
  calc: ReturnType<typeof calculateInvoice>
) {
  const page = pdfDoc.addPage([595, 842])
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let yPos = 750

  // Header
  page.drawText(invoice.business.name, {
    x: 50,
    y: yPos,
    size: 24,
    font: helveticaBold,
  })

  page.drawText(invoice.invoiceDetails.title, {
    x: 450,
    y: yPos,
    size: 20,
    font: helveticaBold,
  })

  page.drawText(invoice.invoiceDetails.invoiceNumber, {
    x: 450,
    y: yPos - 25,
    size: 10,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  yPos -= 60

  // Two column layout
  const col1 = 50
  const col2 = 350

  page.drawText('From', {
    x: col1,
    y: yPos,
    size: 10,
    font: helveticaBold,
  })

  page.drawText(invoice.business.name, {
    x: col1,
    y: yPos - 15,
    size: 10,
    font: helvetica,
  })

  if (invoice.business.email) {
    page.drawText(invoice.business.email, {
      x: col1,
      y: yPos - 28,
      size: 9,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    })
  }

  page.drawText('To', {
    x: col2,
    y: yPos,
    size: 10,
    font: helveticaBold,
  })

  page.drawText(invoice.customer.name, {
    x: col2,
    y: yPos - 15,
    size: 10,
    font: helvetica,
  })

  yPos -= 100

  // Dates
  page.drawText('Issued', {
    x: col1,
    y: yPos,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  page.drawText(invoice.invoiceDetails.issueDate, {
    x: col1,
    y: yPos - 12,
    size: 10,
    font: helveticaBold,
  })

  page.drawText('Due', {
    x: col2,
    y: yPos,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  page.drawText(invoice.invoiceDetails.dueDate, {
    x: col2,
    y: yPos - 12,
    size: 10,
    font: helveticaBold,
  })

  yPos -= 50

  // Items
  invoice.lineItems.forEach((item) => {
    const itemAmount = Math.max(0, item.quantity * item.unitPrice - (item.discount || 0))

    page.drawText(item.description, {
      x: col1,
      y: yPos,
      size: 10,
      font: helveticaBold,
    })

    page.drawText(formatCurrency(itemAmount, invoice.invoiceDetails.currency), {
      x: 500,
      y: yPos,
      size: 10,
      font: helveticaBold,
    })

    page.drawText(`${item.quantity} × ${formatCurrency(item.unitPrice, invoice.invoiceDetails.currency)}`, {
      x: col1,
      y: yPos - 12,
      size: 9,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    })

    yPos -= 30
  })

  yPos -= 10

  // Totals
  const totalX = 400

  page.drawText(`Total: ${formatCurrency(calc.grandTotal, invoice.invoiceDetails.currency)}`, {
    x: totalX,
    y: yPos,
    size: 14,
    font: helveticaBold,
  })

  // Footer
  page.drawText('Created with CraftMyPage', {
    x: 50,
    y: 20,
    size: 8,
    font: helvetica,
    color: rgb(0.7, 0.7, 0.7),
  })
}

async function renderModernPDF(
  pdfDoc: PDFDocument,
  invoice: Invoice,
  calc: ReturnType<typeof calculateInvoice>
) {
  const page = pdfDoc.addPage([595, 842])
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const accentRGB = stringToRGB(invoice.accentColor)

  // Top banner
  page.drawRectangle({
    x: 0,
    y: 700,
    width: 595,
    height: 100,
    color: accentRGB,
  })

  page.drawText(invoice.business.name, {
    x: 50,
    y: 770,
    size: 24,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  page.drawText(invoice.invoiceDetails.title, {
    x: 450,
    y: 770,
    size: 18,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  page.drawText(invoice.invoiceDetails.invoiceNumber, {
    x: 450,
    y: 750,
    size: 10,
    font: helvetica,
    color: rgb(1, 1, 1),
  })

  let yPos = 680

  // Contact info
  const col1 = 50
  const col2 = 350

  page.drawText('From', {
    x: col1,
    y: yPos,
    size: 10,
    font: helveticaBold,
  })

  page.drawText(invoice.business.name, {
    x: col1,
    y: yPos - 15,
    size: 9,
    font: helvetica,
  })

  if (invoice.business.email) {
    page.drawText(invoice.business.email, {
      x: col1,
      y: yPos - 27,
      size: 9,
      font: helvetica,
    })
  }

  page.drawText('To', {
    x: col2,
    y: yPos,
    size: 10,
    font: helveticaBold,
  })

  page.drawText(invoice.customer.name, {
    x: col2,
    y: yPos - 15,
    size: 9,
    font: helvetica,
  })

  yPos -= 80

  // Dates
  const dateY = yPos
  page.drawText('Issue Date', {
    x: col1,
    y: dateY,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  })

  page.drawText(invoice.invoiceDetails.issueDate, {
    x: col1,
    y: dateY - 10,
    size: 9,
    font: helveticaBold,
  })

  page.drawText('Due Date', {
    x: col2,
    y: dateY,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  })

  page.drawText(invoice.invoiceDetails.dueDate, {
    x: col2,
    y: dateY - 10,
    size: 9,
    font: helveticaBold,
  })

  yPos -= 40

  // Line items
  invoice.lineItems.forEach((item) => {
    const itemAmount = Math.max(0, item.quantity * item.unitPrice - (item.discount || 0))

    page.drawText(item.description, {
      x: col1,
      y: yPos,
      size: 9,
      font: helvetica,
    })

    page.drawText(formatCurrency(itemAmount, invoice.invoiceDetails.currency), {
      x: 450,
      y: yPos,
      size: 9,
      font: helveticaBold,
    })

    yPos -= 20
  })

  yPos -= 20

  // Summary box
  page.drawRectangle({
    x: 350,
    y: yPos - 60,
    width: 195,
    height: 60,
    color: accentRGB,
  })

  page.drawText('TOTAL', {
    x: 360,
    y: yPos - 20,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  page.drawText(formatCurrency(calc.grandTotal, invoice.invoiceDetails.currency), {
    x: 360,
    y: yPos - 40,
    size: 16,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  // Footer
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595,
    height: 40,
    color: accentRGB,
  })

  page.drawText('Thank you for your business!', {
    x: 50,
    y: 10,
    size: 10,
    font: helvetica,
    color: rgb(1, 1, 1),
  })
}

// Helper to convert hex color to RGB
function stringToRGB(hex: string): ReturnType<typeof rgb> {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return rgb(r, g, b)
}

export function sanitizeFileName(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50)
}
