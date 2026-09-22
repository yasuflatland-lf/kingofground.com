import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Header from '../../src/components/Header.astro';

async function renderHeader(locale: 'ja' | 'en', url = 'https://kingofground.com/') {
  const container = await AstroContainer.create();
  return container.renderToString(Header, {
    props: {
      locale,
      translations: { ja: '/blogs/', en: '/en/blogs/' },
      fallbackPath: '/blogs/',
    },
    request: new Request(url),
  });
}

describe('Header', () => {
  it('ナビ 4 件をロケール付きの URL で描画し、101 へのボタンは置かない', async () => {
    const html = await renderHeader('en');
    for (const path of ['/en/', '/en/history/', '/en/blogs/', '/en/results/']) {
      expect(html).toContain(`href="${path}" class="nav-link"`);
    }
    expect(html).not.toContain('href="/en/101/"');
    expect(html).not.toContain('class="btn');
  });

  it('ナビの右に言語の切り替えを置く', async () => {
    const html = await renderHeader('ja');
    expect(html).toContain('class="lang-switch"');
    expect(html).toContain('href="/en/blogs/"');
  });

  it('ハンバーガーは aria で #site-nav を指し、ラベルはロケールの文言', async () => {
    const html = await renderHeader('ja');
    expect(html).toContain('data-nav-toggle');
    expect(html).toContain('aria-controls="site-nav"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-label="メニュー"');
    expect(html).toContain('id="site-nav"');
  });

  it('wordmark は lang="en" でホームへリンクし、stuck では白になる', async () => {
    const html = await renderHeader('ja');
    expect(html).toMatch(/<a href="\/" lang="en" class="[^"]*group-data-stuck:text-white[^"]*"/);
    expect(html).not.toContain('text-lg');
  });

  it('上端の 40px センチネルと、sticky で data-stuck に黒くなる header を描画する', async () => {
    const html = await renderHeader('ja');
    expect(html).toMatch(
      /<div data-header-sentinel class="pointer-events-none absolute top-0 h-10 w-full" aria-hidden="true">/,
    );
    expect(html).toContain(
      '<header class="site-header group sticky top-0 z-10 max-h-dvh overflow-y-auto bg-white data-stuck:bg-black">',
    );
    expect(html).toMatch(/<div class="container-site [^"]*py-3[^"]*"/);
    expect(html).not.toContain('my-5');
  });

  it('JS 無効時は白いヘッダーに soft の下罫線を付ける', async () => {
    const html = await renderHeader('ja');
    expect(html).toMatch(
      /<noscript>[\s\S]*\.site-header\s*\{[^}]*border-bottom: 1px solid var\(--color-soft\)/,
    );
    expect(html).toMatch(/@media \(width < 64\.0625rem\)[\s\S]*position: static/);
  });

  it('URL に一致するナビ項目だけに aria-current="page" が付く', async () => {
    const html = await renderHeader('en', 'https://kingofground.com/en/blogs/hello/');
    expect(html).toContain('href="/en/blogs/" class="nav-link" aria-current="page"');
    expect(html).toContain('href="/en/" class="nav-link"');
    expect(html).not.toContain('href="/en/" class="nav-link" aria-current');
    expect((html.match(/aria-current="page"/g) ?? []).length).toBe(2); // ナビ 1 件 + 言語トグルの現在地
  });

  it('ホームは完全一致のときだけ現在ページになる', async () => {
    const home = await renderHeader('ja', 'https://kingofground.com/');
    expect(home).toContain('href="/" class="nav-link" aria-current="page"');
    const blog = await renderHeader('ja', 'https://kingofground.com/blogs/');
    expect(blog).not.toContain('href="/" class="nav-link" aria-current');
    expect(blog).toContain('href="/blogs/" class="nav-link" aria-current="page"');
  });

  it('前方一致は末尾のスラッシュ込みなので、似た名前のパスは現在ページにならない', async () => {
    const html = await renderHeader('ja', 'https://kingofground.com/blogs-archive/');
    expect(html).not.toContain('href="/blogs/" class="nav-link" aria-current');
  });
});
