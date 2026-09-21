import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kingofground.com',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  // 404 は sitemap 統合が自動で除外する
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
