// Print an HTML file to PDF (A4 unless the page sets its own @page size), and save a PNG of page one.
// Usage: node print-pdf.js input.html output.pdf [preview.png]
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const [input, output, preview] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  await p.goto("file://" + path.resolve(input), { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: output, preferCSSPageSize: true, printBackground: true, format: "A4" });
  if (preview) await p.screenshot({ path: preview, fullPage: true });
  await b.close();
})();
