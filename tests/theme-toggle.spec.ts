import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Theme Toggle – Visual Regression Sequence', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
  });

  test('application starts in Finished mode (no data-theme)', async () => {
    // The app should launch without the blueprint attribute.
    const theme = await app.getDataTheme();
    expect(theme).toBeNull();
  });

  test('entering content phase reveals the theme toggle button', async () => {
    await app.enterContentPhase();
    await expect(app.themeToggleBtn).toBeVisible();
  });

  test('clicking theme toggle sets data-theme="blueprint" on <html>', async () => {
    // Navigate into the content phase where the ThemeToggle is rendered.
    await app.enterContentPhase();

    // Click the toggle button.
    await app.toggleTheme();

    // Assert the HTML root receives the blueprint attribute.
    await expect(app.htmlRoot).toHaveAttribute('data-theme', 'blueprint');
  });

  test('clicking theme toggle twice removes data-theme (round-trip)', async () => {
    await app.enterContentPhase();

    // Toggle ON → blueprint
    await app.toggleTheme();
    await expect(app.htmlRoot).toHaveAttribute('data-theme', 'blueprint');

    // Toggle OFF → attribute removed
    await app.toggleTheme();
    await expect(app.htmlRoot).not.toHaveAttribute('data-theme', 'blueprint');
  });
});
