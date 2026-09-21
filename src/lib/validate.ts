import { locales } from '../i18n/config';
import { findTranslations, guideCategoryOf } from './content';

/** すべてのガイドのカテゴリが guide-categories に登録されていなければビルドを止める */
export function assertKnownCategories(
  guides: Array<{ id: string }>,
  categories: Array<{ id: string }>,
): void {
  const known = new Set(categories.map((category) => category.id));
  const unknown = guides.filter((guide) => !known.has(guideCategoryOf(guide.id)));
  if (unknown.length === 0) return;
  throw new Error(
    `Unknown guide category in: ${unknown.map((guide) => guide.id).join(', ')}. ` +
      'Add a <category>.yaml under src/content/guide-categories/.',
  );
}

/** ナビから常にリンクされるページは全ロケール必須。欠けていればビルドを止める */
export function assertAllLocales(entries: Array<{ id: string }>, slug: string): void {
  const found = findTranslations(entries, slug);
  const missing = locales.filter((locale) => found[locale] === undefined);
  if (missing.length === 0) return;
  throw new Error(`"${slug}" is missing locales: ${missing.join(', ')}`);
}
