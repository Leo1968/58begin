import { test, expect } from "@playwright/test";

test("modal can be opened and closed", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("button", { name: /查看二维码区域|Open QR area/ })
    .scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /查看二维码区域|Open QR area/ }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByLabel("Close").click();
  await expect(page.getByRole("dialog")).toBeHidden();
});
