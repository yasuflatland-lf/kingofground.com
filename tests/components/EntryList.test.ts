import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import EntryList from '../../src/components/EntryList.astro';

describe('EntryList', () => {
  it('各エントリをリンク・タイトル・日付付きで描画し、description が無ければ p を出さない', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EntryList, {
      props: {
        locale: 'ja',
        items: [
          {
            title: '記事 A',
            date: new Date('2026-09-21'),
            description: '説明 A',
            href: '/blogs/a/',
          },
          { title: '記事 B', date: new Date('2026-09-20'), href: '/blogs/b/' },
        ],
      },
    });
    expect(html).toContain('href="/blogs/a/"');
    expect(html).toContain('href="/blogs/b/"');
    expect(html).toMatch(/<h3[^>]*>記事 A<\/h3>/);
    expect(html).toContain('2026年9月21日');
    expect(html).toContain('説明 A');
    expect((html.match(/<p /g) ?? []).length).toBe(1);
    expect(html).toContain('<p class="mt-2 text-body">説明 A</p>');
  });

  it('プレースホルダー面は装飾なので aria-hidden', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EntryList, {
      props: {
        locale: 'en',
        items: [{ title: 'A', date: new Date('2026-01-01'), href: '/en/a/' }],
      },
    });
    expect(html).toContain('aria-hidden="true"');
    expect(html).toMatch(/lang="en"[^>]*>\s*KOG\s*</);
    expect(html).toMatch(/class="[^"]*rounded-md border border-soft"[^>]*aria-hidden="true"/);
    expect(html).not.toContain('bg-off-white');
  });

  it('headingLevel="h2" と item.lang="en" を渡すと h2 に lang="en" が付く', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EntryList, {
      props: {
        locale: 'ja',
        headingLevel: 'h2',
        items: [
          {
            title: 'KING OF GROUND 2025',
            date: new Date('2025-01-01'),
            href: '/results/kog-2025/',
            lang: 'en',
          },
        ],
      },
    });
    expect(html).toMatch(/<h2[^>]*lang="en"[^>]*>KING OF GROUND 2025<\/h2>/);
  });
});
