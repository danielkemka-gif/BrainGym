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

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdrData);

  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowOffsetScanline = y * (width * 4 + 1);
    scanlines[rowOffsetScanline] = 0;
    const rowOffsetRgba = y * width * 4;
    rgbaBuffer.copy(scanlines, rowOffsetScanline + 1, rowOffsetRgba, rowOffsetRgba + width * 4);
  }

  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function sdRoundedBox(px, py, bx, by, r) {
  const qx = Math.abs(px) - bx + r;
  const qy = Math.abs(py) - by + r;
  return Math.min(Math.max(qx, qy), 0.0) + Math.hypot(Math.max(qx, 0.0), Math.max(qy, 0.0)) - r;
}

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

// Generate 1200x630 OpenGraph Banner
function generateOgBanner(width = 1200, height = 630) {
  const buf = Buffer.alloc(width * height * 4);

  // Logo position and size
  const markSize = 360;
  const markX0 = 600 - markSize / 2;
  const markY0 = 315 - markSize / 2;
  const scale = markSize / 512;

  // Box coordinates
  const cornerRadius = 90 * scale;
  const boxHalfW = (markSize / 2) - 8;
  const boxHalfH = (markSize / 2) - 8;
  const markCenterX = 600;
  const markCenterY = 315;

  // Polygon coords relative to mark top-left
  const outerA = [
    [markX0 + 136 * scale, markY0 + 392 * scale],
    [markX0 + 236 * scale, markY0 + 158 * scale],
    [markX0 + 276 * scale, markY0 + 158 * scale],
    [markX0 + 376 * scale, markY0 + 392 * scale],
    [markX0 + 356 * scale, markY0 + 420 * scale],
    [markX0 + 326 * scale, markY0 + 420 * scale],
    [markX0 + 306 * scale, markY0 + 406 * scale],
    [markX0 + 284 * scale, markY0 + 346 * scale],
    [markX0 + 228 * scale, markY0 + 346 * scale],
    [markX0 + 206 * scale, markY0 + 406 * scale],
    [markX0 + 186 * scale, markY0 + 420 * scale],
    [markX0 + 156 * scale, markY0 + 420 * scale],
  ];

  const innerChevron = [
    [markX0 + 256 * scale, markY0 + 192 * scale],
    [markX0 + 296 * scale, markY0 + 288 * scale],
    [markX0 + 216 * scale, markY0 + 288 * scale],
  ];

  const barX0 = markX0 + 192 * scale;
  const barY0 = markY0 + 308 * scale;
  const barW = 128 * scale;
  const barH = 34 * scale;
  const barR = 17 * scale;

  const sparkCx = markX0 + 256 * scale;
  const sparkCy = markY0 + 94 * scale;
  const sparkR = 36 * scale;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Deep rich radial emerald background (#042F24 -> #01140E)
      const distFromCenter = Math.hypot(x - 600, y - 315) / 700;
      let r = lerp(4, 1, Math.min(1, distFromCenter));
      let g = lerp(47, 18, Math.min(1, distFromCenter));
      let b = lerp(36, 12, Math.min(1, distFromCenter));
      let a = 255;

      // Soft ambient emerald halo behind logo
      const glowDist = Math.hypot(x - 600, y - 315);
      if (glowDist < 420) {
        const glowT = 1.0 - (glowDist / 420);
        r = lerp(r, 16, glowT * 0.45);
        g = lerp(g, 185, glowT * 0.45);
        b = lerp(b, 129, glowT * 0.45);
      }

      // Check mark container squircle
      const lx = x - markCenterX;
      const ly = y - markCenterY;
      const distBox = sdRoundedBox(lx, ly, boxHalfW, boxHalfH, cornerRadius);

      if (distBox <= 0) {
        // Inside Logo Box
        const bgT = (x - markX0 + y - markY0) / (markSize * 2);
        r = lerp(4, 2, bgT);
        g = lerp(47, 27, bgT);
        b = lerp(36, 20, bgT);

        // Border
        const borderDist = Math.abs(distBox);
        if (borderDist < 4 * scale) {
          const strokeT = 1.0 - (borderDist / (4 * scale));
          r = lerp(r, 16, strokeT * 0.8);
          g = lerp(g, 185, strokeT * 0.8);
          b = lerp(b, 129, strokeT * 0.8);
        }

        // 1. Spark
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

        // Spark rays
        const isRayY = Math.abs(x - sparkCx) < 5 * scale && ((y >= (markY0 + 36 * scale) && y <= (markY0 + 60 * scale)) || (y >= (markY0 + 128 * scale) && y <= (markY0 + 152 * scale)));
        const isRayX = Math.abs(y - sparkCy) < 5 * scale && ((x >= (markX0 + 198 * scale) && x <= (markX0 + 222 * scale)) || (x >= (markX0 + 290 * scale) && x <= (markX0 + 314 * scale)));
        if (isRayY || isRayX) {
          r = 251; g = 191; b = 36;
        }

        // 2. "A" Arch
        const inOuterA = pointInPoly(x, y, outerA);
        const inInnerChev = pointInPoly(x, y, innerChevron);

        if (inOuterA && !inInnerChev) {
          const archT = (markY0 + markSize - y) / markSize;
          r = lerp(4, 16, archT);
          g = lerp(120, 185, archT);
          b = lerp(87, 129, archT);
        }

        // 3. Crossbar
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
      }

      buf[idx] = Math.round(r);
      buf[idx + 1] = Math.round(g);
      buf[idx + 2] = Math.round(b);
      buf[idx + 3] = a;
    }
  }

  return buf;
}

const publicDir = path.resolve(__dirname, '../public');
const ogPath1 = path.join(publicDir, 'og-image.png');
const ogPath2 = path.join(publicDir, 'og-image-v9.png');

console.log('Generating 1200x630 OpenGraph Banner for Link Sharing...');
const rawOg = generateOgBanner(1200, 630);
const pngData = encodePng(1200, 630, rawOg);

fs.writeFileSync(ogPath1, pngData);
fs.writeFileSync(ogPath2, pngData);
console.log('✓ Successfully generated 1200x630 og-image.png & og-image-v9.png!');
