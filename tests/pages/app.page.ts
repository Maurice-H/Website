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

  /** The "Toggle Theme" button (ThemeToggle.vue — matched by aria-label). */
  readonly themeToggleBtn: Locator;

  /** Navigation windows rendered by the conveyor on the NAV phase. */
  readonly navWindows: Locator;

  /** The "Back to Navigation" button in the CONTENT phase header. */
  readonly backToNavBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.htmlRoot = page.locator('html');
    this.themeToggleBtn = page.getByRole('button', { name: /System Mode/ });
    this.navWindows = page.locator('.nav-window');
    this.backToNavBtn = page.getByRole('button', {
      name: 'Back to Navigation',
    });
  }

  /** Navigate to the app root and wait for the initial render. */
  async goto() {
    await this.page.goto('/');
    // Wait for the app-ready state (NavConveyor visible)
    await expect(this.page.locator('.nav-conveyor')).toBeVisible({ timeout: 15000 });
  }

  /** Transition from NAV → CONTENT by clicking the first nav window. */
  async enterContentPhase() {
    // Wait for the initial centering scroll to settle
    await this.page.waitForTimeout(500);

    // We must click the CURRENTLY ACTIVE window to enter the phase.
    const activeWindow = this.page.locator('.nav-window.is-active');
    await activeWindow.waitFor({ state: 'attached', timeout: 10000 });

    // The Fused Portfolio uses a selection mechanic.
    // Now that the component uses distance-based click detection, a standard .click() is reliable.
    await activeWindow.click();

    // Wait for the content phase layout to appear AND be ready for interaction.
    await this.themeToggleBtn.waitFor({ state: 'visible', timeout: 15000 });
  }

  /** Click the theme toggle button. */
  async toggleTheme() {
    await this.themeToggleBtn.click();
  }

  /** Read the current value of <html data-theme="...">. */
  async getDataTheme(): Promise<string | null> {
    return this.htmlRoot.getAttribute('data-theme');
  }
}
