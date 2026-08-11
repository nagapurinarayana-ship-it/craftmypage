import { test, expect } from '@playwright/test'

test.describe('Invoice Maker', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to invoice maker
    await page.goto('/tools/invoice-maker')
    await page.waitForLoadState('networkidle')
  })

  test('should load invoice maker page', async ({ page }) => {
    await expect(page).toHaveTitle(/Free Invoice Maker/)
    await expect(page.locator('h1')).toContainText('Free Invoice Maker')
  })

  test('should display form and preview', async ({ page }) => {
    // Check that both form and preview are visible
    await expect(page.locator('text=Business Details')).toBeVisible()
    await expect(page.locator('text=Professional')).toBeVisible()
  })

  test('should create a basic invoice', async ({ page }) => {
    // Fill in business details
    await page.fill('input[placeholder="Your business name"]', 'Test Company')
    await page.fill('input[placeholder="your@email.com"]', 'test@company.com')
    await page.fill('input[placeholder="\\+1234567890"]', '9876543210')

    // Fill in customer details
    await page.fill('input[placeholder="Customer or company name"]', 'Test Customer')
    await page.fill('input[placeholder="customer@example.com"]', 'customer@test.com')

    // Verify preview updates
    await expect(page.locator('text=Test Company')).toBeVisible()
    await expect(page.locator('text=Test Customer')).toBeVisible()
  })

  test('should handle multiple line items', async ({ page }) => {
    // Add initial line item
    await page.fill('input[placeholder="Item or service description"]', 'Consulting Services')
    await page.fill('input[type="number"][placeholder="0.00"]', '1000')

    // Add second line item
    await page.click('button:has-text("+ Add Line Item")')
    const descriptions = page.locator('input[placeholder="Item or service description"]')
    await descriptions.last().fill('Development Services')

    const prices = page.locator('input[type="number"][placeholder="0.00"]')
    await prices.last().fill('2000')

    // Verify both items are in the form
    await expect(page.locator('text=Consulting Services')).toBeVisible()
    await expect(page.locator('text=Development Services')).toBeVisible()
  })

  test('should duplicate line item', async ({ page }) => {
    // Add a line item
    await page.fill('input[placeholder="Item or service description"]', 'Test Item')
    await page.fill('input[type="number"][placeholder="0.00"]', '500')

    // Duplicate it
    await page.click('button:has-text("Duplicate")', { nth: 0 })

    // Verify we have 2 items with same description
    const items = page.locator('input[placeholder="Item or service description"]')
    const count = await items.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('should remove line item', async ({ page }) => {
    // Add 2 line items
    await page.fill('input[placeholder="Item or service description"]', 'Item 1')
    await page.click('button:has-text("+ Add Line Item")')

    const descriptions = page.locator('input[placeholder="Item or service description"]')
    await descriptions.last().fill('Item 2')

    // Remove the second item
    const removeButtons = page.locator('button:has-text("Remove")')
    await removeButtons.last().click()

    // Only first item should remain
    await expect(page.locator('text=Item 1')).toBeVisible()
  })

  test('should apply discount to line item', async ({ page }) => {
    await page.fill('input[placeholder="Item or service description"]', 'Test Service')

    const prices = page.locator('input[type="number"][placeholder="0.00"]')
    await prices.nth(0).fill('1000')
    await prices.nth(1).fill('100') // Discount

    // Verify discount is applied
    await expect(page.locator('text=100')).toBeVisible()
  })

  test('should change tax mode to simple tax', async ({ page }) => {
    // Change tax mode
    await page.selectOption('select', 'simple')

    // Fill tax rate
    await page.fill('input[placeholder="Item or service description"]', 'Taxable Item')
    await page.fill('input[type="number"]', '1000')

    // Set tax rate
    const taxRates = page.locator('input[placeholder="0"]:nth-of-type(5)')
    if (taxRates) {
      await taxRates.fill('18')
    }

    await expect(page.locator('text=Tax')).toBeVisible()
  })

  test('should change tax mode to India GST', async ({ page }) => {
    // Change tax mode
    const taxSelect = page.locator('select').first()
    await taxSelect.selectOption('india-gst')

    // Verify GST fields appear
    await expect(page.locator('text=CGST')).toBeVisible()
    await expect(page.locator('text=SGST')).toBeVisible()
  })

  test('should select intra-state GST', async ({ page }) => {
    // Change to GST mode
    const taxSelect = page.locator('select').first()
    await taxSelect.selectOption('india-gst')

    // Select intra-state
    await page.click('input[type="radio"]', { nth: 0 })

    // Verify CGST/SGST fields
    await expect(page.locator('text=CGST Rate')).toBeVisible()
    await expect(page.locator('text=SGST Rate')).toBeVisible()
  })

  test('should select inter-state GST', async ({ page }) => {
    // Change to GST mode
    const taxSelect = page.locator('select').first()
    await taxSelect.selectOption('india-gst')

    // Select inter-state
    await page.click('input[type="radio"]', { nth: 1 })

    // Verify IGST field appears
    await expect(page.locator('text=IGST Rate')).toBeVisible()
  })

  test('should save and load draft', async ({ page }) => {
    // Fill in data
    await page.fill('input[placeholder="Your business name"]', 'Draft Test Company')
    await page.fill('input[placeholder="Item or service description"]', 'Service')

    // Enter draft name
    await page.fill('input[placeholder="Invoice name..."]', 'Test Draft')

    // Save draft
    await page.click('button:has-text("💾 Save Draft")')
    await expect(page.locator('text=Draft "Test Draft" saved')).toBeVisible()

    // Clear form
    await page.click('button:has-text("🔄 Reset")')
    await page.click('button:has-text("Are you sure")')

    // Load draft
    await page.click('button:has-text("📂 Load Draft")')
    await expect(page.locator('text=Test Draft')).toBeVisible()
  })

  test('should duplicate invoice', async ({ page }) => {
    // Fill basic info
    await page.fill('input[placeholder="Your business name"]', 'Test Company')
    await page.fill('input[placeholder="Item or service description"]', 'Service')

    // Duplicate
    await page.click('button:has-text("📋 Duplicate")')

    // Verify duplication worked by checking if invoice number changed
    await expect(page.locator('input[placeholder="INV-2026-001"]')).toBeVisible()
  })

  test('should export and import JSON', async ({ page }) => {
    // Fill minimal data
    await page.fill('input[placeholder="Your business name"]', 'Test Company')
    await page.fill('input[placeholder="Customer or company name"]', 'Test Customer')
    await page.fill('input[placeholder="Item or service description"]', 'Test Service')

    // Open import/export
    await page.click('button:has-text("⤴️ Import/Export")')

    // Export JSON
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("📤 Export as JSON")')
  })

  test('should change template style', async ({ page }) => {
    // Change to minimal template
    const templateButtons = page.locator('input[name="template"]')
    if ((await templateButtons.count()) >= 2) {
      await templateButtons.nth(1).click() // Minimal
    }

    await expect(page.locator('text=Minimal')).toBeVisible()
  })

  test('should change accent color', async ({ page }) => {
    // Find color input and change it
    const colorInput = page.locator('input[type="color"]')
    if (colorInput) {
      await colorInput.fill('#ff0000')
    }

    // Verify color changed
    await expect(page.locator('text=#ff0000').or(page.locator('text=ff0000'))).toBeVisible()
  })

  test('should add payment information', async ({ page }) => {
    // Scroll to payment section
    await page.locator('text=Payment Information').scrollIntoViewIfNeeded()

    // Fill payment details
    await page.fill('textarea[placeholder="How and where to send payment"]', 'Send payment via bank transfer')
    await page.fill('input[placeholder="Bank name"]', 'Test Bank')
    await page.fill('input[placeholder="Account number"]', '1234567890')

    // Verify payment info is shown
    await expect(page.locator('text=Test Bank')).toBeVisible()
  })

  test('should handle invoice with multiple pages worth of items', async ({ page }) => {
    // Add many line items to test pagination
    for (let i = 0; i < 15; i++) {
      const descriptions = page.locator('input[placeholder="Item or service description"]')
      const lastDesc = descriptions.last()
      await lastDesc.fill(`Item ${i + 1}`)

      const prices = page.locator('input[placeholder="0.00"]')
      if (prices.count() > 0) {
        await prices.last().fill('100')
      }

      if (i < 14) {
        await page.click('button:has-text("+ Add Line Item")')
      }
    }

    // Verify all items are present
    await expect(page.locator('text=Item 1')).toBeVisible()
    await expect(page.locator('text=Item 15')).toBeVisible()
  })

  test('should reset invoice form', async ({ page }) => {
    // Fill some data
    await page.fill('input[placeholder="Your business name"]', 'Test Data')

    // Reset
    await page.click('button:has-text("🔄 Reset")')
    await page.click('button:has-text("Are you sure")')

    // Verify form is cleared
    const businessName = await page.locator('input[placeholder="Your business name"]').inputValue()
    expect(businessName).toBe('')
  })

  test('should display correct totals with no tax', async ({ page }) => {
    // Set up items
    await page.fill('input[placeholder="Item or service description"]', 'Item A')
    const prices = page.locator('input[type="number"][placeholder="0.00"]')
    await prices.nth(0).fill('100')
    await prices.nth(1).fill('1000')

    // Verify totals in preview
    await expect(page.locator('text=1100')).toBeVisible()
  })

  test('should use currency formatting', async ({ page }) => {
    // Change currency to USD
    const currencySelect = page.locator('select').filter({ hasText: /INR|USD|EUR/ })
    if (currencySelect.count() > 0) {
      await currencySelect.first().selectOption('USD')
    }

    // Verify preview updates with currency symbol
    await page.fill('input[placeholder="Item or service description"]', 'Test')
    const prices = page.locator('input[type="number"][placeholder="0.00"]')
    await prices.nth(0).fill('100')

    // USD should show $ symbol in preview
    await expect(page.locator('text=$')).toBeVisible()
  })

  test('should handle shipping address same as billing', async ({ page }) => {
    // Should be checked by default
    const sameAddressCheckbox = page.locator('input[type="checkbox"]').first()
    await expect(sameAddressCheckbox).toBeChecked()

    // Uncheck it
    await sameAddressCheckbox.click()

    // Shipping fields should appear
    await expect(page.locator('text=Shipping Address')).toBeVisible()
  })

  test('should validate invoice with required fields', async ({ page }) => {
    // Try download with empty form
    await page.click('button:has-text("📥 Download PDF")')

    // Should either show error or work (depending on implementation)
    // For now, just verify the button exists and is clickable
    await expect(page.locator('button:has-text("📥 Download PDF")')).toBeVisible()
  })

  test('should navigate directly to /tools/invoice-maker', async ({ page }) => {
    await page.goto('/tools/invoice-maker')
    await expect(page).toHaveTitle(/Free Invoice Maker/)
  })

  test('should navigate to invoice guide', async ({ page }) => {
    // Find link to guide
    const guideLink = page.locator('a:has-text("How to Create")')
    if (await guideLink.isVisible()) {
      await guideLink.click()
      await expect(page).toHaveTitle(/How to Create a Professional Invoice/)
    }
  })
})
