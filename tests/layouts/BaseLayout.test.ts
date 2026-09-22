import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import BaseLayout from '../../src/layouts/BaseLayout.astro';

async function renderLayout(locale: 'ja' | 'en') {
  const container = await AstroContainer.create();
  return container.renderToString(BaseLayout, {
    props: {
      locale,
      title: 'KING OF GROUND',
      description: 'desc',
      translations: { ja: '/', en: '/en/' },
    },
    slots: { default: '<p>本文</p>' },
  });
}

describe('BaseLayout', () => {
  it('body の先頭にスキップリンクがあり、main に id="main" が付く', async () => {
    const html = await renderLayout('ja');
    expect(html).toMatch(
      /<body[^>]*>\s*<a href="#main" class="btn sr-only focus:not-sr-only"[^>]*>\s*本文へ移動\s*<\/a>/,
    );
    expect(html).toMatch(/<main[^>]*id="main"/);
    expect(html).toContain('<p>本文</p>');
  });

  it('body は relative（ヘッダーのセンチネルの基準）', async () => {
    const html = await renderLayout('en');
    expect(html).toMatch(/<body class="[^"]*relative[^"]*"/);
    expect(html).toContain('Skip to content');
  });
});
