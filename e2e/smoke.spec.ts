import { test, expect, type Page } from "@playwright/test";

const GOOGLE_BUTTON = "Continue with Google";

async function goto(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
}

async function expectLoggedOut(page: Page) {
  const response = await page.request.get("/login");
  expect(response.ok()).toBeTruthy();
}

test("landing page renders hero", async ({ page }) => {
  await goto(page, "/");
  await expect(
    page.getByText("Train Your Brain For Real Life").first()
  ).toBeVisible({ timeout: 30_000 });
});

test("marketing pages render", async ({ page }) => {
  await goto(page, "/features");
  await expect(
    page.getByText("7 Dimensions of Cognitive Fitness")
  ).toBeVisible();

  await goto(page, "/pricing");
  await expect(page.getByText("Simple, transparent pricing")).toBeVisible();

  await goto(page, "/about");
  await expect(page.getByText(/cognitive fitness/i).first()).toBeVisible();
});

test("login page renders auth options", async ({ page }) => {
  await goto(page, "/login");
  await expect(page.getByText("Welcome back")).toBeVisible();
  await expect(
    page.getByRole("button", { name: GOOGLE_BUTTON })
  ).toBeVisible();
  await expect(page.getByPlaceholder("Email address")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send me a sign-in link" })
  ).toBeVisible();
});

test("signup page renders and shows referral banner", async ({ page }) => {
  await goto(page, "/signup");
  await expect(page.getByText("Join BrainGym")).toBeVisible();
  await expect(
    page.getByRole("button", { name: GOOGLE_BUTTON })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create account" })
  ).toBeVisible();

  await goto(page, "/signup?ref=BG12345");
  await expect(page.getByText("You were invited by a friend!")).toBeVisible();
});

test("forgot password page renders", async ({ page }) => {
  await goto(page, "/forgot-password");
  await expect(page.getByText("Reset your password")).toBeVisible();
});

test("dashboard redirects unauthenticated users to login", async ({ page }) => {
  await expectLoggedOut(page);
  await goto(page, "/dashboard");
  await page.waitForURL(/\/login/);
  await expect(page.getByText("Welcome back")).toBeVisible();
});

test("protected routes redirect unauthenticated users to login", async ({
  page,
}) => {
  await goto(page, "/dashboard/settings");
  await page.waitForURL(/\/login/);
  await expect(page.getByText("Welcome back")).toBeVisible();

  await goto(page, "/dashboard/workout");
  await page.waitForURL(/\/login/);
});

test("google sign-in starts the OAuth flow", async ({ page }) => {
  await goto(page, "/login");
  await expectLoggedOut(page);
  await page.getByRole("button", { name: GOOGLE_BUTTON }).click();

  // The browser should navigate away from the app to the provider flow.
  // Headed mode shows exactly where it stops (Supabase authorize page or
  // accounts.google.com) — a useful diagnostic for Google sign-in failures.
  await page.waitForURL(/accounts\.google\.com|supabase\.co/, {
    timeout: 30_000,
  });
});
