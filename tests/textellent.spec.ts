import {test, expect } from "@playwright/test"

test.use({
  storageState: undefined
});

test('login with invalid credentials', async ({ context,page }) => {
    page.goto('https://textellent.com')
    page.waitForSelector('h1:has-text("Business Texting That\'s Easy")', { timeout: 45000 })
    await expect(page.getByRole('heading', { name: 'Business Texting That\'s Easy' })).toBeVisible({timeout:45000})
    // await page.getByRole('banner').getByRole('link', { name: 'Client Login' }).click()
    const [newPage] = await Promise.all([
                      context.waitForEvent('page'),
                      page.getByRole('banner').getByRole('link', { name: 'Client Login' }).click()
                       ]);

 
    await expect(newPage).toHaveURL('https://client.textellent.com/service/2.0/#/login')
    await expect(newPage.getByAltText(/Logo/).first()).toBeVisible({ timeout: 30000 })
    await newPage.locator(`//input[@name='userName']`).fill('testuser')
    await newPage.locator(`//input[@name='password']`).fill('password123')
    await newPage.getByRole('button', { name: 'Login' }).click()
    await newPage.frameLocator('iframe').locator('.modal-content').isVisible({ timeout: 30000 })
    await expect(newPage.getByText('Invalid Username/Password')).toBeVisible()       
    await newPage.getByRole('button', { name: 'Ok' }).click();
   

})