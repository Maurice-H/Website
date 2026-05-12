import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Contact Form & Turnstile Integration', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
    await app.enterContentPhase();

    // Mock the Formspree API
    await page.route('https://formspree.io/f/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });
  });

  test('should display the turnstile widget', async () => {
    // Scroll to the contact form area
    await app.page.locator('#contact-form').scrollIntoViewIfNeeded();

    // Verify turnstile container is present
    const turnstile = app.page.locator('.cf-turnstile');
    await expect(turnstile).toBeVisible({ timeout: 15000 });
  });

  test('should include turnstile token in form submission', async () => {
    // Fill the form fields using test IDs
    await app.page.fill('[data-testid="contact-name"]', 'Test User');
    await app.page.fill('[data-testid="contact-email"]', 'test@gmail.com');
    await app.page.fill(
      '[data-testid="contact-message"]',
      'This is a test message for Playwright E2E testing.'
    );

    // Mock Turnstile response for Playwright headless mode
    await app.page.evaluate(() => {
      let input = document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement;
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'cf-turnstile-response';
        document.querySelector('form')?.appendChild(input);
      }
      input.value = 'mocked-turnstile-token';
    });

    // Ensure button is enabled before clicking (Actionability)
    const submitBtn = app.page.getByTestId('contact-submit');
    await expect(submitBtn).toBeEnabled();

    // Click submit button
    await submitBtn.click();

    // Verify success state via data-attribute (reactive update)
    // We use a longer timeout and check for the 'true' state
    await expect(submitBtn).toHaveAttribute('data-success', 'true', { timeout: 15000 });
  });
});
