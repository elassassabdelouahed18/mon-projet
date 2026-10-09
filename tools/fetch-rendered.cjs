// Read a primary source that builds itself in JavaScript, so curl sees an
// empty shell. Chromium renders it, then the visible text is saved the same
// way tools/fetch-source.py saves a plain page.
//
//   PW=$(npm root -g)/playwright node tools/fetch-rendered.cjs <url> <name> [waitSelector]
const fs = require('fs'), path = require('path');
const { chromium } = require(process.env.PW || 'playwright');
const OUT = path.join(__dirname, '..', 'sources');

(async () => {
  const [url, name, sel] = process.argv.slice(2);
  // outbound traffic goes through the session proxy; Chromium needs telling
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 2000 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
             + '(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
    locale: 'en-US',
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();
  let status = 0;
  page.on('response', r => { if (r.url() === url || status === 0) status = r.status(); });
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (resp) status = resp.status();
  } catch (e) { /* networkidle can time out on a page that polls; take what rendered */ }
  if (sel) await page.waitForSelector(sel, { timeout: 20000 }).catch(() => {});
  await page.waitForLoadState('networkidle',{timeout:25000}).catch(()=>{});
  await page.waitForTimeout(2500);
  const text = await page.evaluate(() => document.body.innerText.replace(/\n{3,}/g, '\n\n'));
  const final = page.url();
  fs.mkdirSync(OUT, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(OUT, name + '.txt'),
    `# requested: ${url}\n# final:     ${final}\n# http:      ${status}\n`
    + `# type:      rendered in Chromium (the page builds itself in JavaScript)\n`
    + `# read on:   ${stamp}\n\n${text}`);
  console.log(`${status}  ${text.length.toString().padStart(7)} chars  rendered  ${name}  <- ${final}`);
  await browser.close();
})();
