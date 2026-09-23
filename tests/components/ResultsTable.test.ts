import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import ResultsTable from '../../src/components/ResultsTable.astro';

describe('ResultsTable', () => {
  const placements = [
    { rank: 1, rider: 'ライダー A' },
    { rank: 2, rider: 'ライダー B' },
  ];

  it('クラス名・見出し行・各順位を描画する', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ResultsTable, {
      props: { locale: 'ja', name: 'MASTER', placements },
    });
    expect(html).toMatch(/<h2 class="text-h3" lang="en">MASTER<\/h2>/);
    expect(html).toMatch(/<tr class="border-b border-soft text-xs text-medium">/);
    expect(html).toMatch(/順位\s*<\/th>/);
    expect(html).toMatch(/ライダー\s*<\/th>/);
    expect(html).toContain('ライダー A');
    expect(html).toContain('ライダー B');
    expect(html.match(/<tr/g)?.length).toBe(3);
  });

  it('en では英語の見出し行', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ResultsTable, {
      props: { locale: 'en', name: 'MASTER', placements },
    });
    expect(html).toContain('Rank');
    expect(html).toContain('Rider');
  });

  it('points が無ければポイント列を出さない', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ResultsTable, {
      props: { locale: 'ja', name: 'MASTER', placements },
    });
    expect(html).not.toContain('ポイント');
    expect(html.match(/<th class=/g)?.length).toBe(2);
  });

  it('points があればポイント列を右寄せで出す', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ResultsTable, {
      props: {
        locale: 'ja',
        name: 'PRO',
        placements: [
          { rank: 1, rider: '森崎　弘也', points: 280 },
          { rank: 2, rider: '山本　亮二', points: 275 },
        ],
      },
    });
    expect(html).toMatch(/ポイント\s*<\/th>/);
    expect(html).toMatch(/<th class="w-24 py-2 pl-4 text-right font-normal">/);
    expect(html).toContain('280');
    expect(html).toContain('275');
    expect(html.match(/<th class=/g)?.length).toBe(3);
  });
});
