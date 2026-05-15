import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { es } from './src/i18n/dictionaries/es';

afterEach(() => {
  cleanup();
});

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation');
  const defaultRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  };
  return {
    ...actual,
    useRouter: vi.fn(() => defaultRouter),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    usePathname: vi.fn(() => '/'),
  };
});

vi.mock('@/i18n/LocaleProvider', () => ({
  LocaleProvider: ({ children }: { children: React.ReactNode }) => children,
  useLocale: vi.fn(() => 'es'),
  useDictionary: vi.fn(() => es),
  useLocaleContext: vi.fn(() => ({ locale: 'es', dict: es })),
}));
