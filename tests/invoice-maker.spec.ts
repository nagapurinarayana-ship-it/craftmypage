import { test, expect } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'

test.describe('Invoice Maker production export validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/invoice-maker')
    await page.waitForLoadState('domcontentloaded')
  })

  async function createInvoice(page: import('@playwright/test').Page) {
    await page.getByPlaceholder('Your business name').fill('CraftMyPage Demo Studio')
    await page.getByPlaceholder('Customer or company name').fill('Production Test Customer')
    await page.getByPlaceholder('Item or service description').fill('Design and consulting services')
    await page.locator('input[type="number"][placeholder="0.00"]').last().fill('12500')
  }

  test('creates a real invoice and downloads exactly one PDF page for a normal invoice', async ({ page }) => {
    await createInvoice(page)
    await expect(page.getByText('CraftMyPage Demo Studio').first()).toBeVisible()
    await expect(page.getByText('Production Test Customer').first()).toBeVisible()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download PDF' }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i)

    const bytes = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of bytes!) chunks.push(Buffer.from(chunk))
    const pdf = await PDFDocument.load(Buffer.concat(chunks))
    expect(pdf.getPageCount()).toBe(1)
  })

  test('prints only the invoice document and keeps a normal invoice to one A4 page', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Playwright PDF printing is Chromium-only')
    await createInvoice(page)

    await page.emulateMedia({ media: 'print' })
    const printed = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' } })
    const pdf = await PDFDocument.load(printed)
    expect(pdf.getPageCount()).toBe(1)

    const printText = await page.locator('.invoice-print-page').first().innerText()
    expect(printText).toContain('CraftMyPage Demo Studio')
    expect(printText).toContain('Production Test Customer')
  })

  test('paginates long invoices instead of overflowing a page', async ({ page }) => {
    test.setTimeout(120_000)

    for (let i = 0; i < 30; i += 1) {
      const descriptions = page.getByPlaceholder('Item or service description')
      await descriptions.last().fill(`Production item ${i + 1}`)
      await page.locator('input[type="number"][placeholder="0.00"]').last().fill(String((i + 1) * 100))
      if (i < 29) await page.getByRole('button', { name: '+ Add Line Item' }).click()
    }

    const downloadPromise = page.waitForEvent('download', { timeout: 90_000 })
    await page.getByRole('button', { name: 'Download PDF' }).click()
    const download = await downloadPromise
    const bytes = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of bytes!) chunks.push(Buffer.from(chunk))
    const pdf = await PDFDocument.load(Buffer.concat(chunks))
    expect(pdf.getPageCount()).toBeGreaterThan(1)
  })

  test('exports INR invoices without WinAnsi encoding failures', async ({ page }) => {
    await createInvoice(page)
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download PDF' }).click()
    const download = await downloadPromise
    const bytes = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of bytes!) chunks.push(Buffer.from(chunk))
    const pdf = await PDFDocument.load(Buffer.concat(chunks))
    expect(pdf.getPageCount()).toBe(1)
  })
})
