import { describe, it, expect, beforeEach } from 'vitest';
import { useMyListStore } from './my-list';

describe('useMyListStore', () => {
  beforeEach(() => {
    useMyListStore.setState({ ids: [] });
    globalThis.localStorage.clear();
  });

  it('starts empty', () => {
    expect(useMyListStore.getState().ids).toEqual([]);
  });

  it('add appends an id; duplicates are no-ops', () => {
    const { add } = useMyListStore.getState();
    add('a');
    add('b');
    add('a');
    expect(useMyListStore.getState().ids).toEqual(['a', 'b']);
  });

  it('toggle adds when missing and removes when present', () => {
    const { toggle } = useMyListStore.getState();
    toggle('overview');
    expect(useMyListStore.getState().ids).toContain('overview');
    toggle('overview');
    expect(useMyListStore.getState().ids).not.toContain('overview');
  });

  it('remove drops an id; missing removes are no-ops', () => {
    const { add, remove } = useMyListStore.getState();
    add('a');
    add('b');
    remove('a');
    expect(useMyListStore.getState().ids).toEqual(['b']);
    remove('zzz');
    expect(useMyListStore.getState().ids).toEqual(['b']);
  });

  it('clear empties the list', () => {
    const { add, clear } = useMyListStore.getState();
    add('a');
    add('b');
    clear();
    expect(useMyListStore.getState().ids).toEqual([]);
  });

  it('has reflects current state', () => {
    const { add, has } = useMyListStore.getState();
    expect(has('a')).toBe(false);
    add('a');
    expect(useMyListStore.getState().has('a')).toBe(true);
  });

  it('persists to localStorage under nf-docs:my-list', () => {
    useMyListStore.getState().add('overview');
    const raw = globalThis.localStorage.getItem('nf-docs:my-list');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.ids).toContain('overview');
    expect(parsed.version).toBe(1);
  });
});
