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

  it('lang.code は切り替えに出す 2 文字のコード、lang.switcher はそのグループ名', () => {
    expect(t('ja', 'lang.code')).toBe('JA');
    expect(t('en', 'lang.code')).toBe('EN');
    expect(t('ja', 'lang.switcher')).toBe('言語');
    expect(t('en', 'lang.switcher')).toBe('Language');
  });

  it('nav.skip はスキップリンクの文言', () => {
    expect(t('ja', 'nav.skip')).toBe('本文へ移動');
    expect(t('en', 'nav.skip')).toBe('Skip to content');
  });

  it('ヘッダーの 101 ボタンの文言は無い', () => {
    expect('nav.guides' in ui.ja).toBe(false);
    expect('nav.guides' in ui.en).toBe(false);
  });

  it('ホームとヘッダーの新しい文言がある', () => {
    expect(t('ja', 'nav.toggle')).toBe('メニュー');
    expect(t('en', 'home.heroPrimary')).toBe('Read the 101');
    expect(t('en', 'home.feature.guides.title')).toBe('101');
    expect(t('ja', 'home.ctaTitle')).toBe('フラットランドをはじめよう。');
  });
});
