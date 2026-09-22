# 開発環境とリポジトリ構成

## 技術スタック

- Astro 7 / TypeScript 6（7 は `@astrojs/check` が対応するまで使わない）
- pnpm 10（`package.json` の `packageManager` で固定）、Node 24（`.node-version`）
- Tailwind CSS 4（`@tailwindcss/vite`、`@tailwindcss/typography`）
- Biome 2（lint / format）、knip（未使用のファイル・export・依存の検出）、Vitest 5（`astro/config` の `getViteConfig` 経由）
- `@astrojs/sitemap`、`@fontsource-variable`（Bricolage Grotesque / Inter。和文はシステムフォント）
- Renovate（`renovate.json`。方針は [operations.md](./operations.md)）

## コマンド

| コマンド                        | 内容                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`                      | 開発サーバー                                                                                                                   |
| `pnpm build` / `pnpm preview`   | 本番ビルド / ビルド結果の確認                                                                                                  |
| `pnpm build:maintenance`        | メンテナンス中画面だけをビルドする（`astro.maintenance.config.ts`。`pnpm preview` で確認できる）                               |
| `pnpm check`                    | `astro check`（型と `.astro` の検査）                                                                                          |
| `pnpm lint` / `pnpm lint:fix`   | Biome                                                                                                                          |
| `pnpm knip`                     | knip。未使用のファイル・export・依存があれば非ゼロで終わる（設定は `knip.json`）                                              |
| `pnpm test` / `pnpm test:watch` | Vitest                                                                                                                         |
| `pnpm verify`                   | CI と同じ順序で `biome ci` → `knip` → `astro check` → `vitest run` → `astro build` → `astro build --config astro.maintenance.config.ts` |

変更を終えたら `pnpm verify` を通してからコミットする。

## ディレクトリ

```
src/
  content.config.ts   コレクション定義（Zod スキーマ）
  content/            Markdown / YAML のコンテンツ（docs/content.md を参照）
  i18n/               ロケール定数、UI 文言、URL ヘルパー、日付表記（Astro 非依存）
  lib/content.ts      エントリ ID の分解、翻訳ペア検索、並べ替え（Astro 非依存）
  lib/validate.ts     ビルドを失敗させる整合性チェック（Astro 非依存）
  lib/collections.ts  getCollection を呼ぶ唯一の層（ページは本文描画用の render だけを astro:content から import する）
  layouts/            BaseLayout
  components/         Header, Footer, LanguageSwitcher, PageHeader, EntryList, ResultsTable, Hero, FeatureGrid, CtaBox
  assets/hero.svg     ヒーローの線画
  pages/[...lang]/    全ページ（lang: undefined = ja、'en' = en）
  pages/404.astro
  styles/global.css   デザイントークン（docs/design.md を参照）
src-maintenance/      メンテナンス中画面（astro.maintenance.config.ts の srcDir。global.css と ui.ts は src/ から相対パスで読む）
tests/                Vitest（tests/docs/ はドキュメントの行数とリンクを検査する）
docs/                 L2 / L3 のドキュメント（階層の規則は AGENTS.md）
astro.maintenance.config.ts  メンテナンス中画面のビルド設定（deploy.yml の MAINTENANCE_WINDOW が true のとき使う）
```

## テスト

- `src/i18n` と `src/lib/content.ts`、`src/lib/validate.ts` は純粋関数なので、Vitest で直接検証する。
- `.astro` コンポーネントは Astro Container API（`astro/container`）で描画して検証する（`tests/components/`）。
- コンテンツの整合性（未登録カテゴリ、欠けたロケール、スキーマ違反）はビルドで検出する。テストで二重に検証しない。
- ドキュメントの階層（`AGENTS.md` の行数、`docs/*.md` の行数、相対リンクの実在）は `tests/docs/limits.test.ts` で検証する。

## Biome の検査範囲

Biome は `.ts` / `.json` / `.css` と、`.astro` のフロントマター（スクリプト部分）を検査する。`.astro` のテンプレート部分と `.md` / `.yaml` は対象外。
