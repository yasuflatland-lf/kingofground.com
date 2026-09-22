/** 上端のセンチネルが画面から出たら header に data-stuck を付け、戻ったら外す */
export function observeStuck(header: HTMLElement, sentinel: Element): IntersectionObserver {
  const observer = new IntersectionObserver(([entry]) => {
    header.toggleAttribute('data-stuck', !entry.isIntersecting);
  });
  observer.observe(sentinel);
  return observer;
}

/** ハンバーガーで #site-nav を開閉する。開いている間は本文のスクロールを止め、Escape で閉じる */
export function bindNavToggle(toggle: HTMLButtonElement, nav: HTMLElement): void {
  const setOpen = (open: boolean) => {
    nav.classList.toggle('hidden', !open);
    nav.classList.toggle('flex', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('[data-icon="open"]')?.classList.toggle('hidden', open);
    toggle.querySelector('[data-icon="close"]')?.classList.toggle('hidden', !open);
    document.documentElement.classList.toggle('overflow-hidden', open);
  };
  toggle.addEventListener('click', () => setOpen(nav.classList.contains('hidden')));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
  });
}
