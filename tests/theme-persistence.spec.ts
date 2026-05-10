import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Theme Persistence and Navigation', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
  });

  test('persists theme mode when navigating and back', async () => {
    // Verify initial theme is "finished" (no data-theme="blueprint")
    expect(await app.getDataTheme()).not.toBe('blueprint');

    // In NAV phase, Technical DNA should be visible
    await expect(app.page.getByText('Technical DNA').first()).toBeVisible();

    // Navigate to content phase
    await app.enterContentPhase();

    // Discovery Path should appear in the Bento Grid
    await expect(app.page.getByText('Discovery Path').first()).toBeVisible({ timeout: 15000 });

    // Now in content phase, Toggle theme to Blueprint
    await app.toggleTheme();
    expect(await app.getDataTheme()).toBe('blueprint');

    // Click Back button to go back to Nav
    await app.backToNavBtn.click();

    // Verify back to NAV phase and theme is STILL blueprint
    await expect(app.page.getByText('Technical DNA').first()).toBeVisible();
    expect(await app.getDataTheme()).toBe('blueprint');
  });
});
