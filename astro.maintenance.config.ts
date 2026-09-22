import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// メンテナンス中画面だけをビルドする設定。deploy.yml の MAINTENANCE_WINDOW が true のときに使う。
// srcDir を分けることで、本サイトのページ・コンテンツ・サイトマップを一切含めない。
export default defineConfig({
  site: 'https://kingofground.com',
  trailingSlash: 'always',
  srcDir: './src-maintenance',
  vite: { plugins: [tailwindcss()] },
});
