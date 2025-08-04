import { test, expect } from "@playwright/test";

test("App loads and shows New Note button", async ({ page }) => {
  await page.goto("http://localhost:5173");

  const newNoteButton = page.getByRole("button", { name: /\+ new note/i });
  await expect(newNoteButton).toBeVisible();
});

test("Editor appears after clicking New Note", async ({ page }) => {
  await page.goto("http://localhost:5173");

  const newNoteButton = page.getByRole("button", { name: /\+ new note/i });
  await expect(newNoteButton).toBeVisible();

  await newNoteButton.click();

  const editor = page.getByTestId("editor");
  await expect(editor).toBeVisible();
});
