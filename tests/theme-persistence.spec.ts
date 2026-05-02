import { expect, test } from '@playwright/test';

test.describe('Theme Persistence and Navigation', () => {
  test('persists theme mode when navigating and back', async ({ page }) => {
    await page.goto('/');

    // Verify initial theme is "finished" (no data-theme="blueprint")
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'blueprint');

    // In NAV phase, Technical DNA should be visible
    await expect(page.getByText('Technical DNA').first()).toBeVisible();

    // Wait for the initial centering scroll to settle
    await page.waitForTimeout(500);

    // Click the active nav window (Experience) to navigate to the content phase
    // We click the active one because it's centered on load, making the test more stable
    await page.locator('.nav-window.is-active').first().click();

    // Discovery Path should appear in the Bento Grid
    await expect(page.getByText('Discovery Path').first()).toBeVisible({ timeout: 15000 });

    // Now in content phase, Toggle theme to Blueprint
    await page.getByRole('button', { name: /System Mode/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'blueprint');

    // Click ESC back button to go back to Nav
    await page.getByRole('button', { name: '[ ESC ] Back' }).click();

    // Verify back to NAV phase and theme is STILL blueprint
    await expect(page.getByText('Technical DNA').first()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'blueprint');
  });
});
