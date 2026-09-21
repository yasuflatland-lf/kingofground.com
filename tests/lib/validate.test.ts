import { describe, expect, it } from 'vitest';
import { assertAllLocales, assertKnownCategories } from '../../src/lib/validate';

describe('assertKnownCategories', () => {
  const categories = [{ id: 'basics' }, { id: 'tricks' }];

  it('全部のカテゴリが登録済みなら何もしない', () => {
    expect(() =>
      assertKnownCategories([{ id: 'ja/basics/a' }, { id: 'en/tricks/b' }], categories),
    ).not.toThrow();
  });

  it('未登録のカテゴリがあれば、そのガイド ID を含めて throw', () => {
    expect(() =>
      assertKnownCategories([{ id: 'ja/basics/a' }, { id: 'ja/gear/tires' }], categories),
    ).toThrow(/ja\/gear\/tires/);
  });

  it('メッセージに追加先のディレクトリを含める', () => {
    expect(() => assertKnownCategories([{ id: 'ja/gear/tires' }], categories)).toThrow(
      /guide-categories/,
    );
  });
});

describe('assertAllLocales', () => {
  it('全ロケールがあれば何もしない', () => {
    expect(() =>
      assertAllLocales([{ id: 'ja/history' }, { id: 'en/history' }], 'history'),
    ).not.toThrow();
  });

  it('en が無ければ、欠けているロケール名を含めて throw', () => {
    expect(() => assertAllLocales([{ id: 'ja/history' }], 'history')).toThrow(
      /"history" is missing locales: en/,
    );
  });
});
