import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Footer from '../../src/components/Footer.astro';

describe('Footer', () => {
  it('黒の全幅の帯に soft の文字で著作権とタグラインを出す', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, {
      props: { locale: 'ja' },
    });
    expect(html).toMatch(
      /^<footer class="bg-black py-10 text-center text-xs text-soft">\s*<div class="container-site">/,
    );
    expect(html).toContain('© KING OF GROUND');
    expect(html).toContain('BMX フラットランド コンテストシリーズ');
    expect(html).not.toContain('mt-20');
    expect(html).not.toContain('mb-10');
    expect(html).not.toContain('text-medium');
  });
});
