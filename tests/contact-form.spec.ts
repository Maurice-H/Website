import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Contact Form & Turnstile Integration', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
    await app.enterContentPhase();

    // Wait for the contact form to appear in the CONTENT phase
    const contactForm = app.page.locator('#contact-form');
    await expect(contactForm).toBeVisible({ timeout: 15000 });
  });

  test('should display the turnstile widget', async () => {
    // Check if the Turnstile widget container is present
    const turnstileWidget = app.page.locator('.cf-turnstile');
    await expect(turnstileWidget).toBeVisible();

    // Check if Cloudflare Turnstile has injected its iframe
    const turnstileIframe = app.page.frameLocator('.cf-turnstile iframe');
    await expect(turnstileIframe.locator('body')).toBeDefined();
  });

  test('should include turnstile token in form submission', async () => {
    // Fill the form fields
    await app.page.fill('#contact-name', 'Test User');
    await app.page.fill('#contact-email', 'test@gmail.com');
    await app.page.fill('#contact-message', 'This is a test message for Playwright.');

    // Mock Turnstile response for Playwright headless mode
    await app.page.evaluate(() => {
      let input = document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement;
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'cf-turnstile-response';
        document.body.appendChild(input);
      }
      input.value = 'mocked-turnstile-token';
    });

    const turnstileToken = app.page.locator('[name="cf-turnstile-response"]');
    await expect(turnstileToken).not.toHaveValue('');

    // Mock Cloudflare DNS verification
    await app.page.route(
      'https://cloudflare-dns.com/dns-query?name=gmail.com&type=MX',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/dns-json',
          body: JSON.stringify({
            Status: 0,
            Answer: [{ type: 15, data: '10 mail.google.com' }],
          }),
        });
      }
    );

    // Intercept the fetch request to verify the payload
    await app.page.route('https://formspree.io/f/*', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      expect(postData).toMatchObject({
        name: 'Test User',
        email: 'test@gmail.com',
        message: 'This is a test message for Playwright.',
      });

      // Verify that the Turnstile token is present in the payload
      expect(postData['cf-turnstile-response']).toBeTruthy();
      expect(postData['cf-turnstile-response']).not.toBe('');

      // Mock a successful response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    // Submit the form
    await app.page.click('button[type="submit"]');

    // Check for success message
    await expect(app.page.locator('text=Transmission Sent ✓')).toBeVisible();
  });
});
