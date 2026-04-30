import { expect, test } from '@playwright/test';

test.describe('Mobile Layout Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile viewport size

  test('stacks BentoCards in single column on mobile', async ({ page }) => {
    await page.goto('/');

    // Go to Content phase
    await page.getByText('About Me', { exact: true }).first().click();

    // Ensure content is loaded
    await expect(page.getByText('Discovery Path')).toBeVisible();

    // Find the first two BentoCards
    const bentoCards = page.locator('.bento-card');
    await expect(bentoCards.nth(0)).toBeVisible();
    await expect(bentoCards.nth(1)).toBeVisible();

    // Get their bounding boxes
    const box0 = await bentoCards.nth(0).boundingBox();
    const box1 = await bentoCards.nth(1).boundingBox();

    expect(box0).not.toBeNull();
    expect(box1).not.toBeNull();

    // Verify that the second card is vertically stacked below the first card
    // The y position of the second card should be >= the bottom of the first card
    if (box0 && box1) {
      expect(box1.y).toBeGreaterThanOrEqual(box0.y + box0.height);
    }
  });
});
