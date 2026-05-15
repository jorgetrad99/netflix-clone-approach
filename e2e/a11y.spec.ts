import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  { path: '/es', name: 'home es' },
  { path: '/en', name: 'home en' },
  { path: '/es/title/flows', name: 'title flows es' },
  { path: '/es/title/architecture', name: 'title architecture es' },
  { path: '/es/watch/flows', name: 'watch flows es' },
  { path: '/es/search?q=oauth', name: 'search results es' },
  { path: '/es/my-list', name: 'my-list empty es' },
  { path: '/en/my-list', name: 'my-list empty en' },
] as const;

async function runAxe(page: Page) {
  return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
}

function blockingViolations(results: Awaited<ReturnType<typeof runAxe>>) {
  return results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

for (const route of ROUTES) {
  test(`${route.name} (${route.path}) — 0 serious/critical axe violations`, async ({ page }) => {
    await page.goto(route.path);
    await page.waitForLoadState('networkidle');
    const results = await runAxe(page);
    const blocking = blockingViolations(results);
    if (blocking.length > 0) {
      console.log(JSON.stringify(blocking, null, 2));
    }
    expect(blocking).toEqual([]);
  });
}

test('skip link becomes visible on Tab and targets #main-content', async ({ page }) => {
  await page.goto('/es');
  await page.keyboard.press('Tab');
  const link = page.getByRole('link', { name: /saltar al contenido/i });
  await expect(link).toBeFocused();
  await expect(link).toHaveAttribute('href', '#main-content');
});

test('root path 307s to /es', async ({ request }) => {
  const res = await request.get('/', { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(res.headers()['location']).toMatch(/\/es$/);
});

test('locale switcher navigates to the same path under en', async ({ page }) => {
  await page.goto('/es/title/flows');
  await page.getByRole('button', { name: /^en$/i }).click();
  await expect(page).toHaveURL(/\/en\/title\/flows$/);
  await expect(page.getByRole('link', { name: /^play$/i })).toBeVisible();
});
