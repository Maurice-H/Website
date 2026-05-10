import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Theme Toggle – Visual Regression Sequence', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
  });

  test('application starts in Finished mode (no data-theme)', async () => {
    expect(await app.getDataTheme()).not.toBe('blueprint');
  });

  test('toggling theme via shortcut sets data-theme="blueprint" on <html>', async () => {
    await app.enterContentPhase();
    await app.toggleTheme();
    expect(await app.getDataTheme()).toBe('blueprint');
  });

  test('toggling theme twice via shortcut removes data-theme (round-trip)', async () => {
    await app.enterContentPhase();
    await app.toggleTheme(); // Set to blueprint
    await app.toggleTheme(); // Back to finished
    expect(await app.getDataTheme()).not.toBe('blueprint');
  });
});
