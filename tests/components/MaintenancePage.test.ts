import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import MaintenancePage from '../../src-maintenance/components/MaintenancePage.astro';

describe('MaintenancePage', () => {
  it('ja / en の文言を lang 付きのブロックで描画し、検索エンジンには noindex を返す', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(MaintenancePage);
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(html).toMatch(/<section lang="ja"[^>]*>[\s\S]*メンテナンス中[\s\S]*<\/section>/);
    expect(html).toMatch(/<section lang="en"[^>]*>[\s\S]*Under maintenance[\s\S]*<\/section>/);
    expect(html).toMatch(/lang="en"[^>]*>\s*KING OF GROUND\s*</);
  });

  it('本サイトのナビへのリンクを出さない（リンク先がビルドに含まれないため）', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(MaintenancePage);
    expect(html).not.toMatch(/<a /);
    expect(html).not.toContain('<nav');
  });
});
