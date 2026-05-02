import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('WebGL Background Canvas', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
  });

  test('should render a canvas element in the DOM', async ({ page }) => {
    // The WebGLBackground component renders a TresCanvas which creates a <canvas>
    const canvas = page.locator('canvas');
    await expect(canvas).toBeAttached({ timeout: 10000 });
  });

  test('canvas layer should NOT block pointer events for the UI', async ({ page }) => {
    // The wrapper div has pointer-events: none — verify UI elements are still clickable
    const themeToggle = page.getByRole('button', { name: /System Mode/ });
    await expect(themeToggle).toBeVisible({ timeout: 10000 });

    // If pointer events were blocked, this click would fail
    await themeToggle.click();
  });

  test('canvas should survive a phase transition (NAV → CONTENT)', async ({ page }) => {
    // Enter content phase
    await app.enterContentPhase();

    // Canvas should still be present after the phase transition
    const canvas = page.locator('canvas');
    await expect(canvas).toBeAttached({ timeout: 10000 });

    // UI should remain interactive
    const backBtn = page.getByRole('button', { name: '[ ESC ] Back' });
    await expect(backBtn).toBeVisible({ timeout: 10000 });
  });
});
