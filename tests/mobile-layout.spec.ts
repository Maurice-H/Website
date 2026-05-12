import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Mobile Layout Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile viewport size

  test('stacks BentoCards in single column on mobile', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto();

    // Go to Content phase using robust model
    await app.enterContentPhase();

    // Ensure content is loaded
    const discoveryCard = page.getByTestId('discovery-card');
    await discoveryCard.waitFor({ state: 'visible', timeout: 15000 });
    await expect(discoveryCard).toBeVisible();

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
