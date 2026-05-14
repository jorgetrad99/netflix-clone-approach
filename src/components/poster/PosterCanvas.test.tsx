import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PosterCanvas } from './PosterCanvas';
import type { PosterSpec } from '@/content/types';

const baseSpec: PosterSpec = {
  gradient: ['#e50914', '#220505'],
  icon: 'Film',
};

describe('<PosterCanvas>', () => {
  it('renders a gradient with both stop colors', () => {
    const { container } = render(<PosterCanvas spec={baseSpec} />);
    const stops = container.querySelectorAll('stop');
    expect(stops).toHaveLength(2);
    expect(stops[0]?.getAttribute('stop-color')).toBe('#e50914');
    expect(stops[1]?.getAttribute('stop-color')).toBe('#220505');
  });

  it('renders the icon SVG when icon name is known', () => {
    const { container } = render(<PosterCanvas spec={baseSpec} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });

  it('falls back to Film icon when icon name is unknown', () => {
    const { container } = render(<PosterCanvas spec={{ ...baseSpec, icon: 'NotARealIcon' }} />);
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });

  it('adds a pattern overlay rect only when pattern is set', () => {
    const { container: noPattern } = render(<PosterCanvas spec={baseSpec} />);
    const gradientSvg = noPattern.querySelector('svg');
    expect(gradientSvg?.querySelectorAll(':scope > rect')).toHaveLength(1);

    const { container: withPattern } = render(
      <PosterCanvas spec={{ ...baseSpec, pattern: 'dots' }} />,
    );
    const gradientSvgWith = withPattern.querySelector('svg');
    expect(gradientSvgWith?.querySelectorAll(':scope > rect')).toHaveLength(2);
  });

  it('uses larger icon size in backdrop variant', () => {
    const { container: card } = render(<PosterCanvas spec={baseSpec} variant="card" />);
    const { container: backdrop } = render(<PosterCanvas spec={baseSpec} variant="backdrop" />);
    const cardIcon = card.querySelectorAll('svg')[1];
    const backdropIcon = backdrop.querySelectorAll('svg')[1];
    expect(cardIcon?.getAttribute('class')).toMatch(/h-16/);
    expect(backdropIcon?.getAttribute('class')).toMatch(/h-32/);
  });
});
