const { test, expect } = require('@playwright/test');

test.describe('Bakehouse customer tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('can navigate to new customer', async ({page}) => {
        const newCustomerLink = page.getByText('New Customer');

        await newCustomerLink.click()

        await expect(page.locator('h2')).toHaveText('New Customer')
    })

    test('can add new customer using form', async ({page}) => {
        const newCustomerLink = page.getByText('New Customer');

        await newCustomerLink.click()
        await expect(page.locator('h2')).toHaveText('New Customer')

        let randNum = Math.floor(Math.random() * 1000);

        await page.getByLabel('Full name').fill(`Customer ${randNum}`)
        await page.getByLabel('Email address').fill(`customer${randNum}@test.com`)
        await page.locator('button[type=submit]').click()

        await expect(page.locator('css=form div')).toHaveText(`Customer created ✔️`)
    })

    test('checking new customer appears on the customer list', async ({page}) => {
        const newCustomerLink = page.getByText('New Customer');
        const customerListLink = page.getByText('Customer List')

        await newCustomerLink.click()
        await expect(page.locator('h2')).toHaveText('New Customer')

        let randNum = Math.floor(Math.random() * 1000);

        await page.getByLabel('Full name').fill(`Customer ${randNum}`)
        await page.getByLabel('Email address').fill(`customer${randNum}@test.com`)
        await page.locator('button[type=submit]').click()
        await expect(page.locator('css=form div')).toHaveText(`Customer created ✔️`)

        await customerListLink.click()
        await expect(page.locator('h2')).toHaveText('Customer List')

        const customerAdded = page.locator('td').getByText(`Customer ${randNum}`)
        await expect(customerAdded).toBeVisible()
    })
})
