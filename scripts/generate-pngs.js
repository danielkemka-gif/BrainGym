const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation for PNG chunks
function makeCrcTable() {
  let c;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  return crcTable;
}
const crcTable = makeCrcTable();

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowOffsetScanline = y * (width * 4 + 1);
    scanlines[rowOffsetScanline] = 0; // Filter byte: None
    const rowOffsetRgba = y * width * 4;
    rgbaBuffer.copy(scanlines, rowOffsetScanline + 1, rowOffsetRgba, rowOffsetRgba + width * 4);
  }

  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Color helpers
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hexToRgba(hex, alpha = 255) {
  const num = parseInt(hex.replace('#', ''), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, alpha];
}

// Point-in-polygon helper
function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Rounded rectangle SDF
function sdRoundedBox(px, py, bx, by, r) {
  const qx = Math.abs(px) - bx + r;
  const qy = Math.abs(py) - by + r;
  return Math.min(Math.max(qx, qy), 0.0) + Math.hypot(Math.max(qx, 0.0), Math.max(qy, 0.0)) - r;
}

// Render Akuche Brand Mark at any resolution
function renderAkucheMark(size) {
  const buf = Buffer.alloc(size * size * 4);
  const scale = size / 512;

  // Outer Squircle box parameters
  const cornerRadius = 112 * scale;
  const boxHalfW = (512 / 2) * scale;
  const boxHalfH = (512 / 2) * scale;

  // Polygon coordinates scaled
  const outerA = [
    [136 * scale, 392 * scale],
    [236 * scale, 158 * scale],
    [276 * scale, 158 * scale],
    [376 * scale, 392 * scale],
    [356 * scale, 420 * scale],
    [326 * scale, 420 * scale],
    [306 * scale, 406 * scale],
    [284 * scale, 346 * scale],
    [228 * scale, 346 * scale],
    [206 * scale, 406 * scale],
    [186 * scale, 420 * scale],
    [156 * scale, 420 * scale],
  ];

  const innerChevron = [
    [256 * scale, 192 * scale],
    [296 * scale, 288 * scale],
    [216 * scale, 288 * scale],
  ];

  const barX0 = 192 * scale;
  const barY0 = 308 * scale;
  const barW = 128 * scale;
  const barH = 34 * scale;
  const barR = 17 * scale;

  const sparkCx = 256 * scale;
  const sparkCy = 94 * scale;
  const sparkR = 36 * scale;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Centered coords for box
      const cx = x - size / 2;
      const cy = y - size / 2;
      const distBox = sdRoundedBox(cx, cy, boxHalfW - 4 * scale, boxHalfH - 4 * scale, cornerRadius);

      if (distBox > 1.5) {
        // Transparent outside
        buf[idx] = 0;
        buf[idx + 1] = 0;
        buf[idx + 2] = 0;
        buf[idx + 3] = 0;
        continue;
      }

      // Base background: Deep rich emerald gradient (#042F24 -> #021B14)
      const bgT = (x + y) / (size * 2);
      let r = lerp(4, 2, bgT);
      let g = lerp(47, 27, bgT);
      let b = lerp(36, 20, bgT);
      let a = 255;

      // Antialias edge
      if (distBox > -1.5) {
        a = Math.round(lerp(255, 0, (distBox + 1.5) / 3));
      }

      // Border stroke (1px equivalent)
      const borderDist = Math.abs(distBox);
      if (borderDist < 3.5 * scale) {
        const strokeT = 1.0 - (borderDist / (3.5 * scale));
        r = lerp(r, 16, strokeT * 0.4);
        g = lerp(g, 185, strokeT * 0.4);
        b = lerp(b, 129, strokeT * 0.4);
      }

      // 1. Check if inside Golden Crown Spark (Wisdom Node - Ako)
      const sparkDist = Math.hypot(x - sparkCx, y - sparkCy);
      if (sparkDist <= sparkR + 1.5) {
        const sparkT = (x - sparkCx + sparkR) / (sparkR * 2);
        const sr = lerp(254, 245, sparkT);
        const sg = lerp(240, 158, sparkT);
        const sb = lerp(138, 11, sparkT);

        if (sparkDist <= sparkR - 1.5) {
          r = sr; g = sg; b = sb;
        } else {
          const edgeAlpha = (sparkR + 1.5 - sparkDist) / 3.0;
          r = lerp(r, sr, edgeAlpha);
          g = lerp(g, sg, edgeAlpha);
          b = lerp(b, sb, edgeAlpha);
        }
      }

      // Spark Ray Accents
      const isRayY = Math.abs(x - sparkCx) < 5 * scale && ((y >= (36 * scale) && y <= (60 * scale)) || (y >= (128 * scale) && y <= (152 * scale)));
      const isRayX = Math.abs(y - sparkCy) < 5 * scale && ((x >= (198 * scale) && x <= (222 * scale)) || (x >= (290 * scale) && x <= (314 * scale)));
      if (isRayY || isRayX) {
        r = 251; g = 191; b = 36;
      }

      // 2. Check if inside outer "A" polygon
      const inOuterA = pointInPoly(x, y, outerA);
      const inInnerChev = pointInPoly(x, y, innerChevron);

      if (inOuterA && !inInnerChev) {
        // Emerald gradient on the "A" arch (#047857 -> #059669 -> #10b981)
        const archT = (size - y) / size;
        const ar = lerp(4, 16, archT);
        const ag = lerp(120, 185, archT);
        const ab = lerp(87, 129, archT);
        r = ar; g = ag; b = ab;
      }

      // 3. Action Crossbar (#34d399) with rounded ends
      const barDx = x - (barX0 + barW / 2);
      const barDy = y - (barY0 + barH / 2);
      const barDist = sdRoundedBox(barDx, barDy, (barW / 2) - barR, (barH / 2) - barR, barR);
      if (barDist <= 1.5) {
        if (barDist <= -1.5) {
          r = 52; g = 211; b = 153;
        } else {
          const edgeAlpha = (1.5 - barDist) / 3.0;
          r = lerp(r, 52, edgeAlpha);
          g = lerp(g, 211, edgeAlpha);
          b = lerp(b, 153, edgeAlpha);
        }
      }

      buf[idx] = Math.round(r);
      buf[idx + 1] = Math.round(g);
      buf[idx + 2] = Math.round(b);
      buf[idx + 3] = Math.round(a);
    }
  }

  return buf;
}

// Generate all target PNG files
const publicDir = path.resolve(__dirname, '../public');
const iconsDir = path.resolve(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating high-resolution Akuche PNG assets...');

const targets = [
  { path: path.join(publicDir, 'logo.png'), size: 512 },
  { path: path.join(publicDir, 'akuche-logo.png'), size: 512 },
  { path: path.join(publicDir, 'favicon.png'), size: 64 },
  { path: path.join(publicDir, 'og-image.png'), size: 512 },
  { path: path.join(iconsDir, 'akuche-192.png'), size: 192 },
  { path: path.join(iconsDir, 'akuche-512.png'), size: 512 },
  { path: path.join(iconsDir, 'akuche-apple-touch.png'), size: 180 },
  { path: path.join(iconsDir, 'apple-touch-icon.png'), size: 180 },
  { path: path.join(iconsDir, 'icon-192.png'), size: 192 },
  { path: path.join(iconsDir, 'icon-512.png'), size: 512 },
  { path: path.join(iconsDir, 'icon-192x192.png'), size: 192 },
  { path: path.join(iconsDir, 'icon-512x512.png'), size: 512 },
];

for (const target of targets) {
  const rawRgba = renderAkucheMark(target.size);
  const pngData = encodePng(target.size, target.size, rawRgba);
  fs.writeFileSync(target.path, pngData);
  console.log(`✓ Generated: ${path.relative(process.cwd(), target.path)} (${target.size}x${target.size})`);
}

console.log('All Akuche PNG icons successfully rasterized!');
