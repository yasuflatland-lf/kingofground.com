import { type Locale, locales } from '../i18n/config';
import { isLocale } from '../i18n/utils';

/** glob ローダーで読んだエントリ。ID は `<locale>/<slug>` */
export interface Localized {
  id: string;
}

export interface IdParts {
  locale: Locale;
  slug: string;
}

export function splitId(id: string): IdParts {
  const separator = id.indexOf('/');
  if (separator === -1) throw new Error(`Entry id "${id}" has no locale segment`);
  const locale = id.slice(0, separator);
  const slug = id.slice(separator + 1);
  if (!isLocale(locale)) throw new Error(`Entry id "${id}" has unknown locale "${locale}"`);
  if (slug.length === 0) throw new Error(`Entry id "${id}" has an empty slug`);
  return { locale, slug };
}

export function filterByLocale<T extends Localized>(entries: T[], locale: Locale): T[] {
  return entries.filter((entry) => splitId(entry.id).locale === locale);
}

/** 同じスラッグを持つエントリをロケールごとに返す。無いロケールのキーは作らない */
export function findTranslations<T extends Localized>(
  entries: T[],
  slug: string,
): Partial<Record<Locale, T>> {
  const found: Partial<Record<Locale, T>> = {};
  for (const entry of entries) {
    const parts = splitId(entry.id);
    if (parts.slug === slug) found[parts.locale] = entry;
  }
  return found;
}

export function availableLocales(translations: Partial<Record<Locale, unknown>>): Locale[] {
  return locales.filter((locale) => translations[locale] !== undefined);
}

export function sortByDateDesc<T>(entries: T[], getDate: (entry: T) => Date): T[] {
  return [...entries].sort((a, b) => getDate(b).getTime() - getDate(a).getTime());
}

export function isPublished(entry: { data: { draft?: boolean } }, isProd: boolean): boolean {
  return !(isProd && entry.data.draft === true);
}

function guideParts(id: string): { category: string; slug: string } {
  const { slug } = splitId(id);
  const separator = slug.indexOf('/');
  if (separator === -1) {
    throw new Error(
      `Guide "${id}" must be inside a category directory (guides/<locale>/<category>/)`,
    );
  }
  return { category: slug.slice(0, separator), slug: slug.slice(separator + 1) };
}

export function guideCategoryOf(id: string): string {
  return guideParts(id).category;
}

export function guideSlugOf(id: string): string {
  return guideParts(id).slug;
}

interface GuideLike {
  id: string;
  data: { title: string; order: number };
}

function byOrderThenTitle(a: GuideLike, b: GuideLike): number {
  return a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);
}

export function groupGuidesByCategory<T extends GuideLike>(entries: T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const entry of entries) {
    const category = guideCategoryOf(entry.id);
    const list = grouped.get(category);
    if (list) list.push(entry);
    else grouped.set(category, [entry]);
  }
  for (const list of grouped.values()) list.sort(byOrderThenTitle);
  return grouped;
}
