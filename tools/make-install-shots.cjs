// The two screens the install page shows, re-shot from the live apps.
// 375x780 at deviceScaleFactor 2, which is the 750x1560 the page expects.
//
//   (cd befree-apps && python3 -m http.server 8124) &
//   PW=$(npm root -g)/playwright node tools/make-install-shots.cjs
//
// It prints what each screen ended up saying, so the alt text on
// gap/install.html and streak/install.html can be kept true.
const path = require('path');
const { chromium } = require(process.env.PW || 'playwright');

const BASE = process.env.BASE || 'http://localhost:8124/';
const OUT = path.join(__dirname, '..', 'befree-apps', 'shots');
const WHEN = new Date('2026-09-30T10:30:00');   // payday falls on Friday 9 October

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 780 }, deviceScaleFactor: 2,
    colorScheme: 'light', serviceWorkers: 'block', isMobile: true, hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(WHEN);
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  const tidy = () => page.evaluate(() => {
    document.querySelectorAll('.instcard').forEach(e => e.remove());
    document.querySelectorAll('#toast, .snack').forEach(e => e.classList.remove('on'));
    document.documentElement.dataset.theme = 'light';
  });

  // Gap, with the sample numbers
  await page.goto(BASE + 'gap/');
  await page.waitForTimeout(800);
  await page.click('#suDemo');
  await page.waitForTimeout(3000);
  await tidy();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, 'gap-today.jpg'), quality: 88, type: 'jpeg' });
  console.log('gap-today.jpg  ', (await page.evaluate(() =>
    document.querySelector('#homeHero') ? document.querySelector('#homeHero').innerText
      .replace(/\s+/g, ' ').slice(0, 110) : '(no hero)')));

  // Streak, with one habit running and a streak behind it
  await page.goto(BASE + 'streak/');
  await page.waitForTimeout(900);
  // the suggestion panel only offers the first habit, so the other two are
  // added from the same templates the app ships
  await page.locator('button', { hasText: 'Start this one' }).first().click();
  await page.waitForTimeout(350);
  await page.click('#hSave').catch(() => {});
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    const t = today(), first = S.habits[0];
    const more = [
      { tpl: 'review-daily', name: 'Quick money check', color: 1,
        action: "Open Gap, look at today's total and what's available until payday",
        when: 'Before bed', small: 'Glance at one number: available until payday' },
      { tpl: 'bills-weekly', name: 'Check bills due this week', color: 2,
        action: 'Look at Coming up in Gap and confirm anything already paid',
        when: 'Monday morning', small: 'Look at the next bill only' },
    ];
    more.forEach((m, i) => S.habits.push(Object.assign(
      JSON.parse(JSON.stringify(first)), m, { id: 'demo' + i, link: null, ref: null })));
    S.habits.forEach(h => {
      h.created = addD(t, -60);
      h.sched = [{ from: addD(t, -60), rule: { t: 'week', days: [1, 1, 1, 1, 1, 1, 1] } }];
      for (let i = 1; i < 40; i++) if (i % 13) S.ticks[h.id + '|' + addD(t, -i)] = (i % 5 ? 'd' : 's');
    });
    S.habits.slice(0, 2).forEach(h => { S.ticks[h.id + '|' + t] = 'd'; });   // two of three done
    save(); render();
  });
  await page.waitForTimeout(2600);
  await tidy();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, 'streak-today.jpg'), quality: 88, type: 'jpeg' });
  console.log('streak-today.jpg', (await page.evaluate(() =>
    document.querySelector('.hero') ? document.querySelector('.hero').innerText
      .replace(/\s+/g, ' ').slice(0, 110) : '(no hero)')));

  if (errs.length) console.log('page errors:', errs.slice(0, 3));
  await browser.close();
})();
