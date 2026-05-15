import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

async function renderHome(locale = 'es') {
  const ui = await HomePage({ params: Promise.resolve({ locale }) });
  return render(ui);
}

describe('<HomePage>', () => {
  it('renders the featured hero with the overview title (es)', async () => {
    await renderHome('es');
    expect(screen.getByRole('heading', { level: 1, name: /visión general/i })).toBeVisible();
  });

  it('shows at least 4 distinct rows', async () => {
    await renderHome('es');
    const rows = screen.getAllByRole('heading', { level: 2 });
    expect(rows.length).toBeGreaterThanOrEqual(4);
  });

  it('renders the Top 10 row in Spanish by default', async () => {
    await renderHome('es');
    expect(screen.getByRole('heading', { level: 2, name: /top 10/i })).toBeVisible();
  });

  it('switches headings to English when locale=en', async () => {
    await renderHome('en');
    expect(screen.getByRole('heading', { level: 2, name: /top 10/i })).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: /architecture/i })).toBeVisible();
  });
});
