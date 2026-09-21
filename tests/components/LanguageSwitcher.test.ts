import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import LanguageSwitcher from '../../src/components/LanguageSwitcher.astro';

describe('LanguageSwitcher', () => {
  it('翻訳があればその URL へリンクする', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(LanguageSwitcher, {
      props: {
        locale: 'ja',
        translations: { ja: '/blogs/hello/', en: '/en/blogs/hello/' },
        fallbackPath: '/blogs/',
      },
    });
    expect(html).toContain('href="/en/blogs/hello/"');
    expect(html).toContain('hreflang="en"');
    expect(html).toMatch(/>\s*English\s*</);
    expect(html).not.toContain('href="/blogs/hello/"');
  });

  it('翻訳が無ければ fallbackPath をそのロケールに変換した先へリンクする', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(LanguageSwitcher, {
      props: { locale: 'ja', translations: { ja: '/blogs/ja-only/' }, fallbackPath: '/blogs/' },
    });
    expect(html).toContain('href="/en/blogs/"');
  });

  it('en ページからは日本語へリンクする', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(LanguageSwitcher, {
      props: { locale: 'en', translations: { ja: '/history/', en: '/en/history/' } },
    });
    expect(html).toContain('href="/history/"');
    expect(html).toMatch(/>\s*日本語\s*</);
  });
});
