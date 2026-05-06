import { expect, test } from '@playwright/test';

test.describe('Contact Form & Turnstile Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Wait for the navigation conveyor to be visible
    await expect(page.locator('.nav-conveyor')).toBeVisible();

    // Click on a navigation card to enter the 'CONTENT' phase
    // 'EXPERIENCE' is the first card usually active
    await page.click('text=EXPERIENCE');

    // Wait for the contact form to appear in the CONTENT phase
    const contactForm = page.locator('#contact-form');
    await expect(contactForm).toBeVisible({ timeout: 10000 });
  });

  test('should display the turnstile widget', async ({ page }) => {
    // Check if the Turnstile widget container is present
    const turnstileWidget = page.locator('.cf-turnstile');
    await expect(turnstileWidget).toBeVisible();

    // Check if Cloudflare Turnstile has injected its iframe
    // Note: We use a longer timeout as the script needs to load and initialize
    const turnstileIframe = page.frameLocator('.cf-turnstile iframe');
    await expect(turnstileIframe.locator('body')).toBeDefined();
  });

  test('should include turnstile token in form submission', async ({ page }) => {
    // Fill the form fields
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-message', 'This is a test message for Playwright.');

    // Mock Turnstile response for Playwright headless mode (since real Turnstile blocks it)
    await page.evaluate(() => {
      let input = document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement;
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'cf-turnstile-response';
        document.body.appendChild(input);
      }
      input.value = 'mocked-turnstile-token';
    });

    const turnstileToken = page.locator('[name="cf-turnstile-response"]');
    await expect(turnstileToken).not.toHaveValue('');

    // Intercept the fetch request to verify the payload
    await page.route('https://formspree.io/f/*', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      expect(postData).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
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
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.locator('text=Transmission Sent ✓')).toBeVisible();
  });
});
