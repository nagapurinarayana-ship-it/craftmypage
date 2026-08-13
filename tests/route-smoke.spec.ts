import { test, expect } from '@playwright/test'

const publicRoutes = [
  '/',
  '/tools/invoice-maker',
  '/tools/invitation-maker',
  '/tools/resume-builder',
  '/invitations/birthday',
  '/invitations/wedding',
  '/invitations/engagement',
  '/invitations/baby',
  '/invitations/housewarming',
  '/invitations/naming',
  '/invitations/party',
  '/invitations/anniversary',
  '/invitations/birthday/maker',
  '/invitations/wedding/maker',
  '/invitations/baby/maker',
  '/invitations/housewarming/maker',
  '/invoices/gst-invoice',
  '/invoices/freelancer-invoice',
  '/invoices/invoice-templates',
  '/resumes/ats-resume',
  '/resumes/fresher-resume',
  '/resumes/software-engineer-resume',
  '/guides',
  '/guides/how-to-create-an-invoice',
  '/guides/birthday-invitation-whatsapp',
  '/guides/wedding-invitation-wording',
  '/guides/invitation-details',
  '/guides/invitation-sizes',
  '/guides/housewarming-invitation-wording',
  '/guides/naming-ceremony-invitation',
  '/guides/ats-friendly-resume',
  '/guides/fresher-resume-format',
  '/guides/software-engineer-resume',
  '/guides/one-page-vs-two-page-resume',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]

test.describe('Public route smoke coverage', () => {
  for (const route of publicRoutes) {
    test(`${route} renders without an application error`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })

      expect(response?.ok(), `${route} returned an unsuccessful HTTP response`).toBeTruthy()
      await expect(page.locator('#root')).not.toBeEmpty()
      await expect(page.locator('body')).not.toContainText(/Application Error|Cannot read properties|ChunkLoadError/i)
      expect(errors, `${route} emitted page errors`).toEqual([])
    })
  }
})
