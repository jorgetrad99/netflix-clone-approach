import { test, expect } from '@playwright/test';

test.describe('navigation: home → title → watch', () => {
  test('a top-10 card navigates to /es/title/[slug]', async ({ page }) => {
    await page.goto('/es');
    const firstCard = page.getByTestId('section-card').first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^\/es\/title\/[a-z-]+$/);
    await firstCard.click();
    await expect(page).toHaveURL(/\/es\/title\//);
    await expect(page.getByRole('link', { name: /reproducir/i })).toBeVisible();
  });

  test('Reproducir button on title takes user to /es/watch/[slug]', async ({ page }) => {
    await page.goto('/es/title/flows');
    const play = page.getByRole('link', { name: /reproducir/i });
    await play.click();
    await expect(page).toHaveURL(/\/es\/watch\/flows$/);
    await expect(
      page.getByRole('heading', { level: 1, name: /flujos principales/i }),
    ).toBeVisible();
  });
});

test.describe('carousel navigation', () => {
  test('carousel buttons scroll the row on click', async ({ page }) => {
    await page.goto('/es');
    const firstRowScrollContainer = page
      .locator('section')
      .filter({ has: page.getByRole('heading', { name: /top 10/i }) })
      .locator('div.overflow-x-auto');

    // Get initial scroll position
    const initialScroll = await firstRowScrollContainer.evaluate((el) => el.scrollLeft);

    // Hover to reveal buttons and click right button
    await firstRowScrollContainer.hover();
    const rightButton = page.getByRole('button', { name: /scroll right/i }).first();
    await rightButton.click();

    // Wait for scroll animation and verify position changed
    await page.waitForTimeout(500);
    const scrolledRight = await firstRowScrollContainer.evaluate((el) => el.scrollLeft);
    expect(scrolledRight).toBeGreaterThan(initialScroll);

    // Click left button to scroll back
    await firstRowScrollContainer.hover();
    const leftButton = page.getByRole('button', { name: /scroll left/i }).first();
    await leftButton.click();

    await page.waitForTimeout(500);
    const scrolledLeft = await firstRowScrollContainer.evaluate((el) => el.scrollLeft);
    expect(scrolledLeft).toBeLessThan(scrolledRight);
  });
});

test.describe('search', () => {
  test('typing in the search bar debounces and pushes /search?q=', async ({ page }) => {
    await page.goto('/es');
    await page.getByRole('button', { name: /abrir búsqueda/i }).click();
    const input = page.getByRole('searchbox');
    await input.fill('OAuth');
    await page.waitForURL(/\/es\/search\?q=OAuth/, { timeout: 1500 });
    await expect(page).toHaveURL(/\/es\/search\?q=OAuth/);
  });

  test('empty /search shows the recommended row', async ({ page }) => {
    await page.goto('/es/search');
    await expect(
      page.getByRole('heading', { level: 2, name: /recomendados para vos/i }),
    ).toBeVisible();
    const recommendedLinks = page.locator('a[href*="/es/title/"]');
    await expect(recommendedLinks.first()).toBeVisible();
  });

  test('search results list links to title or watch routes', async ({ page }) => {
    await page.goto('/es/search?q=OAuth');
    const result = page.locator('a[href*="/es/title/"], a[href*="/es/watch/"]').first();
    await expect(result).toBeVisible({ timeout: 5000 });
  });
});

test.describe('my list persistence', () => {
  test('items survive a full page reload', async ({ page }) => {
    await page.goto('/es/title/flows');
    const addButton = page.getByRole('button', { name: /agregar flujos principales a mi lista/i });
    await addButton.click();
    await expect(addButton).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/es/my-list');
    await expect(
      page.getByRole('link', { name: /más información sobre flujos principales/i }),
    ).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole('link', { name: /más información sobre flujos principales/i }),
    ).toBeVisible();
  });

  test('empty state shows when nothing is stored', async ({ page, context }) => {
    await context.clearCookies();
    await page.addInitScript(() => globalThis.localStorage.clear());
    await page.goto('/es/my-list');
    await expect(
      page.getByRole('heading', { level: 2, name: /tu lista está vacía/i }),
    ).toBeVisible();
  });
});

test.describe('locale persistence across navigation', () => {
  test('clicking en, then clicking a card, keeps the locale', async ({ page }) => {
    await page.goto('/es');
    await page.getByRole('button', { name: /^en$/i }).click();
    await expect(page).toHaveURL(/\/en$/);
    await page.getByTestId('section-card').first().click();
    await expect(page).toHaveURL(/\/en\/title\//);
    await expect(page.getByRole('link', { name: /^play$/i })).toBeVisible();
  });
});
