import { createHighlighter, type Highlighter } from 'shiki';

const LANGS = ['ts', 'tsx', 'js', 'jsx', 'json', 'bash', 'sh', 'yaml', 'sql', 'css', 'md'] as const;
const THEME = 'github-dark';

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: [...LANGS],
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang: string): Promise<string> {
  const hl = await getHighlighter();
  const resolvedLang = (LANGS as readonly string[]).includes(lang) ? lang : 'text';
  return hl.codeToHtml(code, {
    lang: resolvedLang,
    theme: THEME,
  });
}
