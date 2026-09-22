import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import PageHeader from '../../src/components/PageHeader.astro';

describe('PageHeader', () => {
  it('date は h1 の後に time で出る', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PageHeader, {
      props: { locale: 'ja', title: 'タイトル', date: new Date('2026-09-21') },
    });
    expect(html).toContain('2026年9月21日');
    expect(html.indexOf('</h1>')).toBeLessThan(html.indexOf('<time'));
  });

  it('kicker は h1 の前にリンクで出る', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PageHeader, {
      props: {
        locale: 'en',
        title: 'Title',
        kicker: { label: 'Basics', href: '/en/101/basics/' },
      },
    });
    expect(html).toMatch(
      /<p class="kicker">\s*<a href="\/en\/101\/basics\/"[^>]*>\s*Basics\s*<\/a>\s*<\/p>/,
    );
    expect(html.indexOf('class="kicker"')).toBeLessThan(html.indexOf('<h1'));
  });

  it('kicker.lang="en" はキッカーのリンクに付く', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PageHeader, {
      props: {
        locale: 'ja',
        title: 'KING OF GROUND 2025 ROUND 1',
        titleLang: 'en',
        kicker: {
          label: 'KING OF GROUND 2025',
          href: '/results/2025/',
          lang: 'en',
        },
      },
    });
    expect(html).toMatch(
      /<a href="\/results\/2025\/"[^>]*lang="en"[^>]*>\s*KING OF GROUND 2025\s*<\/a>/,
    );
  });

  it('titleLang="en" は h1 に付き、description は p で出る', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PageHeader, {
      props: {
        locale: 'ja',
        title: 'KING OF GROUND 2025',
        description: '会場: 東京',
        titleLang: 'en',
      },
    });
    expect(html).toMatch(/<h1[^>]*lang="en"/);
    expect(html).toMatch(/<p[^>]*>会場: 東京<\/p>/);
  });
});
