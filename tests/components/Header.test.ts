import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Header from '../../src/components/Header.astro';

async function renderHeader(locale: 'ja' | 'en') {
  const container = await AstroContainer.create();
  return container.renderToString(Header, {
    props: {
      locale,
      translations: { ja: '/blogs/', en: '/en/blogs/' },
      fallbackPath: '/blogs/',
    },
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

  it('wordmark は lang="en" でホームへリンクする', async () => {
    const html = await renderHeader('ja');
    expect(html).toMatch(/<a href="\/" lang="en"[^>]*>/);
  });
});
