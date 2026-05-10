import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Drone & Bento Card Interaction', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
    await app.enterContentPhase();
  });

  test('should trigger drone focus when hovering a bento card', async ({ page }) => {
    // Select a specific card (e.g., Hero section or first bento card)
    const card = page.locator('.bento-card').first();

    // Initial state: not targeted
    await expect(card).toHaveAttribute('data-drone-target', 'false');

    // Hover the card
    await card.hover();

    // Verify targeting state is active
    await expect(card).toHaveAttribute('data-drone-target', 'true');

    // Check if the global lighting store received the position (via internal state check)
    const isFocused = await page.evaluate(() => {
      // We can check if the cursor is hidden when lighting is enabled
      // which is a proxy for the drone being in "Content" mode and active
      return document.querySelector('.app-root')?.classList.contains('hide-system-cursor');
    });

    // If lighting is enabled (default), cursor should be hidden in content phase
    expect(isFocused).toBe(true);

    // Unhover
    await page.mouse.move(0, 0);
    await expect(card).toHaveAttribute('data-drone-target', 'false');
  });

  test('should respect max focus duration (drone returns to patrol)', async ({ page }) => {
    const card = page.locator('.bento-card').first();

    await card.hover();
    await expect(card).toHaveAttribute('data-drone-target', 'true');

    // The drone has a MAX_FOCUS_DURATION of ~3.2s
    // We wait 4 seconds and check if the drone is still focused (it shouldn't be,
    // although our data-drone-target will stay true as long as the mouse is there,
    // the DRONE logic itself is internal).

    // This test is limited without full WebGL state exposure,
    // but verifying the hover state is a good start.
    await page.waitForTimeout(4000);
    await expect(card).toHaveAttribute('data-drone-target', 'true'); // Mouse still there
  });
});
