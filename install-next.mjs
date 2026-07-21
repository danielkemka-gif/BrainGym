import { createGunzip } from "zlib";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";

const pkg = "next";
const version = "15.3.2";
const url = `https://registry.npmjs.org/${pkg}/-/${pkg}-${version}.tgz`;

function extractTar(tarData) {
  const files = [];
  let offset = 0;
  while (offset < tarData.length - 512) {
    const header = tarData.slice(offset, offset + 512);
    const name = header.toString("ascii", 0, 100).replace(/\0/g, "").trim();
    const size =
      parseInt(
        header.toString("ascii", 124, 136).replace(/\0/g, "").trim(),
        8
      ) || 0;
    const type = header[156];
    if (!name) break;
    offset += 512;
    if (type === 0 || type === 48 || type === 53) {
      const content = tarData.slice(offset, offset + size);
      files.push({ name: name.replace(/^package\//, ""), content });
      offset += Math.ceil(size / 512) * 512;
    } else {
      offset += Math.ceil(size / 512) * 512;
    }
  }
  return files;
}

async function downloadWithRetry(url, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const chunks = [];
      let downloaded = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        downloaded += value.length;
        if (downloaded % (5 * 1024 * 1024) < value.length) {
          console.log(`  Downloaded ${(downloaded / 1024 / 1024).toFixed(1)}MB`);
        }
      }
      console.log(`  Downloaded ${(downloaded / 1024 / 1024).toFixed(1)}MB total`);
      return Buffer.concat(chunks);
    } catch (e) {
      console.log(`  Attempt ${i + 1} failed: ${e.message}. Retrying...`);
    }
  }
  throw new Error(`Failed to download after ${retries} attempts`);
}

async function main() {
  console.log(`Downloading ${pkg}@${version}...`);
  const start = Date.now();
  const buf = await downloadWithRetry(url);
  console.log(`Downloaded in ${((Date.now() - start) / 1000).toFixed(1)}s`);

  return new Promise((resolve, reject) => {
    const gunzip = createGunzip();
    const chunks = [];
    gunzip.on("data", (c) => chunks.push(c));
    gunzip.on("end", () => {
      const tarData = Buffer.concat(chunks);
      console.log(`Extracting ${(tarData.length / 1024 / 1024).toFixed(1)}MB...`);
      const files = extractTar(tarData);
      const base = join("C:\\Users\\danie\\Documents\\BRAINGYM APP\\node_modules", pkg);
      let count = 0;
      for (const f of files) {
        if (!f.name) continue;
        const fp = join(base, f.name);
        mkdirSync(dirname(fp), { recursive: true });
        writeFileSync(fp, f.content);
        count++;
      }
      const info = JSON.parse(files.find((f) => f.name === "package.json").content.toString());
      console.log(`✓ ${pkg}@${info.version} (${count} files)`);
      resolve();
    });
    gunzip.on("error", reject);
    gunzip.end(buf);
  });
}

main().catch(console.error);
