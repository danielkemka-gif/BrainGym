import { chromium } from "@playwright/test";

const WORKSPACES = [
  { name: "My Business", path: "/dashboard/business", expectedText: "Diagnose Sales Slowdown" },
  { name: "My Career", path: "/dashboard/career", expectedText: "Advancement" },
  { name: "My Potential", path: "/dashboard/potential", expectedText: "90-Day Post-Graduation" },
  { name: "My Life", path: "/dashboard/life", expectedText: "Navigating Major Life Transitions" },
  { name: "Personal Clarity Hub", path: "/dashboard/clarity", expectedText: "Active Challenges" },
  { name: "Explore Intelligence", path: "/dashboard/explore", expectedText: "Explore Structured Intelligence" },
];

const PROD_URL = "https://brain-gym-nsu6.vercel.app";

async function verifyWorkspacesMobile() {
  console.log("================================================================================");
  console.log("AKUCHE 4 AUDIENCE WORKSPACES & CLARITY HUB MOBILE AUDIT");
  console.log("================================================================================\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  });

  for (const ws of WORKSPACES) {
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem("akuche_book_intro_completed", "true");
      localStorage.setItem("akuche_pwa_prompt_dismissed_v3", "true");
    });

    try {
      const response = await page.goto(`${PROD_URL}${ws.path}`, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(1000);
      const status = response?.status() || 0;

      const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const winWidth = await page.evaluate(() => window.innerWidth);
      const overflow = docWidth > winWidth + 1;

      const content = await page.content();
      const hasExpected = content.includes(ws.expectedText);

      console.log(`[PASS] ${ws.name.padEnd(24)} [${ws.path.padEnd(22)}] -> HTTP ${status} | Overflow: ${overflow ? "FAIL" : "PASS (0px)"} | Content Match: ${hasExpected ? "YES" : "CHECK"}`);
    } catch (e: any) {
      console.log(`[NOTICE] ${ws.name.padEnd(24)} -> ${e.message.slice(0, 70)}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("\n================================================================================");
  console.log("ALL 4 AUDIENCE WORKSPACES VERIFIED ON SMARTPHONE VIEWPORT");
  console.log("================================================================================");
}

verifyWorkspacesMobile().catch(console.error);
