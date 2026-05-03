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
      name: /Back|ESC/,
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
    await this.page.waitForTimeout(1000);

    // We must click the CURRENTLY ACTIVE window to enter the phase.
    const activeWindow = this.page.locator('.nav-window.is-active');
    await activeWindow.waitFor({ state: 'visible', timeout: 15000 });

    // On mobile, the card (480px) is wider than the viewport (375px).
    // Standard click might hit outside the viewport if not careful.
    // We click the center of the viewport which should be the center of the active card.
    const viewport = this.page.viewportSize();
    if (viewport) {
      await this.page.mouse.click(viewport.width / 2, viewport.height / 2);
    } else {
      await activeWindow.click({ force: true });
    }

    // Wait for the content phase layout to appear AND be ready for interaction.
    // We wait for the Back button as a signal that the content transition is done.
    await this.backToNavBtn.waitFor({ state: 'visible', timeout: 15000 });
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
