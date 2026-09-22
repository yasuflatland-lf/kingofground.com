// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bindNavToggle, observeStuck } from '../../src/scripts/header';

type Entry = { isIntersecting: boolean };
type Callback = (entries: Entry[]) => void;

function required<T>(value: T | null): T {
  if (value === null) throw new Error('要素が無い');
  return value;
}

/** IntersectionObserver を差し替え、observe のスパイと、登録されたコールバックを呼ぶ notify を返す */
function stubIntersectionObserver() {
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
  return { observe, notify: (entries: Entry[]) => callback(entries) };
}

describe('observeStuck', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('センチネルが画面から出ると data-stuck が付き、戻ると外れる', () => {
    const { observe, notify } = stubIntersectionObserver();
    const header = document.createElement('header');
    const sentinel = document.createElement('div');

    observeStuck(header, sentinel);

    expect(observe).toHaveBeenCalledWith(sentinel);
    notify([{ isIntersecting: false }]);
    expect(header.hasAttribute('data-stuck')).toBe(true);
    notify([{ isIntersecting: true }]);
    expect(header.hasAttribute('data-stuck')).toBe(false);
  });

  it('1 回の通知に複数の entry が届いたら最後の entry で判定する', () => {
    const { notify } = stubIntersectionObserver();
    const header = document.createElement('header');
    observeStuck(header, document.createElement('div'));

    notify([{ isIntersecting: false }, { isIntersecting: true }]);
    expect(header.hasAttribute('data-stuck')).toBe(false);
    notify([{ isIntersecting: true }, { isIntersecting: false }]);
    expect(header.hasAttribute('data-stuck')).toBe(true);
  });
});

describe('bindNavToggle', () => {
  type MediaListener = (event: { matches: boolean }) => void;
  let mediaListener: MediaListener = () => {};
  const matchMedia = vi.fn((query: string) => ({
    media: query,
    matches: false,
    addEventListener: (_type: string, listener: MediaListener) => {
      mediaListener = listener;
    },
  }));

  function setup() {
    document.body.innerHTML = `
      <button data-nav-toggle aria-expanded="false">
        <svg data-icon="open"></svg>
        <svg data-icon="close" class="hidden"></svg>
      </button>
      <div id="site-nav" class="hidden"></div>`;
    const toggle = required(document.querySelector<HTMLButtonElement>('[data-nav-toggle]'));
    const nav = required(document.getElementById('site-nav'));
    vi.stubGlobal('matchMedia', matchMedia);
    bindNavToggle(toggle, nav);
    return { toggle, nav };
  }

  afterEach(() => {
    document.documentElement.classList.remove('overflow-hidden');
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
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

  it('lg 以上の幅を監視し、open のまま広がったら閉じてスクロールを解放する', () => {
    const { toggle, nav } = setup();
    expect(matchMedia).toHaveBeenCalledWith('(width >= 64.0625rem)');
    toggle.click();

    mediaListener({ matches: true });

    expect(nav.classList.contains('hidden')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.documentElement.classList.contains('overflow-hidden')).toBe(false);
  });

  it('閉じているときに lg 以上へ広がっても何もしない', () => {
    const { toggle } = setup();
    mediaListener({ matches: true });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('Escape で閉じたらフォーカスをボタンに戻す', () => {
    const { toggle, nav } = setup();
    const link = document.createElement('a');
    link.href = '/blogs/';
    nav.append(link);
    toggle.click();
    link.focus();
    expect(document.activeElement).toBe(link);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(document.activeElement).toBe(toggle);
  });
});
