import { test, expect } from '@playwright/test'

test.describe('Demo Showcase', () => {
  test('renders dashboard and generates metrics', async ({ page }) => {
    await page.goto('/demo')

    // Expect header
    await expect(page.locator('h1:has-text("Showcase Дашборд")')).toBeVisible()

    // Generate metrics
    await page.locator('button:has-text("Сгенерировать данные")').click()
    
    // Check if chart renders (unovis uses svg or canvas, we can check for unovis container)
    await expect(page.locator('.unovis-xy-container')).toBeVisible({ timeout: 15000 })

    // Test user creation
    const uniqueSuffix = Date.now()
    const demoUser = `demo_user_${uniqueSuffix}`
    await page.fill('input[name="username"]', demoUser)
    await page.fill('input[name="email"]', `demo_${uniqueSuffix}@e2e.com`)
    await page.fill('input[name="fullName"]', 'Demo User')
    await page.locator('button:has-text("Create User")').click()

    // Expect the user to appear in the table
    await expect(page.locator('table')).toContainText(demoUser, { timeout: 5000 })

    // Delete user
    const row = page.locator(`tr:has-text("${demoUser}")`)
    await row.getByRole('button').click()

    // Expect user to be removed
    await expect(page.locator('table')).not.toContainText(demoUser, { timeout: 5000 })
  })
})
