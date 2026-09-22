# AGENTS.md

kingofground.com（KING OF GROUND — BMX フラットランドのコンテストシリーズ）のサイト。Astro 7 の静的サイトで、GitHub Actions から GitHub Pages に配信する。この文書は、このリポジトリで作業する AI エージェントと開発者の入口であり、規則と索引だけを置く。

## ドキュメントの階層

| 層  | 場所               | 上限   | 役割                 |
| --- | ------------------ | ------ | -------------------- |
| L1  | `AGENTS.md`        | 50 行  | 入口。規則と索引だけ |
| L2  | `docs/*.md`        | 300 行 | 主題ごとの指針       |
| L3  | `docs/<主題>/*.md` | なし   | L2 に収まらない詳細  |

- 行数の上限と相対リンクの実在は `tests/docs/limits.test.ts` が検査し、違反すると CI が落ちる。
- 新しい規則は該当する L2 に書く。L2 が 300 行を超えそうなら細部を L3 に移し、L2 からリンクする。L1 には索引だけを足す。

## 索引

| 知りたいこと                                    | 文書                                         |
| ----------------------------------------------- | -------------------------------------------- |
| スタック、コマンド、ディレクトリ、テスト、Biome | [docs/development.md](./docs/development.md) |
| ロケール、UI 文言、URL、翻訳ペア                | [docs/i18n.md](./docs/i18n.md)               |
| ブログ・リザルト・101・単発ページの追加         | [docs/content.md](./docs/content.md)         |
| 色、タイポグラフィ、Do / Don't（寸法は L3）     | [docs/design.md](./docs/design.md)           |
| デプロイ、外部設定、Renovate                    | [docs/operations.md](./docs/operations.md)   |

## 作業の手順

変更を終えたら `pnpm verify`（`biome ci` → `astro check` → `vitest run` → 本サイトとメンテナンス中画面の `astro build`）を通してからコミットする。

## Git の規約

- コミットメッセージは 1 行に収める。本文もトレーラーも付けない。
- `Co-Authored-By` や「Generated with …」のような AI の帰属を、コミットメッセージにも PR 本文にも書かない。

## 必ず守る約束

- UI 文言は `src/i18n/ui.ts` にだけ書く。en に無いキーは `astro check` で落ちる。
- URL は `localePath()` で作る。`/en/` を文字列連結しない。
- 色・サイズ・角丸は `global.css` のトークンと utility だけを使う。任意値（`text-[13px]`）と影は使わない。
- 101 の記事はカテゴリディレクトリの下に置き、カテゴリ YAML を用意する。`pages/` は ja / en 両方必須。どちらもビルドで検査される。
- 日本語ページでも欧文だけの見出しには `lang="en"` を付ける。
