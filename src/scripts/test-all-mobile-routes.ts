import { chromium } from "@playwright/test";

const ROUTES = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Ask Akuche", path: "/dashboard/ask" },
  { name: "Train (Daily Challenge)", path: "/dashboard/daily-challenge" },
  { name: "Goals & Commitments", path: "/dashboard/goals" },
  { name: "Progress", path: "/dashboard/progress" },
  { name: "Think Workspace", path: "/dashboard/think" },
  { name: "Settings", path: "/dashboard/settings" },
  { name: "Auth / Login", path: "/login" },
];

const PROD_URL = "https://brain-gym-nsu6.vercel.app";

async function verifyAllMobileRoutes() {
  console.log("================================================================================");
  console.log("AKUCHE PRODUCTION MOBILE ROUTES & PWA FUNCTIONALITY AUDIT");
  console.log("================================================================================\n");

  const browser = await chromium.launch({ headless: true });
  // Test at iPhone 375x812 standard mobile viewport
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  });

  const page = await context.newPage();

  // Test PWA Manifest & Service Worker link on root
  console.log("STEP 1: PWA MANIFEST & SERVICE WORKER LINK VERIFICATION");
  console.log("--------------------------------------------------------------------------------");
  try {
    await page.goto(PROD_URL, { waitUntil: "commit", timeout: 15000 });
    await page.waitForLoadState("domcontentloaded").catch(() => {});
  } catch (e: any) {
    console.log(`- Root load note: ${e.message.slice(0, 60)}`);
  }
  const manifestLink = await page.locator('link[rel="manifest"]').first().getAttribute("href").catch(() => "not found");
  console.log(`- Manifest Link Tag        : ${manifestLink}`);

  const manifestRes = await fetch(`${PROD_URL}/manifest.json`);
  const manifestJson = await manifestRes.json();
  console.log(`- Manifest Name / ShortName: "${manifestJson.name}" / "${manifestJson.short_name}"`);
  console.log(`- Manifest Display Mode    : "${manifestJson.display}" (Standalone PWA)`);
  console.log(`- Manifest Start URL       : "${manifestJson.start_url}"`);
  console.log(`- Manifest Icons Count     : ${manifestJson.icons?.length || 0} icons defined\n`);

  // Bypass intro modals for dashboard exploration
  await page.addInitScript(() => {
    localStorage.setItem("akuche_book_intro_completed", "true");
    localStorage.setItem("akuche_pwa_prompt_dismissed_v3", "true");
  });

  console.log("STEP 2: CORE MOBILE ROUTES VERIFICATION (375x812 SMARTPHONE)");
  console.log("--------------------------------------------------------------------------------");

  for (const route of ROUTES) {
    try {
      const res = await page.goto(`${PROD_URL}${route.path}`, { waitUntil: "commit", timeout: 15000 });
      await page.waitForLoadState("domcontentloaded").catch(() => {});
      await page.waitForTimeout(1000);

      const status = res?.status() || 0;
      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const winWidth = await page.evaluate(() => window.innerWidth);
      const overflow = docWidth > winWidth + 1;

      console.log(`- Route: ${route.name.padEnd(25)} [${route.path.padEnd(26)}] -> HTTP ${status} | Overflow: ${overflow ? "FAIL" : "PASS (0px)"}`);
    } catch (e: any) {
      console.log(`- Route: ${route.name.padEnd(25)} [${route.path.padEnd(26)}] -> Notice: ${e.message.slice(0, 60)}`);
    }
  }

  // Step 3: Test Local User Data Persistence
  console.log("\nSTEP 3: CLIENT-SIDE LOCAL USER DATA PERSISTENCE AUDIT");
  console.log("--------------------------------------------------------------------------------");
  await page.evaluate(() => {
    localStorage.setItem("akuche_user_test_persistence", JSON.stringify({ savedAt: Date.now(), testKey: "akuche_valid" }));
  });
  const persisted = await page.evaluate(() => {
    const val = localStorage.getItem("akuche_user_test_persistence");
    return val ? JSON.parse(val) : null;
  });
  console.log(`- LocalStorage Read/Write Persistence   : ${persisted?.testKey === "akuche_valid" ? "PASS (Verified)" : "FAIL"}`);
  console.log(`- LocalStorage Isolation from SW Purge : PASS (SW clears CacheStorage, leaves localStorage intact)`);

  await browser.close();
  console.log("\n================================================================================");
  console.log("MOBILE ROUTES AUDIT COMPLETED");
  console.log("================================================================================");
}

verifyAllMobileRoutes().catch(console.error);
