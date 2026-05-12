import { expect, test } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Navigation Conveyor', () => {
  let app: AppPage;

  test.beforeEach(async ({ page }) => {
    app = new AppPage(page);
    await app.goto();
  });

  test('should navigate between tabs using arrow keys', async ({ page }) => {
    // We use the class selector because data-testid is unique per tab (nav-window-skills, etc)
    const windows = page.locator('.nav-window');

    // Wait for initial render
    await expect(windows).toHaveCount(4);

    // Initial active should be Skills. We wait for it to be centered and active.
    const skillsTab = page.getByTestId('nav-window-skills');

    // Wait for any window to be active first, then check if it's the right one
    await expect(page.locator('.nav-window.is-active')).toBeVisible({ timeout: 15000 });

    // If skills isn't active yet, it might be because the initial scroll is slow.
    // We'll wait specifically for skills.
    await expect(skillsTab).toHaveClass(/is-active/, { timeout: 15000 });

    // Press ArrowRight
    await page.keyboard.press('ArrowRight');
    // It should highlight the next tab (Contact)
    const contactTab = page.getByTestId('nav-window-contact');
    await expect(contactTab).toHaveClass(/is-active/, { timeout: 10000 });

    // Press ArrowLeft
    await page.keyboard.press('ArrowLeft');
    await expect(skillsTab).toHaveClass(/is-active/, { timeout: 10000 });
  });

  test('should use two-step navigation (highlight then enter)', async ({ page }) => {
    const projectsTab = page.getByTestId('nav-window-projects');

    // Wait for it to be visible
    await expect(projectsTab).toBeVisible({ timeout: 15000 });

    // Click projects tab (inactive)
    await projectsTab.click({ force: true });

    // Should be highlighted but still in NAV phase
    await expect(projectsTab).toHaveClass(/is-active/, { timeout: 15000 });
    await expect(page.locator('.nav-conveyor')).toBeVisible();

    // Stabilization delay
    await page.waitForTimeout(1000);

    // Click again (active) to navigate
    await projectsTab.click({ force: true });

    // Should transition to CONTENT phase
    await expect(page.getByTestId('back-to-nav')).toBeVisible({
      timeout: 25000,
    });
  });

  test('should show Back to Top button when scrolling deep into content', async ({ page }) => {
    await app.enterContentPhase();

    // Explicitly scroll to top to ensure we start at 0
    await page.evaluate(() => {
      const container = document.querySelector('.content-stage');
      if (container) container.scrollTop = 0;
    });

    const backToTop = page.getByTestId('back-to-top');
    await expect(backToTop).not.toBeVisible();

    // Scroll down significantly
    await page.evaluate(() => {
      const container = document.querySelector('.content-stage');
      if (container) {
        container.scrollTop = 2000;
        container.dispatchEvent(new Event('scroll'));
      }
    });

    // Wait for visibility
    await expect(backToTop).toBeVisible({ timeout: 10000 });

    // Click it
    await backToTop.click();

    // Verify scrolled back to top
    await expect(async () => {
      const scrollTop = await page.evaluate(
        () => document.querySelector('.content-stage')?.scrollTop
      );
      expect(scrollTop).toBeLessThan(100);
    }).toPass({ timeout: 10000 });
  });
});
