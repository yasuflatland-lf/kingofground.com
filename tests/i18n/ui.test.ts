import { describe, expect, it } from 'vitest';
import { locales } from '../../src/i18n/config';
import { t, ui } from '../../src/i18n/ui';

describe('ui', () => {
  it('全ロケールが同じキー集合を持つ', () => {
    const [first, ...rest] = locales;
    const expected = Object.keys(ui[first]).sort();
    for (const locale of rest) {
      expect(Object.keys(ui[locale]).sort()).toEqual(expected);
    }
  });

  it('空文字の文言が無い', () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(ui[locale])) {
        expect(value, `${locale}.${key}`).not.toBe('');
      }
    }
  });

  it('t はロケールの文言を返す', () => {
    expect(t('ja', 'nav.blogs')).toBe('ブログ');
    expect(t('en', 'nav.blogs')).toBe('Blog');
  });

  it('lang.name は各言語の自称', () => {
    expect(t('ja', 'lang.name')).toBe('日本語');
    expect(t('en', 'lang.name')).toBe('English');
  });

  it('ホームとヘッダーの新しい文言がある', () => {
    expect(t('ja', 'nav.toggle')).toBe('メニュー');
    expect(t('en', 'home.heroPrimary')).toBe('Read the 101');
    expect(t('en', 'home.feature.guides.title')).toBe('101');
    expect(t('ja', 'home.ctaTitle')).toBe('フラットランドをはじめよう。');
  });
});
