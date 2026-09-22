import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import LanguageSwitcher from '../../src/components/LanguageSwitcher.astro';

async function render(props: Record<string, unknown>) {
  const container = await AstroContainer.create();
  return container.renderToString(LanguageSwitcher, { props });
}

describe('LanguageSwitcher', () => {
  it('JA と EN を config の順に並べ、現在のロケールはリンクにせず aria-current を付ける', async () => {
    const html = await render({
      locale: 'ja',
      translations: { ja: '/blogs/hello/', en: '/en/blogs/hello/' },
      fallbackPath: '/blogs/',
    });
    expect(html).toMatch(/<span[^>]*aria-current="page"[^>]*>\s*JA\s*<\/span>/);
    expect(html).toMatch(/<a[^>]*href="\/en\/blogs\/hello\/"[^>]*>\s*EN\s*<\/a>/);
    expect(html).not.toContain('href="/blogs/hello/"');
    expect(html.indexOf('JA')).toBeLessThan(html.indexOf('EN'));
  });

  it('相手側のリンクには hreflang / lang / data-locale を付ける', async () => {
    const html = await render({
      locale: 'ja',
      translations: { ja: '/blogs/hello/', en: '/en/blogs/hello/' },
      fallbackPath: '/blogs/',
    });
    expect(html).toContain('hreflang="en"');
    expect(html).toContain('lang="en"');
    expect(html).toContain('data-locale="en"');
  });

  it('翻訳が無ければ fallbackPath をそのロケールに変換した先へリンクする', async () => {
    const html = await render({
      locale: 'ja',
      translations: { ja: '/blogs/ja-only/' },
      fallbackPath: '/blogs/',
    });
    expect(html).toContain('href="/en/blogs/"');
  });

  it('en ページでは EN が現在で、JA が日本語版へリンクする', async () => {
    const html = await render({
      locale: 'en',
      translations: { ja: '/history/', en: '/en/history/' },
    });
    expect(html).toMatch(/<span[^>]*aria-current="page"[^>]*>\s*EN\s*<\/span>/);
    expect(html).toMatch(/<a[^>]*href="\/history\/"[^>]*>\s*JA\s*<\/a>/);
    expect(html).not.toContain('href="/en/history/"');
    expect(html.indexOf('JA')).toBeLessThan(html.indexOf('EN'));
  });

  it('グループと各セグメントの読み上げ名はロケールの文言', async () => {
    const html = await render({
      locale: 'ja',
      translations: { ja: '/', en: '/en/' },
    });
    expect(html).toContain('aria-label="言語"');
    expect(html).toContain('aria-label="日本語"');
    expect(html).toContain('aria-label="English"');
  });
});
