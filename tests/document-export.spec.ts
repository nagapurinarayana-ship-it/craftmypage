import { test, expect } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'

test.describe('Document export smoke tests', () => {
  test('invitation PDF is a single A4 page', async ({ page }) => {
    await page.goto('/tools/invitation-maker')
    await page.waitForLoadState('domcontentloaded')
    const template = page.locator('button').filter({ hasText: /Use →/ }).first()
    await expect(template).toBeVisible()
    await template.click()
    await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download PDF' }).click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
    const pdf = await PDFDocument.load(Buffer.concat(chunks))
    expect(pdf.getPageCount()).toBe(1)
    const { width, height } = pdf.getPage(0).getSize()
    expect(width).toBeCloseTo(595, 0)
    expect(height).toBeCloseTo(842, 0)
  })

  test('resume PDF is A4 and exportable after real content is entered', async ({ page }) => {
    await page.goto('/tools/resume-builder')
    await page.waitForLoadState('domcontentloaded')
    await page.getByRole('button', { name: /ATS Classic/i }).click()
    await page.getByLabel('Full name').fill('Asha Sharma')
    await page.getByLabel('Job title').fill('Senior Software Engineer')
    await page.getByLabel('Email').fill('asha@example.com')
    await page.getByPlaceholder(/2-4 sentence professional summary/i).fill('Senior software engineer delivering scalable web products with measurable customer impact.')
    await page.getByRole('button', { name: '+ Add experience' }).click()
    await page.getByLabel('Role').fill('Senior Software Engineer')
    await page.getByRole('textbox', { name: 'Company' }).fill('Example Technologies')
    await page.getByPlaceholder(/Describe your role/i).fill('Led a product platform migration and reduced release time by 40%.')

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download PDF' }).click()
    const download = await downloadPromise
    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
    const pdf = await PDFDocument.load(Buffer.concat(chunks))
    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1)
    const { width, height } = pdf.getPage(0).getSize()
    expect(width).toBeCloseTo(595, 0)
    expect(height).toBeCloseTo(842, 0)
  })
})
