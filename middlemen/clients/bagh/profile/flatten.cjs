// Render each profile page to an image, so the PDF looks identical in every viewer (WhatsApp, phones, browsers).
// Usage: node flatten.cjs <output folder for page images>
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const out = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2.5 });
  await p.goto("file://" + path.resolve("profile.html"), { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const els = await p.$$(".p");
  for (let i = 0; i < els.length; i++) {
    await els[i].screenshot({ path: path.join(out, "pg-" + String(i + 1).padStart(2, "0") + ".png") });
  }
  await b.close();
})();
