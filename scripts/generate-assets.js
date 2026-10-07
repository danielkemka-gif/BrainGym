const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');
const iconsDir = path.resolve(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Full vector SVG source for Akuche
const svgMarkContent = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="akuche-bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#042F24" />
      <stop offset="100%" stopColor="#021B14" />
    </linearGradient>
    <linearGradient id="akuche-emerald" x1="64" y1="448" x2="448" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#047857" />
      <stop offset="50%" stopColor="#059669" />
      <stop offset="100%" stopColor="#10b981" />
    </linearGradient>
    <linearGradient id="akuche-gold" x1="213" y1="42" x2="298" y2="128" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="50%" stopColor="#fbbf24" />
      <stop offset="100%" stopColor="#f59e0b" />
    </linearGradient>
    <filter id="gold-glow" x="170" y="10" width="172" height="172" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.984 0 0 0 0 0.749 0 0 0 0 0.141 0 0 0 0.7 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
    </filter>
  </defs>

  <rect width="512" height="512" rx="112" fill="url(#akuche-bg)" />
  <rect x="8" y="8" width="496" height="496" rx="104" stroke="#10b981" stroke-opacity="0.35" stroke-width="10" />

  {/* Left & Right ascending strokes forming the iconic 'A' */}
  <path
    d="M136 392L236 158C243 142 269 142 276 158L376 392C382 406 371 420 356 420H326C317 420 310 414 306 406L284 346H228L206 406C202 414 195 420 186 420H156C141 420 130 406 136 392Z"
    fill="url(#akuche-emerald)"
  />

  {/* Inner chevron space (Uche - Intentional Thought) */}
  <path
    d="M256 192L296 288H216L256 192Z"
    fill="#021B14"
  />

  {/* Center Action crossbar connecting thought to execution */}
  <rect x="192" y="308" width="128" height="34" rx="17" fill="#34d399" />

  {/* Radiant Wisdom Crown Spark (Ako - Knowledge & Light) */}
  <g filter="url(#gold-glow)">
    <circle cx="256" cy="94" r="36" fill="url(#akuche-gold)" />
  </g>
  <path d="M256 36V60M256 128V152M198 94H222M290 94H314" stroke="#fde047" stroke-width="10" stroke-linecap="round" />
</svg>
`;

// Rich OpenGraph banner SVG
const ogCardContent = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="og-bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#021B14" />
      <stop offset="50%" stopColor="#042F24" />
      <stop offset="100%" stopColor="#064E3B" />
    </linearGradient>
    <linearGradient id="og-emerald" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#047857" />
      <stop offset="50%" stopColor="#059669" />
      <stop offset="100%" stopColor="#10b981" />
    </linearGradient>
    <linearGradient id="og-gold" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#fbbf24" />
      <stop offset="100%" stopColor="#f59e0b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#og-bg)" />
  <circle cx="1000" cy="150" r="350" fill="#059669" fill-opacity="0.12" />
  <circle cx="200" cy="500" r="250" fill="#10b981" fill-opacity="0.08" />

  <!-- Logo Mark Left -->
  <g transform="translate(120, 165)">
    <rect width="300" height="300" rx="64" fill="#042F24" stroke="#10b981" stroke-width="6" stroke-opacity="0.4" />
    <path
      d="M80 230L139 92C143 83 157 83 161 92L220 230C224 238 217 246 208 246H191C186 246 182 242 179 237L166 202H134L121 237C118 242 114 246 109 246H92C83 246 76 238 80 230Z"
      fill="url(#og-emerald)"
    />
    <path d="M150 112L174 168H126L150 112Z" fill="#021B14" />
    <rect x="113" y="180" width="74" height="20" rx="10" fill="#34d399" />
    <circle cx="150" cy="54" r="20" fill="url(#og-gold)" />
  </g>

  <!-- Typography Right -->
  <g transform="translate(480, 220)">
    <text x="0" y="60" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="80" letter-spacing="2">AKUCHE</text>
    <circle cx="390" cy="40" r="10" fill="#10b981" />
    <text x="0" y="130" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="32" letter-spacing="1">THINK BETTER. DECIDE BETTER. LIVE BETTER.</text>
    <text x="0" y="180" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="22">Your intelligent personal thinking, problem-solving &amp; action companion.</text>
  </g>
</svg>
`;

async function generateAll() {
  console.log('Launching headless browser with Playwright...');
  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await context.newPage();

  // Helper to render HTML with SVG and screenshot
  async function renderSvgToPng(svg, width, height, outputPath) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: ${width}px; height: ${height}px; background: transparent; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            svg { width: 100%; height: 100%; }
          </style>
        </head>
        <body>${svg}</body>
      </html>
    `;
    await page.setViewportSize({ width, height });
    await page.setContent(html);
    await page.screenshot({ path: outputPath, omitBackground: true, type: 'png' });
    console.log(`Generated: ${path.relative(process.cwd(), outputPath)} (${width}x${height})`);
  }

  // 1. Core Logos
  await renderSvgToPng(svgMarkContent, 512, 512, path.join(publicDir, 'logo.png'));
  await renderSvgToPng(svgMarkContent, 512, 512, path.join(publicDir, 'akuche-logo.png'));
  await renderSvgToPng(svgMarkContent, 64, 64, path.join(publicDir, 'favicon.png'));
  await renderSvgToPng(ogCardContent, 1200, 630, path.join(publicDir, 'og-image.png'));

  // 2. Icon Variations
  const iconTargets = [
    { name: 'akuche-192.png', size: 192 },
    { name: 'akuche-512.png', size: 512 },
    { name: 'akuche-apple-touch.png', size: 180 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
  ];

  for (const target of iconTargets) {
    await renderSvgToPng(svgMarkContent, target.size, target.size, path.join(iconsDir, target.name));
  }

  await browser.close();
  console.log('All Akuche brand icons and PNGs successfully generated!');
}

generateAll().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
