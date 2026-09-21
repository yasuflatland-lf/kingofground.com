# AGENTS.md

kingofground.com（KING OF GROUND — BMX フラットランドのコンテストシリーズ）のサイト。Astro 7 の静的サイトで、GitHub Pages に GitHub Actions でデプロイする。この文書は、このリポジトリで作業する AI エージェントと開発者向けの作業指針である。

## 技術スタック

- Astro 7 / TypeScript 6（7 は `@astrojs/check` が対応するまで使わない）
- pnpm 10（`package.json` の `packageManager` で固定）、Node 24（`.node-version`）
- Tailwind CSS 4（`@tailwindcss/vite`、`@tailwindcss/typography`）
- Biome 2（lint / format）、Vitest 5（`astro/config` の `getViteConfig` 経由）
- `@astrojs/sitemap`、`@fontsource`（Anton / Inter Tight / Space Grotesk）
- Renovate（`renovate.json`）

## コマンド

| コマンド                        | 内容                                                                      |
| ------------------------------- | ------------------------------------------------------------------------- |
| `pnpm dev`                      | 開発サーバー                                                              |
| `pnpm build` / `pnpm preview`   | 本番ビルド / ビルド結果の確認                                             |
| `pnpm check`                    | `astro check`（型と `.astro` の検査）                                     |
| `pnpm lint` / `pnpm lint:fix`   | Biome                                                                     |
| `pnpm test` / `pnpm test:watch` | Vitest                                                                    |
| `pnpm verify`                   | CI と同じ順序で `biome ci` → `astro check` → `vitest run` → `astro build` |

変更を終えたら `pnpm verify` を通してからコミットする。

## ディレクトリ

```
src/
  content.config.ts   コレクション定義（Zod スキーマ）
  content/            Markdown / YAML のコンテンツ
  i18n/               ロケール定数、UI 文言、URL ヘルパー、日付表記（Astro 非依存）
  lib/content.ts      エントリ ID の分解、翻訳ペア検索、並べ替え（Astro 非依存）
  lib/validate.ts     ビルドを失敗させる整合性チェック（Astro 非依存）
  lib/collections.ts  getCollection を呼ぶ唯一の層（ページは本文描画用の render だけを astro:content から import する）
  layouts/            BaseLayout
  assets/             ヒーローの線画（hero.svg）
  components/         Header, Footer, LanguageSwitcher, EntryList, PageHeader, ResultsTable, Hero, FeatureGrid, CtaBox
  pages/[...lang]/    全ページ（lang: undefined = ja、'en' = en）
  pages/404.astro
  styles/global.css   デザイントークン（DESIGN.md を参照）
tests/                Vitest
```

## i18n の約束事

- ロケールは `ja`（デフォルト、URL プレフィックスなし）と `en`（`/en/`）。
- UI 文言は `src/i18n/ui.ts` にだけ書く。`.astro` に日本語・英語を直書きしない。キーは ja 辞書から型を取るので、en に追加し忘れると `astro check` で落ちる。
- URL は `localePath(locale, '/blogs/')` で作る。文字列連結で `/en/` を付けない。
- 各ページは `BaseLayout` に `translations`（存在する翻訳の URL パス。自分自身を含む）を渡す。hreflang と言語スイッチャーはこれから作られる。翻訳が無いロケールへは `fallbackPath`（セクションのトップ）に飛ばす。
- 英語版が無いコンテンツの英語ページは生成しない。英語の一覧には英語版のあるエントリだけ並ぶ。

## コンテンツの追加

| 種類           | 置き場所                                          | 必須 frontmatter                                                  |
| -------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| ブログ         | `src/content/blogs/{ja,en}/<slug>.md`             | `title`, `description`, `pubDate`（任意: `updatedDate`, `draft`） |
| リザルト       | `src/content/results/{ja,en}/<slug>.md`           | `title`, `date`, `classes[]`（任意: `venue`）                     |
| 101 の記事     | `src/content/guides/{ja,en}/<category>/<slug>.md` | `title`, `description`（任意: `order`）                           |
| 101 のカテゴリ | `src/content/guide-categories/<category>.yaml`    | `order`, `title.{ja,en}`, `description.{ja,en}`                   |
| 単発ページ     | `src/content/pages/{ja,en}/<slug>.md`             | `title`, `description`                                            |

- 翻訳ペアは「同じ相対パス」で決まる。frontmatter で紐付けない。
- `draft: true` のブログは本番ビルドで除外される。
- 101 の記事はカテゴリディレクトリの下に置き、そのカテゴリの YAML を `guide-categories/` に用意する。無いとビルドが失敗する。
- `pages/history` は ja / en 両方必須（ナビからリンクされるため）。片方が無いとビルドが失敗する。
- リザルトの `classes` はクラスごとの順位表。クラスが無い大会は要素 1 つにする。

```yaml
classes:
  - name: "MASTER"
    placements:
      - { rank: 1, rider: "名前" }
```

## スタイル

- `DESIGN.md` のトークンと utility だけを使う。任意値（`text-[13px]`）や `global.css` に無い色を書かない。
- 見出しは `h1`〜`h6` 要素と `text-h*` で指定する。ウェイトは要素で、行間・字間は `text-h*` が言語ごとに決める。
- 日本語ページでも欧文だけの見出し（wordmark、大会名）には `lang="en"` を付ける。
- 白面が基本。黒面はホームの CTA ボックスとボタンだけ。影は使わない。角丸は `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-full` だけ。
- ページタイトルは `PageHeader`、一覧は `EntryList` に任せる。

## テスト

- `src/i18n` と `src/lib/content.ts`、`src/lib/validate.ts` は純粋関数なので、Vitest で直接検証する。
- `.astro` コンポーネントは Astro Container API（`astro/container`）で描画して検証する（`tests/components/`）。
- コンテンツの整合性（未登録カテゴリ、欠けたロケール、スキーマ違反）はビルドで検出する。テストで二重に検証しない。

## Biome の検査範囲

Biome は `.ts` / `.json` と `.astro` のフロントマター（スクリプト部分）を検査する。`.astro` のテンプレート部分と `.md` / `.yaml` は対象外。

## デプロイと外部設定（手動作業）

`main` への push で `deploy.yml` が動き、`dist/` を GitHub Pages に配信する。初回だけ次の設定が必要。

1. Settings → Pages → Source を **GitHub Actions** にし、Custom domain に `kingofground.com` を入れる（`public/CNAME` にも同じ値がある）
2. DNS: `A @` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`。`CNAME www` → `yasuflatland-lf.github.io`
3. DNS が伝播したら Enforce HTTPS を ON にする
4. Mend Renovate の GitHub App をこのリポジトリにインストールする
5. Settings → General で **Allow auto-merge** を ON にし、`main` のルールセットで `ci` チェックを必須にする（Renovate の automerge はこれが無いと動かない）

## Renovate の方針

- リリースから 3 日経っていない版は候補にしない（`minimumReleaseAge`）
- minor / patch は automerge。major は手動。ただし GitHub Actions は major も automerge
- TypeScript 7 の major PR は、`@astrojs/check` が対応してからマージする
