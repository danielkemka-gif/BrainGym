import { test, expect, type Page } from "@playwright/test";

async function goto(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
}

test.describe("Adversarial Bug Hunt Regressions & Routing", () => {
  test("unauthenticated access to /dashboard/chat redirects to login", async ({ page }) => {
    await goto(page, "/dashboard/chat");
    await page.waitForURL(/\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("unauthenticated access to /dashboard/shop redirects to login", async ({ page }) => {
    await goto(page, "/dashboard/shop");
    await page.waitForURL(/\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("unauthenticated access to /dashboard/missions redirects to login", async ({ page }) => {
    await goto(page, "/dashboard/missions");
    await page.waitForURL(/\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("unauthenticated access to /dashboard/decision-lab redirects to login", async ({ page }) => {
    await goto(page, "/dashboard/decision-lab");
    await page.waitForURL(/\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("unauthenticated access to /dashboard/games redirects to login", async ({ page }) => {
    await goto(page, "/dashboard/games");
    await page.waitForURL(/\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("unauthenticated access to /dashboard/leaderboard redirects to login", async ({ page }) => {
    await goto(page, "/dashboard/leaderboard");
    await page.waitForURL(/\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("onboarding route is protected for unauthenticated users", async ({ page }) => {
    await goto(page, "/onboarding");
    await page.waitForURL(/\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });
});
