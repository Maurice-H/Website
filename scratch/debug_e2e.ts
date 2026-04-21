import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  
  // Wait for initial render
  await page.waitForSelector('.nav-conveyor', { timeout: 10000 });
  await page.screenshot({ path: 'artifacts/initial.png' });
  
  // Try to click the first nav window
  const firstWindow = page.locator('.nav-window').first();
  console.log('Clicking first window...');
  await firstWindow.click();
  
  // Wait for transition
  console.log('Waiting for content phase...');
  try {
    await page.waitForSelector('button:has-text("Back to Navigation")', { timeout: 5000 });
    console.log('Transition successful!');
  } catch (e) {
    console.log('Transition failed or timed out.');
  }
  
  await page.screenshot({ path: 'artifacts/after-click.png' });
  await browser.close();
})();
