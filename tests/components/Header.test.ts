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
  it('ナビ 4 件と 101 ボタンをロケール付きの URL で描画する', async () => {
    const html = await renderHeader('en');
    for (const path of ['/en/', '/en/history/', '/en/blogs/', '/en/results/']) {
      expect(html).toContain(`href="${path}" class="nav-link"`);
    }
    expect(html).toContain('href="/en/101/" class="btn btn-sm"');
    expect(html).not.toMatch(/class="nav-link">\s*101\s*</);
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
