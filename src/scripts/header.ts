/** 上端のセンチネルが画面から出たら header に data-stuck を付け、戻ったら外す */
export function observeStuck(header: HTMLElement, sentinel: Element): void {
  const observer = new IntersectionObserver((entries) => {
    // 1 回の通知に複数の entry が届くことがあるので、最新のものだけを見る
    const latest = entries.at(-1);
    if (latest) header.toggleAttribute('data-stuck', !latest.isIntersecting);
  });
  observer.observe(sentinel);
}

/** lg 以上ではハンバーガーが消えてナビが常時表示になる（global.css の --breakpoint-lg と同じ値） */
const DESKTOP_NAV = '(width >= 64.0625rem)';

/**
 * ハンバーガーで #site-nav を開閉する。開いている間は本文のスクロールを止め、
 * Escape で閉じてボタンにフォーカスを戻す。lg 以上に広がったら閉じてスクロールを解放する
 */
export function bindNavToggle(toggle: HTMLButtonElement, nav: HTMLElement): void {
  const setOpen = (open: boolean) => {
    nav.classList.toggle('hidden', !open);
    nav.classList.toggle('flex', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('[data-icon="open"]')?.classList.toggle('hidden', open);
    toggle.querySelector('[data-icon="close"]')?.classList.toggle('hidden', !open);
    document.documentElement.classList.toggle('overflow-hidden', open);
  };
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia(DESKTOP_NAV).addEventListener('change', (event) => {
    if (event.matches && isOpen()) setOpen(false);
  });
}
