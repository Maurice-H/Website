import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Portfolio application.
 *
 * Encapsulates standard User/Viewport boundary interactions
 * so that E2E specs stay declarative and resilient to DOM changes.
 */
export class AppPage {
  readonly page: Page;

  /** The root <html> element — used for theme assertions. */
  readonly htmlRoot: Locator;

  /** Navigation windows rendered by the conveyor on the NAV phase. */
  readonly navWindows: Locator;

  /** The "Back to Navigation" button in the CONTENT phase header. */
  readonly backToNavBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.htmlRoot = page.locator('html');
    this.navWindows = page.locator('.nav-window');
    this.backToNavBtn = page.locator('button').filter({ hasText: /Back/i });
  }

  /** Navigate to the app root and wait for the initial render. */
  async goto() {
    await this.page.goto('/?ci=1');
    // Wait for the app-ready state (NavConveyor visible)
    await expect(this.page.locator('.nav-conveyor')).toBeVisible({ timeout: 15000 });
    // Wait for CI mode class to be applied to ensure no transitions
    await expect(this.page.locator('.app-root')).toHaveClass(/is-ci-mode/);
  }

  /** Transition from NAV → CONTENT by clicking the first nav window. */
  async enterContentPhase() {
    // Wait for the app to be stable and centered
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    // Find the active window and ensure it's in view
    const activeWindow = this.page.locator('.nav-window.is-active');
    await activeWindow.waitFor({ state: 'visible', timeout: 15000 });
    await activeWindow.scrollIntoViewIfNeeded();

    // Strategy: Click, wait briefly, then click again if no transition detected.
    await activeWindow.click({ force: true, delay: 100 });

    try {
      // Wait for the CONTENT phase indicator (the back button)
      await this.backToNavBtn.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      // Fallback: Try clicking again if the first click didn't trigger the transition
      await activeWindow.click({ force: true, delay: 100 });
      await this.backToNavBtn.waitFor({ state: 'visible', timeout: 15000 });
    }

    // Additional safety: ensure the content stage is actually scrollable/visible
    await expect(this.page.locator('.content-stage')).toBeVisible();

    // Final stabilization wait to ensure Vue transition (0.5s) is 100% complete
    await this.page.waitForTimeout(1000);
  }

  /** Toggle the theme via keyboard shortcut ('T'). */
  async toggleTheme() {
    await this.page.keyboard.press('t');
    await this.page.waitForTimeout(300);
  }

  /** Toggle the lighting via keyboard shortcut ('L'). */
  async toggleLighting() {
    await this.page.keyboard.press('l');
    await this.page.waitForTimeout(300);
  }

  /** Read the current value of <html data-theme="...">. */
  async getDataTheme(): Promise<string | null> {
    return this.htmlRoot.getAttribute('data-theme');
  }
}
