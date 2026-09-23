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

export interface ResultParts {
  year: number;
  round: number;
}

/** リザルトの ID は `<locale>/<西暦>/round<n>`。そのまま `/results/<西暦>/round<n>/` の URL になる */
export function resultParts(id: string): ResultParts {
  const { slug } = splitId(id);
  const match = /^(\d{4})\/round([1-9]\d*)$/.exec(slug);
  if (!match) {
    throw new Error(
      `Result "${id}" must be results/<locale>/<year>/round<n>.md (for example ja/2025/round1)`,
    );
  }
  return { year: Number(match[1]), round: Number(match[2]) };
}

/** 年間ランキングの ID は `<locale>/<西暦>`。そのまま `/results/<西暦>/standings/` の URL になる */
export function standingsYear(id: string): number {
  const { slug } = splitId(id);
  const match = /^(\d{4})$/.exec(slug);
  if (!match) {
    throw new Error(`Standings "${id}" must be standings/<locale>/<year>.md (for example ja/2001)`);
  }
  return Number(match[1]);
}

/** 年の降順にまとめ、年内はラウンド番号の昇順に並べる */
export function groupResultsByYear<T extends Localized>(
  entries: T[],
): Array<{ year: number; results: T[] }> {
  const grouped = new Map<number, T[]>();
  for (const entry of entries) {
    const { year } = resultParts(entry.id);
    const list = grouped.get(year);
    if (list) list.push(entry);
    else grouped.set(year, [entry]);
  }
  return [...grouped]
    .sort(([a], [b]) => b - a)
    .map(([year, results]) => ({
      year,
      results: results.sort((a, b) => resultParts(a.id).round - resultParts(b.id).round),
    }));
}
