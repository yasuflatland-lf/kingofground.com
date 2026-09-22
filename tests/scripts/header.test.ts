// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bindNavToggle, observeStuck } from '../../src/scripts/header';

type Entry = { isIntersecting: boolean };
type Callback = (entries: Entry[]) => void;

function required<T>(value: T | null): T {
  if (value === null) throw new Error('要素が無い');
  return value;
}

describe('observeStuck', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('センチネルが画面から出ると data-stuck が付き、戻ると外れる', () => {
    let callback: Callback = () => {};
    const observe = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe = observe;
        constructor(cb: Callback) {
          callback = cb;
        }
      },
    );
    const header = document.createElement('header');
    const sentinel = document.createElement('div');

    observeStuck(header, sentinel);

    expect(observe).toHaveBeenCalledWith(sentinel);
    callback([{ isIntersecting: false }]);
    expect(header.hasAttribute('data-stuck')).toBe(true);
    callback([{ isIntersecting: true }]);
    expect(header.hasAttribute('data-stuck')).toBe(false);
  });
});

describe('bindNavToggle', () => {
  function setup() {
    document.body.innerHTML = `
      <button data-nav-toggle aria-expanded="false">
        <svg data-icon="open"></svg>
        <svg data-icon="close" class="hidden"></svg>
      </button>
      <div id="site-nav" class="hidden"></div>`;
    const toggle = required(document.querySelector<HTMLButtonElement>('[data-nav-toggle]'));
    const nav = required(document.getElementById('site-nav'));
    bindNavToggle(toggle, nav);
    return { toggle, nav };
  }

  afterEach(() => {
    document.documentElement.classList.remove('overflow-hidden');
    document.body.innerHTML = '';
  });

  it('クリックで開き、aria-expanded とアイコンと html の overflow-hidden が切り替わる', () => {
    const { toggle, nav } = setup();

    toggle.click();

    expect(nav.classList.contains('hidden')).toBe(false);
    expect(nav.classList.contains('flex')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(required(toggle.querySelector('[data-icon="open"]')).classList.contains('hidden')).toBe(
      true,
    );
    expect(required(toggle.querySelector('[data-icon="close"]')).classList.contains('hidden')).toBe(
      false,
    );
    expect(document.documentElement.classList.contains('overflow-hidden')).toBe(true);
  });

  it('もう一度クリックすると閉じ、overflow-hidden が外れる', () => {
    const { toggle, nav } = setup();

    toggle.click();
    toggle.click();

    expect(nav.classList.contains('hidden')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.documentElement.classList.contains('overflow-hidden')).toBe(false);
  });

  it('開いているときの Escape で閉じる', () => {
    const { toggle, nav } = setup();
    toggle.click();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(nav.classList.contains('hidden')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.documentElement.classList.contains('overflow-hidden')).toBe(false);
  });
});
