import { test, expect } from "@playwright/test";

test("home loads and can switch language", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/58begin/i);

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByRole("button", { name: "中" })).toBeVisible();

  await page.goto("/posts");
  await expect(page.getByText(/内容|Content/)).toBeVisible();
});

