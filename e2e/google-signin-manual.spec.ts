import { test, expect } from "@playwright/test";

test("manual google sign-in completes end-to-end", async ({ page }) => {
  // Plenty of time for the user to complete Google login + 2FA manually.
  test.setTimeout(900_000);

  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("requestfailed", (req) =>
    failedRequests.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText}`)
  );

  await page.goto("/login", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: "Continue with Google" }).click();

  // The app should send the browser to Google's consent screen.
  await page.waitForURL(/accounts\.google\.com/, { timeout: 60_000 });

  // Now the user signs in manually in the headed browser.
  // When Google returns to the app, the callback lands us on
  // /onboarding (new user) or /dashboard (existing profile).
  await page.waitForURL(/\/onboarding$|\/dashboard$/, {
    timeout: 15 * 60_000,
  });

  const url = page.url();
  expect(url).toMatch(/\/onboarding$|\/dashboard$/);

  console.log("FINAL URL:", url);
  console.log("Console errors:", JSON.stringify(consoleErrors));
  console.log("Failed requests:", JSON.stringify(failedRequests));
});
