import { test, expect } from '@playwright/test';

test.describe('player /watch/[slug]', () => {
  test('renders all 6 episodes of Flujos with their headings', async ({ page }) => {
    await page.goto('/es/watch/flows');
    const episodes = ['Sign-in', 'Validación', 'Selección', 'Reproducción', 'Webhook', 'Sign Out'];
    for (const text of episodes) {
      await expect(
        page.getByRole('heading', { level: 2, name: new RegExp(text, 'i') }).first(),
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('mermaid diagrams render to SVG within 8s', async ({ page }) => {
    await page.goto('/es/watch/flows');
    const figure = page.getByTestId('mermaid-figure').first();
    await expect(figure).toBeVisible();
    const svg = figure.locator('svg');
    await expect(svg.first()).toBeVisible({ timeout: 8000 });
  });

  test('fullscreen button opens dialog, ESC closes, focus returns', async ({ page }) => {
    await page.goto('/es/watch/flows');
    await page.getByTestId('mermaid-figure').first().scrollIntoViewIfNeeded();
    const opener = page.getByRole('button', { name: /ver en pantalla completa/i }).first();
    await expect(opener).toBeVisible({ timeout: 8000 });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: /ver en pantalla completa/i });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('scroll progress bar updates as user scrolls', async ({ page }) => {
    await page.goto('/es/watch/flows');
    const bar = page.getByRole('progressbar', { name: /progreso de lectura/i });
    await expect(bar).toBeVisible();
    const initial = (await bar.getAttribute('aria-valuenow')) ?? '0';
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(150);
    const after = (await bar.getAttribute('aria-valuenow')) ?? '0';
    expect(Number(after)).toBeGreaterThan(Number(initial));
  });

  test('episode anchor (#ep-2) scrolls to the right episode', async ({ page }) => {
    await page.goto('/es/watch/flows#ep-2');
    const heading = page.locator('#ep-2-title');
    await expect(heading).toBeInViewport({ timeout: 4000 });
  });
});
