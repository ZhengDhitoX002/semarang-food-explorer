import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let errors = [];
  page.on('console', msg => { if(msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('http://127.0.0.1:8000/merchant/dashboard');
  await page.waitForTimeout(3000); // wait for render
  console.log('--- ERRORS ---');
  console.log(errors.join("\n"));
  await browser.close();
  process.exit(0);
})();
