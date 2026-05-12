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
    this.backToNavBtn = page.getByTestId('back-to-nav');
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
    await this.page.waitForTimeout(1000);

    // Find the active window and ensure it's in view
    const activeWindow = this.page.locator('.nav-window.is-active');
    await activeWindow.waitFor({ state: 'visible', timeout: 15000 });

    // Webkit specific stabilization: ensure the conveyor is not scrolling
    await this.page.waitForTimeout(500);

    // Click the window to trigger phase change
    await activeWindow.click({ force: true });

    // If it didn't change phase (still in nav), click again
    // This handles cases where the first click only triggers a "highlight" or is lost
    try {
      await expect(this.backToNavBtn).toBeVisible({ timeout: 5000 });
    } catch {
      await activeWindow.click({ force: true });
    }

    // Wait for the CONTENT phase indicator (the back button)
    await expect(this.backToNavBtn).toBeVisible({ timeout: 20000 });

    // Final stabilization wait to ensure Vue transition and layout settle
    await this.page.waitForTimeout(1000);

    // Ensure the content stage is actually scrollable/visible
    const contentStage = this.page.locator('.content-stage');
    await expect(contentStage).toBeVisible();
  }

  async navigateToSection(id: 'skills' | 'career' | 'projects' | 'contact') {
    const tab = this.page.getByTestId(`nav-window-${id}`);

    // If already in content phase, we don't need to navigate (or we should go back first)
    // But usually tests start fresh.
    await tab.scrollIntoViewIfNeeded();

    const classAttr = await tab.getAttribute('class');
    const isActive = classAttr?.includes('is-active');

    if (!isActive) {
      // Step 1: Highlight
      await tab.click({ force: true });
      await expect(tab).toHaveClass(/is-active/, { timeout: 15000 });
      // Wait for Vue state and potential scroll to settle
      await this.page.waitForTimeout(800);
    }

    // Step 2: Navigate (Only if we are still in NAV phase)
    if (await this.page.locator('.nav-conveyor').isVisible()) {
      await tab.click({ force: true });
    }

    // Verify transition to CONTENT phase
    await expect(this.backToNavBtn).toBeVisible({ timeout: 20000 });
    await this.page.waitForTimeout(500);
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
