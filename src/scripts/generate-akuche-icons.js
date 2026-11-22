const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure directories exist
const publicDir = path.join(__dirname, '..', '..', 'public');
const iconsDir = path.join(publicDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Master Vector SVG — Standard (Edge-to-Edge with rounded pill container)
const masterSvgStandard = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Deep Obsidian Green Background Gradient -->
    <linearGradient id="bg-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#03251D" />
      <stop offset="50%" stopColor="#042F24" />
      <stop offset="100%" stopColor="#021C16" />
    </linearGradient>

    <!-- Vibrant Emerald / Fresh Lime Growth Gradient -->
    <linearGradient id="emerald-grad" x1="120" y1="440" x2="392" y2="90" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#059669" />
      <stop offset="45%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#34D399" />
    </linearGradient>

    <!-- Radiant Clarity Gold Spark Gradient -->
    <linearGradient id="gold-grad" x1="220" y1="50" x2="292" y2="130" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#FDE68A" />
      <stop offset="40%" stopColor="#F59E0B" />
      <stop offset="100%" stopColor="#D97706" />
    </linearGradient>

    <!-- Subtle Inner Glow Filter -->
    <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background container -->
  <rect width="512" height="512" rx="112" fill="url(#bg-grad)" />
  <rect x="2" y="2" width="508" height="508" rx="110" stroke="#10B981" stroke-opacity="0.28" stroke-width="4" />

  <!-- The Master 'A' Structure — Clarity, Strength, Upward Momentum -->
  <!-- Left to Right Ascending Arch -->
  <path d="M142 396L240 162C246 148 266 148 272 162L370 396C375 408 366 422 352 422H326C318 422 310 416 307 408L284 350H228L205 408C202 416 194 422 186 422H160C146 422 137 408 142 396Z" fill="url(#emerald-grad)" />

  <!-- Inner Apex Chevron (Wisdom / Intentional Thought) -->
  <path d="M256 200L298 292H214L256 200Z" fill="#03251D" fill-opacity="0.95" />

  <!-- Action Bridge Crossbar (Connecting Insight to Execution) -->
  <rect x="206" y="312" width="100" height="26" rx="13" fill="#34D399" />

  <!-- Crown Radiant Spark — Illumination & Breakthrough (Ako) -->
  <circle cx="256" cy="98" r="32" fill="url(#gold-grad)" filter="url(#soft-glow)" />
  <!-- Spark Rays -->
  <path d="M256 46V64M256 132V150M204 98H222M290 98H308M219 61L232 74M280 122L293 135M293 61L280 74M232 122L219 135" stroke="#FBBF24" stroke-width="8" stroke-linecap="round" />
</svg>`;

// 2. Maskable Vector SVG — Has 20% safe-zone margin around the logo so Android WebAPK never crops it
const masterSvgMaskable = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-grad-mask" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#03251D" />
      <stop offset="50%" stopColor="#042F24" />
      <stop offset="100%" stopColor="#021C16" />
    </linearGradient>

    <linearGradient id="emerald-grad-mask" x1="120" y1="440" x2="392" y2="90" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#059669" />
      <stop offset="45%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#34D399" />
    </linearGradient>

    <linearGradient id="gold-grad-mask" x1="220" y1="50" x2="292" y2="130" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#FDE68A" />
      <stop offset="40%" stopColor="#F59E0B" />
      <stop offset="100%" stopColor="#D97706" />
    </linearGradient>
  </defs>

  <!-- Full background for Android circle/squircle masking -->
  <rect width="512" height="512" fill="url(#bg-grad-mask)" />

  <!-- Centered, scaled content (scaled down to 72% to fit perfectly within Android's 80% safe circle) -->
  <g transform="translate(71.68, 71.68) scale(0.72)">
    <!-- The Master 'A' Structure -->
    <path d="M142 396L240 162C246 148 266 148 272 162L370 396C375 408 366 422 352 422H326C318 422 310 416 307 408L284 350H228L205 408C202 416 194 422 186 422H160C146 422 137 408 142 396Z" fill="url(#emerald-grad-mask)" />
    <path d="M256 200L298 292H214L256 200Z" fill="#03251D" fill-opacity="0.95" />
    <rect x="206" y="312" width="100" height="26" rx="13" fill="#34D399" />
    <circle cx="256" cy="98" r="32" fill="url(#gold-grad-mask)" />
    <path d="M256 46V64M256 132V150M204 98H222M290 98H308M219 61L232 74M280 122L293 135M293 61L280 74M232 122L219 135" stroke="#FBBF24" stroke-width="8" stroke-linecap="round" />
  </g>
</svg>`;

async function generateAllIcons() {
  console.log('Generating high-res Akuche icons...');

  // Save SVGs
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), masterSvgStandard);
  fs.writeFileSync(path.join(publicDir, 'akuche-logo.svg'), masterSvgStandard);
  fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), masterSvgStandard);
  fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), masterSvgStandard);

  const standardBuf = Buffer.from(masterSvgStandard);
  const maskableBuf = Buffer.from(masterSvgMaskable);

  // 1. 512x512 standard
  const png512 = await sharp(standardBuf).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'akuche-logo.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'logo.png'), png512);
  fs.writeFileSync(path.join(iconsDir, 'akuche-512.png'), png512);
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);
  fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), png512);

  // 2. 512x512 maskable (Android WebAPK safe zone)
  const pngMaskable512 = await sharp(maskableBuf).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), pngMaskable512);

  // 3. 192x192 standard
  const png192 = await sharp(standardBuf).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(iconsDir, 'akuche-192.png'), png192);
  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), png192);

  // 4. 192x192 maskable
  const pngMaskable192 = await sharp(maskableBuf).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.png'), pngMaskable192);

  // 5. 180x180 Apple Touch Icon
  const png180 = await sharp(standardBuf).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(iconsDir, 'akuche-apple-touch.png'), png180);

  // 6. Favicon 64x64 & 32x32
  const png64 = await sharp(standardBuf).resize(64, 64).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), png64);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png64);

  console.log('All icons generated successfully!');
}

generateAllIcons().catch((err) => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
