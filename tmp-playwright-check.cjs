const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warning') errors.push('console:' + msg.type() + ': ' + msg.text()); });
  page.on('pageerror', err => errors.push('pageerror: ' + err.message));
  page.on('requestfailed', req => errors.push('requestfailed: ' + req.url() + ' :: ' + req.failure().errorText));
  const resp = await page.goto('https://www.gg-way.ru/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(5000);
  console.log('status=' + (resp ? resp.status() : 'no-response'));
  console.log('title=' + await page.title());
  console.log('rootHtml=' + await page.locator('#root').innerHTML());
  console.log('bodyText=' + (await page.locator('body').innerText()).slice(0,1000));
  await page.screenshot({ path: 'C:/Users/Максим/OneDrive/Документы/Playground/buyer-from-china/tmp-gg-way.png', fullPage: false });
  console.log('errors=' + JSON.stringify(errors, null, 2));
  await browser.close();
})();
