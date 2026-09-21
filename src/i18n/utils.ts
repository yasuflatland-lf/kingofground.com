import { defaultLocale, type Locale, locales } from './config';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * `[...lang]` パラメータからロケールを決める。
 * デフォルトロケールは URL にプレフィックスを持たないので、`undefined` だけを受け付ける。
 */
export function localeFromParam(lang: string | undefined): Locale {
  if (lang === undefined) return defaultLocale;
  if (lang !== defaultLocale && isLocale(lang)) return lang;
  throw new Error(`Unknown locale segment: "${lang}"`);
}

/** サイト内パス（`/` 始まり）をロケール付きの URL パスにする。末尾は必ず `/` */
export function localePath(locale: Locale, path = '/'): string {
  if (!path.startsWith('/')) throw new Error(`path must start with "/": "${path}"`);
  const normalized = path.endsWith('/') ? path : `${path}/`;
  return locale === defaultLocale ? normalized : `/${locale}${normalized}`;
}

/** 同じサイト内パスを、与えたロケールそれぞれの URL パスにする */
export function localePaths(
  available: readonly Locale[],
  path: string,
): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const locale of available) out[locale] = localePath(locale, path);
  return out;
}

/** `[...lang]` ルートの getStaticPaths が共通で返す、ロケールごとの基本パス */
export function localeStaticPaths(): Array<{
  params: { lang: string | undefined };
  props: { locale: Locale };
}> {
  return locales.map((locale) => ({
    params: { lang: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }));
}

export function otherLocales(locale: Locale): Locale[] {
  return locales.filter((l) => l !== locale);
}
