import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Keyboard Shortcut Rebinding', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
  });

  test('should allow rebinding a shortcut key', async ({ page }) => {
    // Find the 'Theme' shortcut item in the NavConveyor footer
    const themeShortcut = page.locator('.shortcut-item').filter({ hasText: 'Theme' });
    const kbd = themeShortcut.locator('kbd');

    // Initial state: should be 'T' (default)
    await expect(kbd).toHaveText('T');

    // Start rebind mode by clicking the shortcut item
    await themeShortcut.click();

    // Should show '...' indicating capture mode
    await expect(kbd).toHaveText('...');
    await expect(themeShortcut).toHaveClass(/shortcut-item--rebinding/);

    // Press a new key 'K'
    await page.keyboard.press('k');

    // Verify rebind success: UI updates to 'K'
    await expect(kbd).toHaveText('K');
    await expect(themeShortcut).not.toHaveClass(/shortcut-item--rebinding/);

    // Enter Content Phase to test the shortcut
    await app.enterContentPhase();

    // Verify the new key actually works (toggles blueprint mode)
    await page.keyboard.press('k');
    await expect(app.htmlRoot).toHaveAttribute('data-theme', 'blueprint');

    // Toggle back
    await page.keyboard.press('k');
    await expect(app.htmlRoot).not.toHaveAttribute('data-theme', 'blueprint');
  });

  test('should cancel rebind on Escape', async ({ page }) => {
    const themeShortcut = page.locator('.shortcut-item').filter({ hasText: 'Theme' });
    const kbd = themeShortcut.locator('kbd');

    await themeShortcut.click();
    await expect(kbd).toHaveText('...');

    // Press Escape to cancel
    await page.keyboard.press('Escape');

    // Should revert to original 'T'
    await expect(kbd).toHaveText('T');
    await expect(themeShortcut).not.toHaveClass(/shortcut-item--rebinding/);
  });
});
