import type { Category, PosterSpec, SectionId } from './types';

export interface LocalizedFields {
  title: string;
  tagline: string;
  excerpt: string;
}

export interface SectionAugment {
  category: Category;
  tagline: string;
  excerpt: string;
  poster: PosterSpec;
  backdrop: PosterSpec;
  rank?: number;
  badges?: string[];
  /** English variants (title comes from H2 in es; provide a translated title here) */
  en: LocalizedFields;
}

const NETFLIX_RED = '#e50914';
const DEEP_BLACK = '#141414';

export const SECTION_AUGMENT: Record<SectionId, SectionAugment> = {
  overview: {
    category: 'product',
    tagline: 'El blueprint completo del producto en una sola toma.',
    excerpt:
      'Construir un clon funcional de Netflix con auth, perfiles, browse, player, búsqueda, listas, recomendaciones y subscripciones.',
    poster: { gradient: [NETFLIX_RED, '#7a040a'], icon: 'Film' },
    backdrop: { gradient: [DEEP_BLACK, NETFLIX_RED], icon: 'Film', pattern: 'noise' },
    badges: ['Featured'],
    en: {
      title: 'Overview',
      tagline: 'The complete product blueprint, in a single take.',
      excerpt:
        'Build a functional Netflix clone with auth, profiles, browse, player, search, lists, recommendations, and subscriptions.',
    },
  },
  features: {
    category: 'product',
    tagline: 'Las 17 features que definen el producto, ranked.',
    excerpt:
      'Auth, perfiles, browse, player HLS, búsqueda, listas, ratings, subscripciones, parental controls y más.',
    poster: { gradient: ['#831010', '#220505'], icon: 'Star' },
    backdrop: { gradient: [NETFLIX_RED, '#220505'], icon: 'Star', pattern: 'grid' },
    rank: 1,
    badges: ['Top 10'],
    en: {
      title: 'Key Features',
      tagline: 'The 17 features that define the product, ranked.',
      excerpt:
        'Auth, profiles, browse, HLS player, search, lists, ratings, subscriptions, parental controls and more.',
    },
  },
  stack: {
    category: 'stack',
    tagline: 'Next.js 16, Postgres, Mux, Stripe — el cast de la plataforma.',
    excerpt:
      'Next.js 16 + RSC, TypeScript estricto, Tailwind, Drizzle, Auth.js, Mux, Stripe, Meilisearch, Vercel.',
    poster: { gradient: ['#1f4ed8', '#0a1f4d'], icon: 'Layers' },
    backdrop: { gradient: ['#1f4ed8', DEEP_BLACK], icon: 'Layers', pattern: 'grid' },
    rank: 4,
    badges: ['Tech'],
    en: {
      title: 'Tech Stack',
      tagline: "Next.js 16, Postgres, Mux, Stripe — the platform's cast.",
      excerpt:
        'Next.js 16 + RSC, strict TypeScript, Tailwind, Drizzle, Auth.js, Mux, Stripe, Meilisearch, Vercel.',
    },
  },
  architecture: {
    category: 'architecture',
    tagline: 'Cómo encajan navegador, edge, RSC, DB y servicios externos.',
    excerpt:
      'Diagrama de alto nivel: proxy edge, App Router, Server Functions, Postgres, Mux, Stripe, Meilisearch.',
    poster: { gradient: ['#0e7490', '#082f3a'], icon: 'Network' },
    backdrop: { gradient: ['#0e7490', DEEP_BLACK], icon: 'Network', pattern: 'dots' },
    rank: 2,
    badges: ['Featured'],
    en: {
      title: 'Architecture',
      tagline: 'How browser, edge, RSC, DB, and external services fit together.',
      excerpt:
        'High-level diagram: edge proxy, App Router, Server Functions, Postgres, Mux, Stripe, Meilisearch.',
    },
  },
  'data-model': {
    category: 'architecture',
    tagline: 'Cada tabla, cada relación, en Drizzle.',
    excerpt:
      'Users, accounts, profiles, subscriptions, titles, episodes, watchlist, watch_progress, ratings.',
    poster: { gradient: ['#7c3aed', '#2e1065'], icon: 'Database' },
    backdrop: { gradient: ['#7c3aed', DEEP_BLACK], icon: 'Database', pattern: 'grid' },
    badges: ['Schema'],
    en: {
      title: 'Data Model',
      tagline: 'Every table, every relation, in Drizzle.',
      excerpt:
        'Users, accounts, profiles, subscriptions, titles, episodes, watchlist, watch_progress, ratings.',
    },
  },
  routes: {
    category: 'architecture',
    tagline: 'El App Router completo: estática, RSC, dinámica.',
    excerpt:
      'app/(auth), app/(app)/browse, /title/[id], /watch/[id], /api, proxy.ts y estrategia de cache por ruta.',
    poster: { gradient: ['#0891b2', '#083344'], icon: 'GitBranch' },
    backdrop: { gradient: ['#0891b2', DEEP_BLACK], icon: 'GitBranch', pattern: 'dots' },
    badges: [],
    en: {
      title: 'Route Map',
      tagline: 'The full App Router: static, RSC, dynamic.',
      excerpt:
        'app/(auth), app/(app)/browse, /title/[id], /watch/[id], /api, proxy.ts and per-route caching strategy.',
    },
  },
  flows: {
    category: 'flows',
    tagline: 'Seis flujos críticos secuenciados con Mermaid.',
    excerpt:
      'Sign-in OAuth + PKCE, validación de sesión, selección de perfil, reproducción, webhook Stripe, sign out.',
    poster: { gradient: ['#dc2626', '#450a0a'], icon: 'Workflow' },
    backdrop: { gradient: [NETFLIX_RED, DEEP_BLACK], icon: 'Workflow', pattern: 'noise' },
    rank: 3,
    badges: ['Series', 'P0'],
    en: {
      title: 'Main Flows',
      tagline: 'Six critical flows sequenced with Mermaid.',
      excerpt:
        'Sign-in OAuth + PKCE, session validation, profile selection, playback, Stripe webhook, sign out.',
    },
  },
  'cross-cutting': {
    category: 'architecture',
    tagline: 'Caching, mutaciones, proxy, imágenes y SEO.',
    excerpt:
      'Cache Components con cacheTag, Server Functions, proxy.ts guard, next/image y metadata SEO.',
    poster: { gradient: ['#475569', '#0f172a'], icon: 'Settings' },
    backdrop: { gradient: ['#475569', DEEP_BLACK], icon: 'Settings', pattern: 'grid' },
    badges: [],
    en: {
      title: 'Cross-cutting Concerns',
      tagline: 'Caching, mutations, proxy, images, and SEO.',
      excerpt:
        'Cache Components with cacheTag, Server Functions, proxy.ts guard, next/image, and SEO metadata.',
    },
  },
  components: {
    category: 'architecture',
    tagline: 'Cada Server y Client Component, mapeado.',
    excerpt:
      'Layout, Browse, Title detail, Player, Search, Auth & Profiles, Account y System components.',
    poster: { gradient: ['#059669', '#022c22'], icon: 'Component' },
    backdrop: { gradient: ['#059669', DEEP_BLACK], icon: 'Component', pattern: 'grid' },
    badges: [],
    en: {
      title: 'Component Inventory',
      tagline: 'Every Server and Client Component, mapped.',
      excerpt:
        'Layout, Browse, Title detail, Player, Search, Auth & Profiles, Account, and System components.',
    },
  },
  testing: {
    category: 'testing',
    tagline: 'Pirámide completa: unit, component, integration, E2E, security.',
    excerpt:
      'Vitest + RTL + Testcontainers + Playwright + axe + Lighthouse + k6 + Snyk. Coverage gate ≥ 80%.',
    poster: { gradient: ['#16a34a', '#052e16'], icon: 'TestTube' },
    backdrop: { gradient: ['#16a34a', DEEP_BLACK], icon: 'TestTube', pattern: 'dots' },
    rank: 5,
    badges: ['Quality'],
    en: {
      title: 'Testing Strategy',
      tagline: 'The full pyramid: unit, component, integration, E2E, security.',
      excerpt:
        'Vitest + RTL + Testcontainers + Playwright + axe + Lighthouse + k6 + Snyk. Coverage gate ≥ 80%.',
    },
  },
  security: {
    category: 'security',
    tagline: '20 amenazas, 20 mitigaciones — defense in depth.',
    excerpt:
      'CSRF, PKCE, JWT en httpOnly, CSP estricta, rate limit, Mux signed URLs, idempotencia de webhooks.',
    poster: { gradient: ['#b45309', '#451a03'], icon: 'Shield' },
    backdrop: { gradient: ['#b45309', DEEP_BLACK], icon: 'Shield', pattern: 'grid' },
    rank: 6,
    badges: ['Critical'],
    en: {
      title: 'Security',
      tagline: '20 threats, 20 mitigations — defense in depth.',
      excerpt:
        'CSRF, PKCE, JWT in httpOnly, strict CSP, rate limiting, signed Mux URLs, webhook idempotency.',
    },
  },
  roadmap: {
    category: 'roadmap',
    tagline: '11 fases, cada una shippable, en 28 días.',
    excerpt:
      'Foundation → Auth → Catalog → Browse → Title → Player → Search → Subscriptions → Parental → Polish → Tests.',
    poster: { gradient: ['#9333ea', '#2e1065'], icon: 'Calendar' },
    backdrop: { gradient: ['#9333ea', DEEP_BLACK], icon: 'Calendar', pattern: 'dots' },
    rank: 7,
    badges: ['Schedule'],
    en: {
      title: 'Roadmap',
      tagline: '11 phases, each shippable, in 28 days.',
      excerpt:
        'Foundation → Auth → Catalog → Browse → Title → Player → Search → Subscriptions → Parental → Polish → Tests.',
    },
  },
  risks: {
    category: 'product',
    tagline: 'Lo que puede salir mal, y las preguntas sin responder.',
    excerpt:
      'Contenido licenciado, TMDB rate limits, canary de Cache Components, JWT revocation, scope abierto.',
    poster: { gradient: ['#525252', '#171717'], icon: 'AlertTriangle' },
    backdrop: { gradient: ['#525252', DEEP_BLACK], icon: 'AlertTriangle', pattern: 'noise' },
    badges: ['Coming Soon'],
    en: {
      title: 'Risks & Open Questions',
      tagline: 'What can go wrong, and the unanswered questions.',
      excerpt:
        'Licensed content, TMDB rate limits, Cache Components canary, JWT revocation, open scope.',
    },
  },
};

const SECTION_NUMBER_TO_ID: Record<number, SectionId> = {
  1: 'overview',
  2: 'features',
  3: 'stack',
  4: 'architecture',
  5: 'data-model',
  6: 'routes',
  7: 'flows',
  8: 'cross-cutting',
  9: 'components',
  10: 'testing',
  11: 'security',
  12: 'roadmap',
  13: 'risks',
};

export function sectionIdForNumber(n: number): SectionId | undefined {
  return SECTION_NUMBER_TO_ID[n];
}
