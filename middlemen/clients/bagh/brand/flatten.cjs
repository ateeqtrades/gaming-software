// Render each .p page of brand.html to an image. Usage: node flatten.cjs <output folder>
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const out = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
  await p.goto("file://" + path.resolve("brand.html"), { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const els = await p.$$(".p");
  for (let i = 0; i < els.length; i++) {
    await els[i].screenshot({ path: path.join(out, "pg-" + String(i + 1).padStart(2, "0") + ".png") });
  }
  await b.close();
})();
