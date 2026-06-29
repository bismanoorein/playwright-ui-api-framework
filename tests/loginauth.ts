import { test, expect } from "@playwright/test"
import { config } from "../config/env"

test("login with valid credentials and save storage state", async ({ page }) => {
  expect(config.email, "Set EMAIL and PASSWORD in your .env file before running the test.").toBeTruthy()
  expect(config.password, "Set EMAIL and PASSWORD in your .env file before running the test.").toBeTruthy()

  await page.goto("https://ecommerce-playground.lambdatest.io/")

  await expect(page.getByRole("button", { name: "My account" })).toBeVisible()
  await page.getByRole("button", { name: " My account" }).hover()

  await page.getByRole("link", { name: "Login" }).click()
  await expect(page.getByRole("heading", { name: "Returning Customer" })).toBeVisible({ timeout: 30000 })
  await page.getByRole("textbox", { name: "E-Mail Address" }).fill(config.email)
  await page.getByRole("textbox", { name: "Password" }).fill(config.password)
  await page.getByRole("button", { name: "Login" }).click()
  await expect(page.locator(".card-header").filter({ hasText: /My Account/ })).toBeVisible({ timeout: 30000 })

  await page.context().storageState({ path: "auth/auth.json" })
})
