import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('WebGL Background Canvas', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await page.goto('/?forceTier=3');
    // Wait for the app-ready state (NavConveyor visible)
    await expect(page.locator('.nav-conveyor')).toBeVisible({ timeout: 15000 });
  });

  test('should render a canvas element in the DOM', async ({ page }) => {
    // The WebGLBackground component renders a TresCanvas which creates a <canvas>
    const canvas = page.locator('canvas');
    await expect(canvas).toBeAttached({ timeout: 10000 });
  });

  test('canvas layer should NOT block pointer events for the UI', async ({ page }) => {
    // In NAV phase, use the shortcut bar to verify interactability
    const shortcutItem = page.locator('.shortcut-item').first();
    await expect(shortcutItem).toBeVisible({ timeout: 10000 });

    // If pointer events were blocked, this click would fail
    await shortcutItem.click();
  });

  test('canvas should survive a phase transition (NAV → CONTENT)', async ({ page }) => {
    // Enter content phase
    await app.enterContentPhase();

    // Canvas should still be present after the phase transition
    const canvas = page.locator('canvas');
    await expect(canvas).toBeAttached({ timeout: 10000 });

    // UI should remain interactive
    const backBtn = page.locator('button').filter({ hasText: /Back/i });
    await expect(backBtn).toBeVisible({ timeout: 10000 });
  });
});
