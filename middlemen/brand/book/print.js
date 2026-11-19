const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('http://localhost:4320/brand/book/book.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: 'Middlemen_Brand_Identity.pdf', width: '1920px', height: '1080px', printBackground: true });
  fs.mkdirSync('pages', { recursive: true });
  const els = await p.$$('.p');
  for (let i = 0; i < els.length; i++) {
    await els[i].screenshot({ path: 'pages/' + String(i + 1).padStart(2, '0') + '.png' });
  }
  // contact sheet for review
  const imgs = fs.readdirSync('pages').filter((f) => f.endsWith('.png')).sort();
  const q = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await q.setContent('<body style="margin:0;background:#444;display:grid;grid-template-columns:repeat(4,1fr);gap:4px">' +
    imgs.map((f) => '<img style="width:100%" src="data:image/png;base64,' + fs.readFileSync('pages/' + f).toString('base64') + '">').join('') + '</body>');
  await q.screenshot({ path: process.argv[2], fullPage: true });
  console.log(els.length);
  await b.close();
})();
