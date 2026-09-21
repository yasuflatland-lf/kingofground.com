import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import CtaBox from '../../src/components/CtaBox.astro';
import FeatureGrid from '../../src/components/FeatureGrid.astro';
import Hero from '../../src/components/Hero.astro';

describe('Hero', () => {
  it('wordmark・リード・2 つのボタン・線画を描画する', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero, {
      props: { locale: 'en' },
    });
    expect(html).toMatch(/<h1[^>]*lang="en"[^>]*>\s*KING OF GROUND\s*<\/h1>/);
    expect(html).toContain('The BMX flatland contest series.');
    expect(html).toContain('href="/en/101/" class="btn"');
    expect(html).toContain('href="/en/results/" class="btn btn-outline"');
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
  });
});

describe('FeatureGrid', () => {
  it('歴史・リザルト・101 の 3 項目をリンク付きで描画する', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(FeatureGrid, {
      props: { locale: 'ja' },
    });
    expect((html.match(/<li /g) ?? []).length).toBe(3);
    expect(html).toContain('href="/history/"');
    expect(html).toContain('href="/results/"');
    expect(html).toContain('href="/101/"');
    expect(html).toContain('KING OF GROUND とは');
  });
});

describe('CtaBox', () => {
  it('見出し・本文・101 へのボタンを描画する', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CtaBox, {
      props: { locale: 'en' },
    });
    expect(html).toContain('Start riding flatland.');
    expect(html).toContain('href="/en/101/" class="btn btn-invert mt-8"');
  });
});
