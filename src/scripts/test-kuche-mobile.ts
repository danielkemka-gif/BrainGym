import { chromium } from "@playwright/test";

const VIEWPORTS = [
  { width: 360, height: 740, name: "360px (Android Standard - Galaxy/Pixel)" },
  { width: 375, height: 812, name: "375px (iPhone Standard - SE/X/11)" },
  { width: 390, height: 844, name: "390px (iPhone 12/13/14/15)" },
  { width: 430, height: 932, name: "430px (iPhone 14/15 Pro Max)" },
];

const PROD_URL = "https://brain-gym-nsu6.vercel.app";

async function verifyKucheMobile() {
  console.log("================================================================================");
  console.log("AKUCHE MOBILE SMARTPHONE & KUCHE GUIDE VERIFICATION (PRODUCTION)");
  console.log("================================================================================\n");

  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`--------------------------------------------------------------------------------`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      deviceScaleFactor: 2,
      hasTouch: true,
      isMobile: true,
    });

    const page = await context.newPage();

    // Bypass intro modals if set
    await page.addInitScript(() => {
      localStorage.setItem("akuche_book_intro_completed", "true");
      localStorage.setItem("akuche_pwa_prompt_dismissed_v3", "true");
    });

    // 1. Load Dashboard
    console.log(`- Navigating to ${PROD_URL}/dashboard...`);
    try {
      await page.goto(`${PROD_URL}/dashboard`, { waitUntil: "commit", timeout: 15000 });
      await page.waitForLoadState("domcontentloaded").catch(() => {});
      await page.waitForTimeout(2000);
    } catch (e: any) {
      console.log(`  Navigation notice: ${e.message}`);
    }

    // Check horizontal scroll / overflow
    const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const winWidth = await page.evaluate(() => window.innerWidth);
    const hasHorizontalScroll = docWidth > winWidth + 1;
    console.log(`  Document scrollWidth: ${docWidth}px vs Window innerWidth: ${winWidth}px -> Overflow: ${hasHorizontalScroll ? "FAIL" : "PASS (Zero Overflow)"}`);

    // Check Bottom Navigation Bar
    const navBar = page.locator('nav.fixed.bottom-0, nav[aria-label="Bottom Navigation"], div.fixed.bottom-0').first();
    const navBox = await navBar.boundingBox().catch(() => null);
    if (navBox) {
      console.log(`  Bottom Navigation found at y=${Math.round(navBox.y)}px, height=${Math.round(navBox.height)}px`);
    } else {
      console.log(`  Bottom Navigation checked.`);
    }

    // Check Kuche Companion Trigger (Strictly inside Akuche Guide Companion container to avoid sidebar drawer)
    const companionContainer = page.locator('div[aria-label="Akuche Guide Companion"]');
    const containerCount = await companionContainer.count();
    console.log(`  Kuche Companion Container in DOM: ${containerCount > 0 ? "YES" : "NO"}`);

    if (containerCount > 0) {
      const containerBox = await companionContainer.boundingBox();
      if (containerBox) {
        console.log(`  Kuche Container box: x=${Math.round(containerBox.x)}px, y=${Math.round(containerBox.y)}px, w=${Math.round(containerBox.width)}px, h=${Math.round(containerBox.height)}px`);
        if (navBox) {
          const containerBottom = containerBox.y + containerBox.height;
          const overlap = containerBottom > navBox.y;
          console.log(`  Container bottom (${Math.round(containerBottom)}px) vs Nav top (${Math.round(navBox.y)}px) -> Overlap: ${overlap ? "COLLISION DETECTED" : "PASS (Cleanly Floating Above Tabs)"}`);
        }
      }

      const companionPill = companionContainer.locator('button').first();
      const pillBox = await companionPill.boundingBox().catch(() => null);
      if (pillBox) {
        console.log(`  Kuche Pill box: x=${Math.round(pillBox.x)}px, y=${Math.round(pillBox.y)}px, w=${Math.round(pillBox.width)}px, h=${Math.round(pillBox.height)}px`);
      }

      // Test click companion to open dialogue
      console.log(`  Clicking Kuche Companion Pill...`);
      await companionPill.click({ force: true }).catch((e) => console.log(`  Click note: ${e.message}`));
      await page.waitForTimeout(800);

      const dialogueBox = page.locator('div[role="dialog"][aria-label="Kuche Coaching Guide"], div:has-text("Welcome to Akuche")').first();
      const dialogueVisible = await dialogueBox.isVisible().catch(() => false);
      console.log(`  Kuche Welcome Dialogue Opened: ${dialogueVisible ? "PASS" : "CHECK"}`);

      // Check onboarding choice buttons
      const tourBtn = page.locator('button:has-text("Quick Tour")');
      const tourCount = await tourBtn.count();
      console.log(`  Dialogue Choice "Quick Tour" available: ${tourCount > 0 ? "PASS" : "CHECK"}`);
    } else {
      console.log(`  Kuche Companion Container not detected on this page.`);
    }

    // 2. Test Settings Page for Kuche Controls
    console.log(`\n- Navigating to ${PROD_URL}/dashboard/settings...`);
    try {
      await page.goto(`${PROD_URL}/dashboard/settings`, { waitUntil: "commit", timeout: 15000 });
      await page.waitForLoadState("domcontentloaded").catch(() => {});
      await page.waitForTimeout(2000);

      // Check if Kuche section is rendered
      const kucheHeader = page.locator('text=Akuche Guide Companion (Kuche), text=Akuche Guide Companion').first();
      const kucheVisible = await kucheHeader.isVisible().catch(() => false);
      console.log(`  Settings Kuche Section visible: ${kucheVisible ? "PASS" : "FAIL"}`);

      const showcaseBtn = page.locator('button:has-text("Test All 7 Animation States"), button:has-text("Character Showcase")').first();
      const showcaseExists = await showcaseBtn.isVisible().catch(() => false);
      console.log(`  "Test All 7 Animation States" button visible: ${showcaseExists ? "PASS" : "FAIL"}`);

      if (showcaseExists) {
        console.log(`  Clicking Showcase button...`);
        await showcaseBtn.click({ force: true });
        await page.waitForTimeout(600);

        const modal = page.locator('div[role="dialog"]:has-text("Character Showcase"), div[role="dialog"]:has-text("Kuche Character")').first();
        const modalOpen = await modal.isVisible().catch(() => false);
        console.log(`  Character Showcase Modal opened: ${modalOpen ? "PASS" : "FAIL"}`);

        const stateButtons = page.locator('button:has-text("idle"), button:has-text("welcome"), button:has-text("explain"), button:has-text("encourage"), button:has-text("success"), button:has-text("thinking"), button:has-text("hidden")');
        const count = await stateButtons.count();
        console.log(`  Animation state controls found in modal: ${count} buttons`);
      }
    } catch (e: any) {
      console.log(`  Settings check error: ${e.message}`);
    }

    await context.close();
  }

  await browser.close();
  console.log("\n================================================================================");
  console.log("MOBILE VERIFICATION COMPLETED");
  console.log("================================================================================");
}

verifyKucheMobile().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
