import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlockRenderer } from './BlockRenderer';

vi.mock('./DiagramBlock', () => ({
  DiagramBlock: ({ source, id }: { source: string; id: string }) => (
    <div data-testid="diagram-stub" data-source={source} data-id={id} />
  ),
}));

describe('<BlockRenderer>', () => {
  it('renders prose blocks as HTML inside .docs-prose', () => {
    const { container } = render(
      <BlockRenderer block={{ kind: 'prose', html: '<p>Hello <strong>world</strong></p>' }} />,
    );
    expect(container.querySelector('.docs-prose strong')?.textContent).toBe('world');
  });

  it('renders code blocks as HTML inside .docs-code', () => {
    const { container } = render(
      <BlockRenderer block={{ kind: 'code', lang: 'ts', html: '<pre class="shiki"/>', raw: '' }} />,
    );
    expect(container.querySelector('.docs-code pre.shiki')).not.toBeNull();
  });

  it('delegates mermaid blocks to DiagramBlock', () => {
    render(<BlockRenderer block={{ kind: 'mermaid', source: 'graph TD', id: 'm1' }} />);
    const stub = screen.getByTestId('diagram-stub');
    expect(stub).toHaveAttribute('data-source', 'graph TD');
    expect(stub).toHaveAttribute('data-id', 'm1');
  });

  it('renders table blocks as HTML', () => {
    const { container } = render(
      <BlockRenderer block={{ kind: 'table', html: '<table><tr><td>a</td></tr></table>' }} />,
    );
    expect(container.querySelector('table td')?.textContent).toBe('a');
  });

  it('renders callout blocks with the correct variant border', () => {
    const { container } = render(
      <BlockRenderer block={{ kind: 'callout', variant: 'warn', html: '<p>warn</p>' }} />,
    );
    expect(container.querySelector('aside')?.className).toMatch(/warning/);
  });
});
