import type { Locale } from './config';

const ja = {
  'site.title': 'KING OF GROUND',
  'site.tagline': 'BMX フラットランド コンテストシリーズ',
  'nav.home': 'ホーム',
  'nav.history': '歴史',
  'nav.blogs': 'ブログ',
  'nav.results': 'リザルト',
  'nav.guides': '101',
  'home.latestBlogs': '最新のブログ',
  'home.latestResults': '最新のリザルト',
  'home.viewAll': 'すべて見る',
  'home.guidesLead': 'フラットランドをはじめる（101）',
  'home.historyLead': 'KING OF GROUND の歩み',
  'blogs.title': 'ブログ',
  'blogs.description': 'KING OF GROUND からのお知らせと記事',
  'results.title': 'リザルト',
  'results.description': '各大会の結果',
  'results.venue': '会場',
  'results.rank': '順位',
  'results.rider': 'ライダー',
  'guides.title': '101',
  'guides.description': 'フラットランド入門ガイド',
  'guides.breadcrumb': '101',
  'lang.name': '日本語',
  'footer.copyright': '© KING OF GROUND',
  'notFound.title': 'ページが見つかりません',
  'notFound.body': 'お探しのページは移動または削除された可能性があります。',
  'notFound.home': 'ホームへ戻る',
  'meta.updated': '更新',
} as const;

export type UiKey = keyof typeof ja;

const en: Record<UiKey, string> = {
  'site.title': 'KING OF GROUND',
  'site.tagline': 'BMX Flatland Contest Series',
  'nav.home': 'Home',
  'nav.history': 'History',
  'nav.blogs': 'Blog',
  'nav.results': 'Results',
  'nav.guides': '101',
  'home.latestBlogs': 'Latest posts',
  'home.latestResults': 'Latest results',
  'home.viewAll': 'View all',
  'home.guidesLead': 'Start flatland (101)',
  'home.historyLead': 'The story of KING OF GROUND',
  'blogs.title': 'Blog',
  'blogs.description': 'News and articles from KING OF GROUND',
  'results.title': 'Results',
  'results.description': 'Results of each contest',
  'results.venue': 'Venue',
  'results.rank': 'Rank',
  'results.rider': 'Rider',
  'guides.title': '101',
  'guides.description': 'A beginner’s guide to flatland',
  'guides.breadcrumb': '101',
  'lang.name': 'English',
  'footer.copyright': '© KING OF GROUND',
  'notFound.title': 'Page not found',
  'notFound.body': 'The page you are looking for may have been moved or removed.',
  'notFound.home': 'Back to home',
  'meta.updated': 'Updated',
};

export const ui: Record<Locale, Record<UiKey, string>> = { ja, en };

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key];
}
