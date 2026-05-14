import { describe, it, expect, beforeAll } from 'vitest';
import { parsePlan } from './parse';
import type { Section } from './types';
import { SECTION_IDS } from './types';
import { SECTION_AUGMENT } from './augment';

let sections: Section[];

beforeAll(async () => {
  const result = await parsePlan();
  sections = result.sections;
}, 60_000);

describe('parsePlan', () => {
  it('emits exactly one section per known SectionId', () => {
    const ids = sections.map((s) => s.id).sort();
    expect(ids).toEqual([...SECTION_IDS].sort());
  });

  it('preserves the section order from the markdown', () => {
    const numbers = sections.map((s) => s.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it('detects all 7 mermaid diagrams in the plan', () => {
    const mermaidCount = sections.reduce(
      (n, s) =>
        n +
        s.intro.filter((b) => b.kind === 'mermaid').length +
        s.episodes.reduce((m, e) => m + e.blocks.filter((b) => b.kind === 'mermaid').length, 0),
      0,
    );
    expect(mermaidCount).toBe(7);
  });

  it('attaches augment metadata to every section', () => {
    for (const section of sections) {
      const augment = SECTION_AUGMENT[section.id];
      expect(section.category).toBe(augment.category);
      expect(section.hero.tagline).toBe(augment.tagline);
    }
  });

  it('highlights code blocks with shiki (pre tag in html)', () => {
    const stack = sections.find((s) => s.id === 'stack');
    expect(stack).toBeDefined();
    const allBlocks = stack!.intro.concat(stack!.episodes.flatMap((e) => e.blocks));
    const codeBlocks = allBlocks.filter((b) => b.kind === 'code');
    expect(codeBlocks.length).toBeGreaterThan(0);
    for (const block of codeBlocks) {
      if (block.kind !== 'code') continue;
      expect(block.html).toMatch(/<pre[^>]*class="shiki/);
    }
  });

  it('flows section has 6 episodes (one per mermaid sequence)', () => {
    const flows = sections.find((s) => s.id === 'flows');
    expect(flows).toBeDefined();
    expect(flows!.episodes.length).toBe(6);
  });

  it('every section has a non-empty excerpt and runtime ≥ 1', () => {
    for (const section of sections) {
      expect(section.excerpt.length).toBeGreaterThan(0);
      expect(section.meta.runtime).toBeGreaterThanOrEqual(1);
    }
  });
});
