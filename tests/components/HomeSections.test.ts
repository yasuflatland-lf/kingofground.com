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
    expect(html).toMatch(
      /^<section class="bg-white">\s*<div class="container-site [^"]*pt-16 pb-16 md:pt-12 md:pb-24[^"]*"/,
    );
    expect(html).not.toContain('pb-8 ');
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
    expect(html).toMatch(
      /^<section class="bg-off-white py-10 md:py-16">\s*<div class="container-site">/,
    );
    expect(html).not.toContain('mt-16 md:mt-0');
    expect(html).not.toContain('text-medium');
    expect((html.match(/<p class="mt-2 text-body">/g) ?? []).length).toBe(3);
  });
});

describe('CtaBox', () => {
  it('見出し・本文・101 へのボタンを描画する', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CtaBox, {
      props: { locale: 'en' },
    });
    expect(html).toContain('Start riding flatland.');
    expect(html).toContain('href="/en/101/" class="btn mt-8"');
  });

  it('highlight の全幅の帯で、文字は black / ink、ボタンは黒 1 つだけ', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CtaBox, {
      props: { locale: 'ja' },
    });
    expect(html).toMatch(/^<section class="bg-highlight py-16">\s*<div class="container-site">/);
    expect(html).not.toContain('rounded-lg');
    expect(html).not.toContain('bg-black');
    expect(html).not.toContain('btn-invert');
    expect(html).not.toContain('btn-outline');
    expect(html).toMatch(/<p class="[^"]*text-ink[^"]*">/);
    expect((html.match(/class="btn /g) ?? []).length).toBe(1);
  });
});
