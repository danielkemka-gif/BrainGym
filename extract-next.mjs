import { createGunzip } from "zlib";
import { readFileSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { join, dirname } from "path";

const base = "C:\\Users\\danie\\Documents\\BRAINGYM APP";

console.log("Reading tarball...");
const buf = readFileSync(join(base, "next-15.3.2.tgz"));

console.log("Gunzipping...");
const gunzip = createGunzip();
const chunks = [];
gunzip.on("data", (c) => chunks.push(c));

gunzip.on("end", () => {
  const tarData = Buffer.concat(chunks);
  console.log(`Uncompressed size: ${(tarData.length / 1024 / 1024).toFixed(1)} MB`);

  let offset = 0;
  let count = 0;
  const target = join(base, "node_modules", "next");

  while (offset < tarData.length - 512) {
    const header = tarData.slice(offset, offset + 512);
    const name = header.toString("ascii", 0, 100).replace(/\0/g, "").trim();
    const size =
      parseInt(
        header.toString("ascii", 124, 136).replace(/\0/g, "").trim(),
        8
      ) || 0;
    const type = header[156];
    if (!name || name.length === 0) break;
    offset += 512;

    const fname = name.replace(/^package\//, "");
    if (type === 0 || type === 48 || type === 53) {
      const content = tarData.slice(offset, offset + size);
      if (fname) {
        const fp = join(target, fname);
        mkdirSync(dirname(fp), { recursive: true });
        writeFileSync(fp, content);
        count++;
      }
      offset += Math.ceil(size / 512) * 512;
    } else {
      offset += Math.ceil(size / 512) * 512;
    }
  }

  const info = JSON.parse(
    readFileSync(join(target, "package.json"), "utf-8")
  );
  console.log(`✓ next@${info.version} extracted (${count} files)`);
  rmSync(join(base, "extract-next.mjs"));
});

gunzip.end(buf);
