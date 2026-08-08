import { test, expect } from "@playwright/test";

test("home loads and can switch language", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/58begin/i);

  const toggle = page.getByRole("button", { name: /^(EN|中)$/ });
  await toggle.click();
  await expect(page.getByRole("button", { name: /^(EN|中)$/ })).toBeVisible();

  await page.goto("/posts");
  await expect(page.getByRole("button", { name: /^(全部|All)$/ })).toBeVisible();
});
