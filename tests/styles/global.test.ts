import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// docs/design.md の Do / Don't のうち、値だけで判定できるものを CI で強制する。
const root = fileURLToPath(new URL('../..', import.meta.url));
const read = (path: string) => readFileSync(`${root}${path}`, 'utf8');
const css = read('src/styles/global.css');

describe('フォント', () => {
  it('欧文はシステムフォント、和文は Hiragino → Meiryo の順で、system-ui を省略しない', () => {
    const chain = css.match(/--font-sans:\s*([^;]+);/)?.[1].replace(/\s+/g, ' ');
    expect(chain).toBe(
      '"SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, system-ui, sans-serif',
    );
  });

  it('Web フォントを読み込まない', () => {
    expect(read('package.json')).not.toContain('@fontsource');
    expect(read('src/layouts/BaseLayout.astro')).not.toContain('@fontsource');
    expect(read('src-maintenance/components/MaintenancePage.astro')).not.toContain('@fontsource');
  });
});

describe('行間と字間', () => {
  it('html に行間 1.5 と字間 0.04em を置く', () => {
    const html = css.match(/\n\s*html\s*\{([^}]*)\}/)?.[1];
    expect(html).toMatch(/line-height:\s*1\.5;/);
    expect(html).toMatch(/letter-spacing:\s*0\.04em;/);
  });

  it('文字サイズの utility は Caption（text-xs）だけで、行間は 1.5', () => {
    expect(css).toContain('--text-*: initial;');
    expect(css).toContain('--text-xs: 0.75rem;');
    expect(css).toContain('--text-xs--line-height: 1.5;');
    expect(css).not.toMatch(/--text-(sm|base|lg|xl):/);
  });

  it('字間を 0 にしない', () => {
    expect(css).not.toMatch(/letter-spacing:\s*0(px|em)?;/);
  });

  it('見出しの utility は字間 0.04em を再宣言する（px で継承されないように）', () => {
    for (const name of ['h1', 'h2', 'h3']) {
      const block = css.match(new RegExp(`@utility text-${name} \\{([^}]*)\\}`))?.[1];
      expect(block, name).toMatch(/letter-spacing:\s*0\.04em;/);
      expect(block, name).not.toContain(':lang(');
    }
    expect(css).not.toMatch(/@utility text-h[4-6]/);
  });
});

describe('階層', () => {
  it('影は 3 段のトークンだけ', () => {
    expect(css).toContain('--shadow-1: 0 2px 8px rgb(0 0 0 / 0.08);');
    expect(css).toContain('--shadow-2: 0 4px 16px rgb(0 0 0 / 0.12);');
    expect(css).toContain('--shadow-3: 0 8px 32px rgb(0 0 0 / 0.16);');
  });

  it('コンテナは 1200px', () => {
    const block = css.match(/\.container-site\s*\{([^}]*)\}/)?.[1];
    expect(block).toMatch(/max-width:\s*75rem;/);
  });
});
