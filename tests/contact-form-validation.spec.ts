import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const en = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/locales/en.json'), 'utf-8'));
const de = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/locales/de.json'), 'utf-8'));

import { AppPage } from './pages/app.page';

test.describe('Contact Form Validation', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
    await app.enterContentPhase();

    // Scroll to contact form
    await page.locator('#contact-form').scrollIntoViewIfNeeded();
  });

  test('should show error for too short message', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]', 'Test User');
    await page.fill('[data-testid="contact-email"]', 'e2e-mx-test-12345@mailinator.com');
    await page.fill('[data-testid="contact-message"]', 'Too short');

    await page.getByTestId('contact-submit').click();

    const error = page.getByTestId('contact-error-message');
    const lang = await page.locator('html').getAttribute('lang');
    const expected =
      lang === 'de' ? de.contact.form.errors.tooShort : en.contact.form.errors.tooShort;
    await expect(error).toContainText(expected, { timeout: 10000 });
  });

  test('should show error for repeating character patterns (spam check)', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]', 'Spam Bot');
    await page.fill('[data-testid="contact-email"]', 'e2e-mx-test-12345@mailinator.com');
    // Needs to be > 5 words and have a high frequency of repeating words
    await page.fill('[data-testid="contact-message"]', 'abcabc abcabc abcabc abcabc abcabc');

    await page.getByTestId('contact-submit').click();

    const error = page.getByTestId('contact-error-message');
    const lang = await page.locator('html').getAttribute('lang');
    const expected =
      lang === 'de'
        ? de.contact.form.errors.repeatingSequence
        : en.contact.form.errors.repeatingSequence;
    await expect(error).toContainText(expected, { timeout: 10000 });
  });

  test('should show error for low character variance', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]', 'Spam Bot');
    await page.fill('[data-testid="contact-email"]', 'e2e-mx-test-12345@mailinator.com');
    await page.fill('[data-testid="contact-message"]', 'aaaaa bbbbb ccccc ddddd eeeee');

    await page.getByTestId('contact-submit').click();

    const error = page.getByTestId('contact-error-message');
    const lang = await page.locator('html').getAttribute('lang');
    const expected =
      lang === 'de' ? de.contact.form.errors.lowVariance : en.contact.form.errors.lowVariance;
    await expect(error).toContainText(expected, { timeout: 10000 });
  });

  test('should show error for unsupported character sets (Cyrillic)', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]', 'Spam Bot');
    await page.fill('[data-testid="contact-email"]', 'e2e-mx-test-12345@mailinator.com');
    await page.fill('[data-testid="contact-message"]', 'Привет, это спам сообщение');

    await page.getByTestId('contact-submit').click();

    const error = page.getByTestId('contact-error-message');
    const lang = await page.locator('html').getAttribute('lang');
    const expected =
      lang === 'de' ? de.contact.form.errors.unsupportedSet : en.contact.form.errors.unsupportedSet;
    await expect(error).toContainText(expected, { timeout: 10000 });
  });
});
