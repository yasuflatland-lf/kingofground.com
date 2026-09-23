import { describe, expect, it } from 'vitest';
import {
  availableLocales,
  filterByLocale,
  findTranslations,
  groupGuidesByCategory,
  groupResultsByYear,
  guideCategoryOf,
  guideSlugOf,
  isPublished,
  resultParts,
  sortByDateDesc,
  splitId,
  standingsYear,
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
    expect(findTranslations(entries, 'a')).toEqual({
      ja: { id: 'ja/a' },
      en: { id: 'en/a' },
    });
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
  const guide = (id: string, order: number, title: string) => ({
    id,
    data: { order, title },
  });
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

describe('resultParts', () => {
  it('ロケール/西暦/round<n> を年とラウンド番号に分ける', () => {
    expect(resultParts('ja/2025/round1')).toEqual({ year: 2025, round: 1 });
    expect(resultParts('en/2024/round12')).toEqual({ year: 2024, round: 12 });
  });
  it('年ディレクトリが無いリザルトは throw', () => {
    expect(() => resultParts('ja/2025-round-1')).toThrow(/<year>\/round<n>/);
  });
  it('round<n> 以外のファイル名は throw', () => {
    expect(() => resultParts('ja/2025/final')).toThrow(/<year>\/round<n>/);
    expect(() => resultParts('ja/2025/round01')).toThrow(/<year>\/round<n>/);
    expect(() => resultParts('ja/2025/round0')).toThrow(/<year>\/round<n>/);
  });
  it('西暦が 4 桁でなければ throw', () => {
    expect(() => resultParts('ja/25/round1')).toThrow(/<year>\/round<n>/);
    expect(() => resultParts('ja/season/round1')).toThrow(/<year>\/round<n>/);
  });
});

describe('groupResultsByYear', () => {
  it('年の降順にまとめ、年内はラウンド番号の昇順', () => {
    const grouped = groupResultsByYear([
      { id: 'ja/2024/round2' },
      { id: 'ja/2025/round10' },
      { id: 'ja/2025/round2' },
      { id: 'ja/2024/round1' },
    ]);
    expect(grouped.map((g) => g.year)).toEqual([2025, 2024]);
    expect(grouped[0]?.results.map((r) => r.id)).toEqual(['ja/2025/round2', 'ja/2025/round10']);
    expect(grouped[1]?.results.map((r) => r.id)).toEqual(['ja/2024/round1', 'ja/2024/round2']);
  });
  it('空なら空の配列', () => {
    expect(groupResultsByYear([])).toEqual([]);
  });
});

describe('standingsYear', () => {
  it('`<locale>/<西暦>` から年を取り出す', () => {
    expect(standingsYear('ja/2001')).toBe(2001);
    expect(standingsYear('en/2025')).toBe(2025);
  });
  it('ラウンドのパスは受け付けない', () => {
    expect(() => standingsYear('ja/2001/round1')).toThrow(/<locale>\/<year>/);
  });
  it('4 桁でない年は受け付けない', () => {
    expect(() => standingsYear('ja/01')).toThrow(/<locale>\/<year>/);
    expect(() => standingsYear('ja/yearend')).toThrow(/<locale>\/<year>/);
  });
});
