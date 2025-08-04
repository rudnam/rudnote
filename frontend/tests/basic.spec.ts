import { test } from "@playwright/test";

test("App loads", async ({ page }) => {
  await page.goto("http://localhost:5173");
});
