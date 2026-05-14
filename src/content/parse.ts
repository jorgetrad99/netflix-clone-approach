import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import type { Root, RootContent, Heading, Nodes } from 'mdast';
import { SECTION_AUGMENT, sectionIdForNumber } from './augment';
import { highlight } from './shiki';
import {
  SECTION_IDS,
  type Block,
  type Episode,
  type SearchDoc,
  type Section,
  type SectionId,
} from './types';

const ROOT = resolve(import.meta.dirname, '..', '..');
const SOURCE_PATH = resolve(ROOT, 'PLAN_NETFLIX_CLONE.md');
const OUT_DIR = resolve(import.meta.dirname, 'generated');
const WORDS_PER_MINUTE = 220;

interface RawSection {
  number: number;
  title: string;
  intro: RootContent[];
  episodes: RawEpisode[];
}

interface RawEpisode {
  number: number;
  title: string;
  body: RootContent[];
}

function extractText(node: Nodes): string {
  if ('value' in node && typeof node.value === 'string') return node.value;
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map((c) => extractText(c as Nodes)).join('');
  }
  return '';
}

function parseHeadingTitle(heading: Heading): { number: number | null; title: string } {
  const raw = extractText(heading);
  const match = /^(\d+)(?:\.(\d+))?\.?\s+(.+)$/.exec(raw.trim());
  if (!match) return { number: null, title: raw.trim() };
  const major = Number(match[1]);
  const minor = match[2] ? Number(match[2]) : null;
  return { number: minor ?? major, title: match[3] };
}

function splitSections(tree: Root): RawSection[] {
  const sections: RawSection[] = [];
  let currentSection: RawSection | null = null;
  let currentEpisode: RawEpisode | null = null;

  for (const node of tree.children) {
    if (node.type === 'heading' && node.depth === 1) continue;

    if (node.type === 'heading' && node.depth === 2) {
      const { number, title } = parseHeadingTitle(node);
      if (number == null) continue;
      currentSection = { number, title, intro: [], episodes: [] };
      currentEpisode = null;
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) continue;

    if (node.type === 'heading' && node.depth === 3) {
      const { number, title } = parseHeadingTitle(node);
      currentEpisode = { number: number ?? currentSection.episodes.length + 1, title, body: [] };
      currentSection.episodes.push(currentEpisode);
      continue;
    }

    if (node.type === 'thematicBreak') continue;

    if (currentEpisode) {
      currentEpisode.body.push(node);
    } else {
      currentSection.intro.push(node);
    }
  }
  return sections;
}

function nodeToHtml(node: RootContent): string {
  const hast = toHast(node, { allowDangerousHtml: true });
  if (!hast) return '';
  return toHtml(hast, { allowDangerousHtml: true });
}

function isCodeMermaid(node: RootContent): node is RootContent & { lang: string; value: string } {
  return node.type === 'code' && (node as { lang?: string }).lang === 'mermaid';
}

function isCode(node: RootContent): node is RootContent & { lang: string | null; value: string } {
  return node.type === 'code';
}

function isTable(node: RootContent): boolean {
  return node.type === 'table';
}

async function nodesToBlocks(nodes: RootContent[], scope: string): Promise<Block[]> {
  const blocks: Block[] = [];
  let proseBuffer: RootContent[] = [];
  let mermaidCount = 0;

  const flushProse = () => {
    if (proseBuffer.length === 0) return;
    const html = proseBuffer.map(nodeToHtml).join('\n');
    blocks.push({ kind: 'prose', html });
    proseBuffer = [];
  };

  for (const node of nodes) {
    if (isCodeMermaid(node)) {
      flushProse();
      mermaidCount += 1;
      blocks.push({
        kind: 'mermaid',
        source: node.value,
        id: `${scope}-mermaid-${mermaidCount}`,
      });
      continue;
    }
    if (isCode(node)) {
      flushProse();
      const lang = node.lang ?? 'text';
      const html = await highlight(node.value, lang);
      blocks.push({ kind: 'code', lang, html, raw: node.value });
      continue;
    }
    if (isTable(node)) {
      flushProse();
      blocks.push({ kind: 'table', html: nodeToHtml(node) });
      continue;
    }
    proseBuffer.push(node);
  }
  flushProse();
  return blocks;
}

function nodesToText(nodes: RootContent[]): string {
  return nodes
    .map((node) => extractText(node))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeExcerpt(text: string, maxChars = 160): string {
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 100 ? lastSpace : maxChars).trim()}…`;
}

function readingTimeMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

async function buildSection(raw: RawSection): Promise<Section | null> {
  const id = sectionIdForNumber(raw.number);
  if (!id) return null;
  const augment = SECTION_AUGMENT[id];

  const intro = await nodesToBlocks(raw.intro, id);
  const episodes: Episode[] = [];
  for (const ep of raw.episodes) {
    const blocks = await nodesToBlocks(ep.body, `${id}-${ep.number}`);
    const text = nodesToText(ep.body);
    episodes.push({
      id: `${id}/${ep.number}`,
      number: ep.number,
      title: ep.title,
      runtime: readingTimeMinutes(text),
      blocks,
    });
  }

  const introText = nodesToText(raw.intro);
  const epsText = raw.episodes.map((ep) => nodesToText(ep.body)).join(' ');
  const fullText = `${introText} ${epsText}`.trim();

  return {
    id,
    slug: id,
    title: raw.title,
    number: raw.number,
    category: augment.category,
    hero: { tagline: augment.tagline, poster: augment.poster, backdrop: augment.backdrop },
    meta: {
      runtime: readingTimeMinutes(fullText),
      rank: augment.rank,
      badges: augment.badges ?? [],
    },
    excerpt: augment.excerpt || makeExcerpt(introText),
    intro,
    episodes,
  };
}

function buildSearchIndex(sections: Section[]): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const section of sections) {
    docs.push({
      id: section.id,
      sectionId: section.id,
      title: section.title,
      category: section.category,
      excerpt: section.excerpt,
      text: `${section.title} ${section.excerpt}`,
    });
    for (const ep of section.episodes) {
      const text = ep.blocks
        .map((b) => {
          if (b.kind === 'prose') return stripHtml(b.html);
          if (b.kind === 'code') return b.raw;
          if (b.kind === 'mermaid') return b.source;
          if (b.kind === 'table') return stripHtml(b.html);
          return '';
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      docs.push({
        id: ep.id,
        sectionId: section.id,
        episodeId: ep.id,
        title: `${section.title} · ${ep.title}`,
        category: section.category,
        excerpt: makeExcerpt(text),
        text,
      });
    }
  }
  return docs;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function emitContentModule(sections: Section[], slugs: string[]): string {
  const json = JSON.stringify(sections, null, 2);
  return `// AUTO-GENERATED by src/content/parse.ts. Do not edit by hand.
import type { Section, SectionId } from '../types';

export const sections: Section[] = ${json} as const satisfies Section[];

export const sectionsBySlug: Record<string, Section> = Object.fromEntries(
  sections.map((s) => [s.slug, s]),
);

export const sectionsById: Record<SectionId, Section> = Object.fromEntries(
  sections.map((s) => [s.id, s]),
) as Record<SectionId, Section>;

export const SECTION_SLUGS = ${JSON.stringify(slugs)} as const;
`;
}

export async function parsePlan(): Promise<{ sections: Section[]; index: SearchDoc[] }> {
  const source = await readFile(SOURCE_PATH, 'utf8');
  const tree = unified().use(remarkParse).use(remarkGfm).parse(source) as Root;
  const raws = splitSections(tree);

  const sections: Section[] = [];
  for (const raw of raws) {
    const section = await buildSection(raw);
    if (section) sections.push(section);
  }
  sections.sort((a, b) => a.number - b.number);

  const expected = new Set<SectionId>(SECTION_IDS);
  for (const section of sections) expected.delete(section.id);
  if (expected.size > 0) {
    throw new Error(
      `Parser missing sections: ${[...expected].join(', ')}. Check PLAN_NETFLIX_CLONE.md headings.`,
    );
  }

  const index = buildSearchIndex(sections);
  return { sections, index };
}

async function main() {
  console.log(`📖 Parsing ${SOURCE_PATH}`);
  const { sections, index } = await parsePlan();
  await mkdir(OUT_DIR, { recursive: true });
  const slugs = sections.map((s) => s.slug);
  await writeFile(resolve(OUT_DIR, 'content.ts'), emitContentModule(sections, slugs), 'utf8');
  await writeFile(resolve(OUT_DIR, 'search-index.json'), JSON.stringify(index, null, 2), 'utf8');
  console.log(
    `✅ Emitted ${sections.length} sections, ${sections.reduce((n, s) => n + s.episodes.length, 0)} episodes, ${index.length} search docs`,
  );
}

const isDirectInvocation =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/') ?? '');

if (isDirectInvocation) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
