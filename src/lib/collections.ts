import { type CollectionEntry, getCollection } from 'astro:content';
import { type Locale, locales } from '../i18n/config';
import {
  filterByLocale,
  findTranslations,
  groupGuidesByCategory,
  groupResultsByYear,
  guideCategoryOf,
  isPublished,
  resultParts,
  sortByDateDesc,
  splitId,
} from './content';
import { assertAllLocales, assertKnownCategories } from './validate';

export type Blog = CollectionEntry<'blogs'>;
export type Result = CollectionEntry<'results'>;
export type Guide = CollectionEntry<'guides'>;
export type GuideCategory = CollectionEntry<'guideCategories'>;
export type Page = CollectionEntry<'pages'>;

const isProd = import.meta.env.PROD;

async function publishedBlogs(): Promise<Blog[]> {
  return getCollection('blogs', (entry) => isPublished(entry, isProd));
}

export async function getBlogs(locale: Locale): Promise<Blog[]> {
  return sortByDateDesc(filterByLocale(await publishedBlogs(), locale), (e) => e.data.pubDate);
}

export async function getBlogTranslations(slug: string): Promise<Partial<Record<Locale, Blog>>> {
  return findTranslations(await publishedBlogs(), slug);
}

export async function getResults(locale: Locale): Promise<Result[]> {
  return sortByDateDesc(filterByLocale(await getCollection('results'), locale), (e) => e.data.date);
}

export async function getResultTranslations(
  slug: string,
): Promise<Partial<Record<Locale, Result>>> {
  return findTranslations(await getCollection('results'), slug);
}

/** そのロケールのリザルトを年ごとにまとめる。年は降順、年内はラウンド番号の昇順 */
export async function getResultsByYear(
  locale: Locale,
): Promise<Array<{ year: number; results: Result[] }>> {
  return groupResultsByYear(filterByLocale(await getCollection('results'), locale));
}

/** その年にリザルトが 1 件以上あるロケール */
export async function getResultYearLocales(year: number): Promise<Locale[]> {
  const all = await getCollection('results');
  return locales.filter((locale) =>
    all.some((entry) => splitId(entry.id).locale === locale && resultParts(entry.id).year === year),
  );
}

export async function getGuideCategories(): Promise<GuideCategory[]> {
  const categories = await getCollection('guideCategories');
  return [...categories].sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

export async function getGuides(locale: Locale): Promise<Guide[]> {
  const all = await getCollection('guides');
  assertKnownCategories(all, await getGuideCategories());
  return filterByLocale(all, locale);
}

export async function getGuideTranslations(slug: string): Promise<Partial<Record<Locale, Guide>>> {
  return findTranslations(await getCollection('guides'), slug);
}

export async function getGuideCategoriesFor(
  locale: Locale,
): Promise<Array<{ category: GuideCategory; guides: Guide[] }>> {
  const grouped = groupGuidesByCategory(await getGuides(locale));
  const categories = await getGuideCategories();
  return categories.flatMap((category) => {
    const guides = grouped.get(category.id);
    return guides ? [{ category, guides }] : [];
  });
}

export async function getPage(locale: Locale, slug: string): Promise<Page> {
  const all = await getCollection('pages');
  assertAllLocales(all, slug);
  const page = findTranslations(all, slug)[locale];
  if (!page) throw new Error(`pages/${locale}/${slug} not found`);
  return page;
}

/** そのカテゴリに記事が 1 件以上あるロケール */
export async function getGuideCategoryLocales(categoryId: string): Promise<Locale[]> {
  const all = await getCollection('guides');
  return locales.filter((locale) =>
    all.some(
      (guide) => splitId(guide.id).locale === locale && guideCategoryOf(guide.id) === categoryId,
    ),
  );
}
