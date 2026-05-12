import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const en = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/locales/en.json'), 'utf-8'));
const de = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/locales/de.json'), 'utf-8'));

test.describe('Locale Switching and SEO', () => {
  let app: AppPage;

  test.beforeEach(async ({ page, context, browserName }) => {
    // Grant clipboard permissions for toast tests (Chromium only)
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }
    app = new AppPage(page);
    await app.goto();
  });

  test('should toggle language and update document attributes', async ({ page }) => {
    // 1. Check Initial State
    const initialLang = (await page.locator('html').getAttribute('lang')) || 'de';
    const _initialTitle = await page.title();

    const aboutTab = page.getByTestId('nav-window-about');
    const aboutLabel = aboutTab.locator('.window-title');
    await expect(aboutLabel).toBeVisible({ timeout: 15000 });

    // Use toContainText for resilience against icons/whitespace
    const expectedInitialAbout = initialLang === 'de' ? de.nav.aboutMe : en.nav.aboutMe;
    await expect(aboutLabel).toContainText(expectedInitialAbout);

    // 2. Toggle Language
    const switcher = page.locator('.locale-switcher');
    await expect(switcher).toBeVisible({ timeout: 15000 });
    await switcher.click({ force: true });

    // 3. Verify Language Change
    const expectedLang = initialLang === 'de' ? 'en' : 'de';
    await expect(page.locator('html')).toHaveAttribute('lang', expectedLang, { timeout: 10000 });

    // 4. Verify UI Label Update (The title of the NavWindow)
    const expectedUpdatedAbout = expectedLang === 'de' ? de.nav.aboutMe : en.nav.aboutMe;
    await expect(aboutLabel).toContainText(expectedUpdatedAbout, { timeout: 10000 });

    // 5. Verify CTA change (Klicken zum Erkunden / Click to explore)
    const ctaLabel = aboutTab.locator('.code-line').last();
    const expectedCTA = expectedLang === 'de' ? de.nav.about.cta : en.nav.about.cta;
    await expect(ctaLabel).toContainText(expectedCTA);
  });

  test('should show toast when copying discord user', async ({ page }) => {
    await app.navigateToSection('contact');

    const discordTab = page.getByTestId('channel-tab-discord');
    await discordTab.click();

    const copyBtn = page.getByTestId('copy-discord');
    await copyBtn.click();

    const toast = page.getByTestId('toast-item');
    await expect(toast).toBeVisible({ timeout: 15000 });

    // Use a regex to be resilient to language state and icons
    const expectedPattern = new RegExp(
      `(${de.contact.copied}|${en.contact.copied}|Kopiert|Copied)`
    );
    await expect(toast).toContainText(expectedPattern, { timeout: 10000 });
  });
});
