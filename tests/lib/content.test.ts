import { describe, expect, it } from 'vitest';
import {
  availableLocales,
  filterByLocale,
  findTranslations,
  groupGuidesByCategory,
  guideCategoryOf,
  guideSlugOf,
  isPublished,
  sortByDateDesc,
  splitId,
} from '../../src/lib/content';

describe('splitId', () => {
  it('先頭セグメントがロケール、残りがスラッグ', () => {
    expect(splitId('ja/hello')).toEqual({ locale: 'ja', slug: 'hello' });
    expect(splitId('en/basics/what-is-flatland')).toEqual({
      locale: 'en',
      slug: 'basics/what-is-flatland',
    });
  });
  it('ロケールが無い ID は throw', () => {
    expect(() => splitId('hello')).toThrow(/no locale segment/);
  });
  it('未知のロケールは throw', () => {
    expect(() => splitId('fr/hello')).toThrow(/unknown locale/);
  });
  it('スラッグが空なら throw', () => {
    expect(() => splitId('ja/')).toThrow(/empty slug/);
  });
});

describe('filterByLocale', () => {
  const entries = [{ id: 'ja/a' }, { id: 'en/a' }, { id: 'ja/b' }];
  it('そのロケールのエントリだけ返す', () => {
    expect(filterByLocale(entries, 'ja').map((e) => e.id)).toEqual(['ja/a', 'ja/b']);
    expect(filterByLocale(entries, 'en').map((e) => e.id)).toEqual(['en/a']);
  });
});

describe('findTranslations', () => {
  const entries = [{ id: 'ja/a' }, { id: 'en/a' }, { id: 'ja/b' }];
  it('両方あるときは ja と en', () => {
    expect(findTranslations(entries, 'a')).toEqual({ ja: { id: 'ja/a' }, en: { id: 'en/a' } });
  });
  it('en が無いときは en キー自体が無い', () => {
    const found = findTranslations(entries, 'b');
    expect(found).toEqual({ ja: { id: 'ja/b' } });
    expect('en' in found).toBe(false);
  });
  it('どちらも無いときは空', () => {
    expect(findTranslations(entries, 'zzz')).toEqual({});
  });
});

describe('availableLocales', () => {
  it('存在するロケールを locales の順で返す', () => {
    expect(availableLocales({ en: {}, ja: {} })).toEqual(['ja', 'en']);
    expect(availableLocales({ ja: {} })).toEqual(['ja']);
    expect(availableLocales({})).toEqual([]);
  });
});

describe('sortByDateDesc', () => {
  it('新しい順に並べ、元の配列は変えない', () => {
    const entries = [
      { id: 'a', date: new Date('2025-01-01') },
      { id: 'c', date: new Date('2025-03-01') },
      { id: 'b', date: new Date('2025-02-01') },
    ];
    const sorted = sortByDateDesc(entries, (e) => e.date);
    expect(sorted.map((e) => e.id)).toEqual(['c', 'b', 'a']);
    expect(entries.map((e) => e.id)).toEqual(['a', 'c', 'b']);
  });
});

describe('isPublished', () => {
  it('本番では draft を除外する', () => {
    expect(isPublished({ data: { draft: true } }, true)).toBe(false);
    expect(isPublished({ data: { draft: false } }, true)).toBe(true);
    expect(isPublished({ data: {} }, true)).toBe(true);
  });
  it('開発では draft も含める', () => {
    expect(isPublished({ data: { draft: true } }, false)).toBe(true);
  });
});

describe('guideCategoryOf / guideSlugOf', () => {
  it('ロケール/カテゴリ/スラッグ に分ける', () => {
    expect(guideCategoryOf('ja/basics/what-is-flatland')).toBe('basics');
    expect(guideSlugOf('ja/basics/what-is-flatland')).toBe('what-is-flatland');
  });
  it('カテゴリディレクトリが無いガイドは throw', () => {
    expect(() => guideCategoryOf('ja/orphan')).toThrow(/category directory/);
    expect(() => guideSlugOf('ja/orphan')).toThrow(/category directory/);
  });
});

describe('groupGuidesByCategory', () => {
  const guide = (id: string, order: number, title: string) => ({ id, data: { order, title } });
  it('カテゴリごとにまとめ、order 昇順・同値はタイトル順', () => {
    const grouped = groupGuidesByCategory([
      guide('ja/tricks/b', 2, 'B'),
      guide('ja/basics/y', 1, 'Y'),
      guide('ja/tricks/a', 1, 'A'),
      guide('ja/basics/x', 1, 'X'),
    ]);
    expect([...grouped.keys()].sort()).toEqual(['basics', 'tricks']);
    expect(grouped.get('tricks')?.map((g) => g.id)).toEqual(['ja/tricks/a', 'ja/tricks/b']);
    expect(grouped.get('basics')?.map((g) => g.id)).toEqual(['ja/basics/x', 'ja/basics/y']);
  });
  it('空なら空の Map', () => {
    expect(groupGuidesByCategory([]).size).toBe(0);
  });
});
