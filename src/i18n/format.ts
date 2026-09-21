import type { Locale } from './config';

const intlLocale: Record<Locale, string> = { ja: 'ja-JP', en: 'en-US' };

/** frontmatter の日付は UTC 深夜として解釈されるので、日本時間で表記して日付がずれないようにする */
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    dateStyle: 'long',
    timeZone: 'Asia/Tokyo',
  }).format(date);
}
