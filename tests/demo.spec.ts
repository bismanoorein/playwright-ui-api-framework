import { test, expect } from '@playwright/test';

test.describe('Lambda test',()=>{

test.use({
  storageState: 'auth/auth.json'
});

test('verify product title and price', async({page})=> {
    await page.goto("https://ecommerce-playground.lambdatest.io/");
    await expect(page.getByRole('button', { name: 'Mega Menu' })).toBeVisible({timeout: 10000});
    // await page.getByRole('button', { name: 'Mega Menu' }).hover();
    await expect(page.getByRole('link', { name: 'Wishlist', exact: true })).toBeVisible({timeout: 10000});
    await page.getByRole('button', {name:' Mega Menu'}).hover();
    await expect(page.getByRole('heading', { name: 'Accessories', level: 3 })).toBeVisible()


    await expect(page.getByRole('link', { name: 'Mobile cases' })).toBeVisible({timeout: 10000});
    await page.getByRole('link', { name: 'Mobile cases' }).click();
    await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=product/category&path=29');
   
    const pdpTitle = page.getByRole('link', { name: 'iPod Shuffle', exact: true });
    const productCard = page.locator('.product-thumb')
                                      .filter({ has: pdpTitle });
    const pdpPrice = (await productCard.locator('.price').first().textContent())?.trim();
    const pdpName = (await pdpTitle.textContent())?.trim();
    console.log('Product Name (PLP):', pdpName);
    console.log('Product Price (PLP):', pdpPrice);

    await expect(pdpTitle).toBeVisible();
    await pdpTitle.click();
    // ensure breadcrumb or page heading contains product name
    await expect(page.locator('.breadcrumb')).toContainText(pdpName || 'iPod Shuffle', { timeout: 10000 });

    const plpTitle = (await page.getByRole('heading', { level: 1 }).textContent())?.trim();
    const plpPrice = (await page.locator('.price').first().textContent())?.trim();
    console.log('Product Name (PDP):', plpTitle);
    console.log('Product Price (PDP):', plpPrice);

    expect(plpTitle).toBe(pdpName);
    expect(plpPrice).toBe(pdpPrice);

})



test('verify shop by category items in sidebar', async({page})=> {
    // navigate to the website
    await page.goto("https://ecommerce-playground.lambdatest.io/");
    // verify the element is visible on the page and click on it
    await expect(page.getByRole('button', { name: 'Shop by Category' })).toBeVisible({timeout: 10000});
    await page.getByRole('button', { name: 'Shop by Category' }).click();
   // verify sidebar is visible and print the categories in the sidebar
    await expect(page.getByRole('heading', { name: 'Top categories ' })).toBeVisible();
    const  categories= page.locator('.navbar-nav.vertical').first();
    console.log(await categories.textContent());

})

test.use({storageState: undefined})
test('print title and price of all products in mobile case', async({browser})=>{

    const mobilecontext= await browser.newContext({storageState: undefined})

    const mobilePage = await mobilecontext.newPage();

    await mobilePage.goto("https://ecommerce-playground.lambdatest.io/");
    await expect(mobilePage.getByRole('button', { name: 'Mega Menu' })).toBeVisible({timeout: 10000});

    await expect(mobilePage.getByRole('link', { name: 'Wishlist', exact: true })).toBeVisible({timeout: 10000});
    await mobilePage.getByRole('button', {name:' Mega Menu'}).hover();
    await expect(mobilePage.getByRole('heading', { name: 'Accessories', level: 3 })).toBeVisible()

    await expect(mobilePage.getByRole('link', { name: 'Mobile cases' })).toBeVisible({timeout: 10000});
    await mobilePage.getByRole('link', { name: 'Mobile cases' }).click();
    await expect(mobilePage).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=product/category&path=29');
    
    const pdpTitle = mobilePage.getByRole('link', { name: 'iPod Shuffle', exact: true });
    const productCard = mobilePage.locator('.product-thumb')
                                      .filter({ has: pdpTitle });
    const pdpPrice = (await productCard.locator('.price').first().textContent())?.trim();
    const pdpName = (await pdpTitle.textContent())?.trim();
    console.log('Product Name (PLP):', pdpName);
    console.log('Product Price (PLP):', pdpPrice);

    await expect(pdpTitle).toBeVisible();
    
    const pdps = await mobilePage.locator('.product-layout')
    
    const count = await pdps.count();

    for (let i = 0; i < count; i++) {


        const product = pdps.nth(i);

        const text = await product.textContent();

        console.log(`Product ${i + 1}: ${text}`);
     }
   


   })


})