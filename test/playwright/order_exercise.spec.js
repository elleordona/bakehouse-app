import { test, expect } from '@playwright/test'

test.describe('Bakehouse Order Test', () => {
    const testCustomerName = 'Alice Baker'
    let customerOrderNumber

    test.describe.configure({ mode: 'serial' })

    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // navigate to customer list
        page.getByText('Customer List').click()

        // find the customer order amount
        customerOrderNumber = await page.locator('tbody tr').filter({ hasText: testCustomerName }).locator('td:nth-child(4)').textContent()
    })

    test('navigate to new order', async ({ page }) => {
        const newOrderLink = page.getByText('New Order');

        await newOrderLink.click()
        await expect(page.locator('h2')).toHaveText('New Order')
    })

    test('can add new order for test customer using form', async ({ page }) => {
        const newOrderLink = page.getByText('New Order');

        await newOrderLink.click()
        await expect(page.locator('h2')).toHaveText('New Order')

        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('Order created')
            await dialog.accept()
        })

        await page.getByLabel('Customer').selectOption(testCustomerName)
        await page.locator('select').last().selectOption('Butter Croissant')
        await page.locator('button[type=submit]').click()
    })

    test('checking new order appears on the customer list', async ({ page }) => {
        const newOrderLink = page.getByText('New Order');
        const customerListLink = page.getByText('Customer List')

        await newOrderLink.click()
        await expect(page.locator('h2')).toHaveText('New Order')

        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('Order created')
            await dialog.accept()
        })

        await page.getByLabel('Customer').selectOption(testCustomerName)
        await page.locator('select').last().selectOption('Butter Croissant')
        await page.locator('button[type=submit]').click()
        await expect(page.locator('p')).toHaveCount(1)

        await customerListLink.click()
        await expect(page.locator('h2')).toHaveText('Customer List')

        const newCustomerOrderAmount = await page.locator('tbody tr').filter({ hasText: testCustomerName }).locator('td:nth-child(4)').textContent()
        expect(newCustomerOrderAmount).toBe(((customerOrderNumber * 1) + 1).toString())
    })
})
