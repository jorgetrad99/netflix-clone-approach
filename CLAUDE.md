# CLAUDE.md — Netflix Docs Viewer

> Instrucciones operativas para el agente. Este archivo es **load-bearing**: léelo antes de cualquier cambio. Si una instrucción aquí entra en conflicto con un request del usuario, preguntá.

---

## 1. Qué es este proyecto

Aplicación **Next.js 16** que renderiza el contenido de [PLAN_NETFLIX_CLONE.md](PLAN_NETFLIX_CLONE.md) con la **estética y patrones de navegación de Netflix** (hero, rows, cards, modal, "player").

- **Es un meta-proyecto**: documenta el plan de un Netflix Clone, *siendo* visualmente un Netflix Clone.
- **No es** el Netflix Clone real. No hay auth, DB, billing ni reproducción de video.
- Plan maestro de este proyecto: [PLAN_DOCS_VIEWER.md](PLAN_DOCS_VIEWER.md).
- Referencia técnica de Next.js 16: [nextjs.md](nextjs.md).

**Source of truth del contenido**: `PLAN_NETFLIX_CLONE.md`. Editarlo regenera la UI vía pipeline de build.

---

## 2. Reglas no negociables

### 2.1 Arquitectura
- **Server-first.** RSC por defecto. Marcá `'use client'` solo cuando se necesite estado, eventos o APIs de browser.
- **Sin runtime backend.** No agregues DB, auth, API routes con lógica de negocio. El sitio es **100% estático** (SSG).
- **Cache Components.** Usá `use cache` + `cacheTag` en cualquier RSC que toque `content.generated.ts`. Ver [nextjs.md §6](nextjs.md).
- **No mezcles parsing en runtime.** Todo el procesamiento de Markdown ocurre en `content/parse.ts` durante build. Nunca importes `unified`/`remark`/`shiki` desde un componente.

### 2.2 Stack — usar exactamente esto
- Next.js 16 App Router · TypeScript estricto · Tailwind v4 · Radix UI + shadcn/ui · Framer Motion · lucide-react.
- Markdown: `unified` + `remark` + `remark-gfm`. Highlight: **Shiki** (build-time).
- Diagramas: **mermaid** con `dynamic(..., { ssr: false })` + Suspense. **Nunca** lo importes estáticamente.
- Search: **Fuse.js** con índice pre-built.
- Persistencia local: **Zustand** con `persist` middleware → `localStorage`.
- **No agregues**: Redux, MobX, SWR, React Query, Apollo, GraphQL, Prisma, Drizzle, NextAuth.

### 2.3 Performance budgets (gates de CI)
- First-load JS ≤ **130KB gzip** (size-limit).
- LCP `/` < **2.0s**, CLS < **0.05**.
- Lighthouse Performance ≥ **95**.
- Bundle de mermaid **no puede** aparecer en chunks de `/`, `/browse/*`, `/title/*`. Solo en `/watch/*`.

### 2.4 A11y
- 0 violaciones axe `serious`/`critical` en `/`, `/title/[slug]`, `/watch/[slug]`.
- Toda interacción de mouse debe tener equivalente teclado.
- `prefers-reduced-motion` desactiva hero rotation y card preview.

---

## 3. Layout del repositorio

```
.
├── app/                        # App Router (RSC + client islands)
├── components/                 # UI compartido
├── content/
│   ├── parse.ts                # build script (tsx CLI)
│   ├── augment.ts              # metadata hand-crafted
│   ├── shiki.ts                # singleton highlighter
│   ├── types.ts                # Section, Episode, Block, …
│   └── generated/              # OUTPUT del parser (committed)
├── lib/
│   ├── search/                 # Fuse index loader
│   ├── store/                  # Zustand stores
│   └── utils/
├── public/
├── test/                       # factories, fixtures
├── e2e/                        # Playwright
├── PLAN_DOCS_VIEWER.md         # plan maestro de ESTE proyecto
├── PLAN_NETFLIX_CLONE.md       # source of truth del contenido
├── nextjs.md                   # referencia técnica
└── CLAUDE.md                   # este archivo
```

**Co-ubicación de tests:**
- Unit / component → `Foo.ts` ↔ `Foo.test.ts`.
- Integration de Server Functions / route handlers → `actions.test.ts` al lado.
- E2E → `/e2e/*.spec.ts`.

---

## 4. Cómo agregar contenido nuevo

> **Regla de oro:** nunca edites un componente para "meter" contenido. El contenido vive en `PLAN_NETFLIX_CLONE.md` o en `content/augment.ts`.

1. **Agregar/modificar sección o subsección:** editá `PLAN_NETFLIX_CLONE.md`. Asegurate de respetar la jerarquía H2 (sección) → H3 (episodio).
2. **Cambiar metadata visual** (poster gradient, icono, rank Top 10, badges): editá `content/augment.ts`. Cada `SectionId` debe estar presente — el parser falla si falta una.
3. **Regenerar:** `npm run content:build` (o dejá `npm run dev`, que lo corre en watch).
4. **Test del parser** debe pasar: `vitest run content/`.

**Si un cambio en el plan rompe el parser**, *fixea el parser para que sea más robusto*, no edites el plan para acomodar al parser. El plan es la fuente de verdad.

---

## 5. Cómo agregar componentes

- Default = Server Component. Solo agregá `'use client'` si el componente necesita estado, refs, event handlers, o APIs de browser.
- shadcn/ui se instala con `npx shadcn@latest add <component>` y vive en `components/ui/`. **No editar** archivos de `ui/` salvo para extender variantes con `cva`.
- Componentes de dominio van en `components/<dominio>/` (ej: `components/browse/Card.tsx`).
- Variantes visuales con `class-variance-authority` (`cva`), no con props booleanas sueltas.

**Nuevos componentes deben venir con:**
- Test colocado al lado (`Foo.test.tsx`).
- Si es Client Component visible: cubrir keyboard + `aria-*` + estado focus.

---

## 6. Convenciones de código

- **TypeScript estricto.** No `any`. Usá `unknown` + narrowing si es necesario. `noUncheckedIndexedAccess` está activo.
- **Imports absolutos** con alias `@/*` (configurado en `tsconfig`).
- **Naming:** componentes `PascalCase`, hooks `useXxx`, utilidades `camelCase`, constantes `SCREAMING_SNAKE`.
- **Server Functions** (si llegan a existir): archivo `actions.ts`, top-level `'use server'`, schema Zod en boundary.
- **Sin barrel files** (`index.ts` reexportando). Importá de la ruta directa.
- **Sin comentarios obvios.** Solo cuando el *por qué* no se deriva del código.
- **Sin docstrings multi-línea.** Una línea max donde haga falta.

---

## 7. Reglas anti-scope-creep

- No agregues features que no estén en `PLAN_DOCS_VIEWER.md` §13.
- No agregues "modo claro": el sitio es **dark-only** (Netflix lo es).
- No agregues i18n hasta post-MVP.
- No agregues comentarios sociales / ratings / likes.
- No instales librerías nuevas sin justificación clara — preguntá primero.
- Tres líneas similares es mejor que una abstracción prematura. No factorizes hasta que haya 3 usos reales.

---

## 8. Comandos útiles

```bash
npm run dev                # Next.js dev + content watcher
npm run build              # prebuild → content:build, luego next build
npm run content:build      # parser standalone
npm run lint               # eslint + tsc --noEmit
npm run test               # vitest run
npm run test:watch
npm run test:e2e           # playwright test
npm run test:e2e:ui        # playwright --ui
npm run analyze            # next build con bundle analyzer
```

> **No corras `npm run build` solo para verificar tipos.** Usá `npm run lint` (que incluye `tsc --noEmit`).

---

## 9. Git y workflow

- **Nunca** hagas commits sin que el usuario lo pida explícitamente.
- **Nunca** hagas push sin permiso explícito.
- **Nunca** uses `--no-verify` para saltar hooks. Si un hook falla, fixeá la causa.
- Branches feature: `feat/<short-desc>`, fixes: `fix/<short-desc>`.
- PRs: título corto, body con "Why" + checklist de testing.

---

## 10. Cuándo preguntar al usuario

Pedí confirmación antes de:
- Instalar una dependencia nueva.
- Cambiar el sistema de diseño (tokens de Tailwind, fuentes).
- Cambiar la estructura de `content/types.ts` (rompe el parser).
- Mover/renombrar archivos en `app/` (rompe rutas).
- Borrar o reescribir tests existentes.
- Cualquier cosa que el plan no cubra.

No preguntes para:
- Crear un componente nuevo dentro del scope del plan.
- Agregar tests.
- Renombrar variables locales / refactor interno de un archivo.
- Fixes de bugs claramente acotados.

---

## 11. Anti-patrones a evitar

- ❌ Importar mermaid estáticamente desde un componente.
- ❌ Hacer fetch en runtime de markdown (todo se parsea en build).
- ❌ Usar `useState` para datos que pueden vivir en URL/searchParams.
- ❌ Usar `'use client'` en componentes "por las dudas".
- ❌ Agregar un wrapper `<div>` solo para colgar una clase — usá la clase en el hijo.
- ❌ Componentes con > 6 props booleanas — usá `variant` con `cva`.
- ❌ `useEffect` para sync de props → state. Es casi siempre un anti-pattern.
- ❌ Persistir en localStorage desde un componente. Usá el store Zustand correspondiente.

---

## 12. Cómo testear features de UI

> **Type checking y unit tests verifican corrección del código, no de la feature.**

Para cualquier cambio visible:
1. `npm run dev`, abrí en navegador, **probá la golden path**.
2. Probá teclado (Tab, Enter, ESC, flechas donde aplique).
3. Probá en mobile viewport (DevTools).
4. Si tocaste el player o un diagrama: probá fullscreen y zoom.
5. Si no podés testear visualmente, **decilo explícitamente** en lugar de declarar la tarea como completa.

---

## 13. Referencia rápida de patrones

**Cargar contenido en una RSC:**
```tsx
import { sections } from '@/content/generated/content'

export default async function TitlePage({
  params,
}: { params: Promise<{ slug: string }> }) {
  'use cache'
  const { slug } = await params
  const section = sections.find(s => s.slug === slug)
  if (!section) notFound()
  return <TitleHero section={section} />
}
```

**Lazy mermaid:**
```tsx
'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const MermaidDiagram = dynamic(
  () => import('@/components/watch/MermaidDiagram'),
  { ssr: false, loading: () => <DiagramSkeleton /> }
)

export function DiagramBlock({ source }: { source: string }) {
  return (
    <Suspense fallback={<DiagramSkeleton />}>
      <MermaidDiagram source={source} />
    </Suspense>
  )
}
```

**Card con hover preview accesible:**
```tsx
'use client'
export function Card({ section }: { section: Section }) {
  return (
    <Link
      href={`/title/${section.slug}`}
      className="group relative aspect-video overflow-hidden rounded-[var(--radius-card)]
                 transition-transform duration-[var(--duration-card)]
                 motion-safe:hover:scale-150 motion-safe:focus-visible:scale-150
                 hover:z-50"
      aria-label={`Open ${section.title}`}
    >
      <PosterCanvas spec={section.hero.poster} />
      <CardPreview section={section} className="opacity-0 group-hover:opacity-100" />
    </Link>
  )
}
```

---

## 14. Si te quedás bloqueado

1. Releé el plan — la respuesta probablemente está ahí.
2. Si el plan no la tiene: preguntá al usuario antes de inventar.
3. No tomes decisiones de diseño grandes en silencio.
4. No "limpies" código fuera del scope del task actual.

---

**Última actualización:** 2026-05-14 — versión inicial del documento.
