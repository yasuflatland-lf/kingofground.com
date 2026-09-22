# コンテンツの追加

スキーマは `src/content.config.ts`、ビルド時の整合性チェックは `src/lib/validate.ts` と `src/lib/collections.ts` にある。翻訳ペアの決まり方は [i18n.md](./i18n.md)。

## 置き場所と frontmatter

| 種類           | 置き場所                                          | 必須 frontmatter                                | 任意                    |
| -------------- | ------------------------------------------------- | ----------------------------------------------- | ----------------------- |
| ブログ         | `src/content/blogs/{ja,en}/<slug>.md`             | `title`, `description`, `pubDate`               | `updatedDate`, `draft`  |
| リザルト       | `src/content/results/{ja,en}/<西暦>/round<n>.md`  | `title`, `date`, `classes[]`                    | `venue`                 |
| 101 の記事     | `src/content/guides/{ja,en}/<category>/<slug>.md` | `title`, `description`                          | `order`（既定 0、昇順） |
| 101 のカテゴリ | `src/content/guide-categories/<category>.yaml`    | `order`, `title.{ja,en}`, `description.{ja,en}` | —                       |
| 単発ページ     | `src/content/pages/{ja,en}/<slug>.md`             | `title`, `description`                          | —                       |

- 翻訳ペアは「同じ相対パス」で決まる。frontmatter で紐付けない。
- Markdown 本文の見出しは `##`（20px）と `###`（16px）まで。`####` は `###` と同じ大きさになる。
- エントリ ID は拡張子を除いた相対パス（`ja/hello-kog`、`ja/2025/round1`、`ja/basics/what-is-flatland`）。slug 化で文字は変わらない。

## 種類ごとの決まり

### ブログ

- `draft: true` のブログは本番ビルド（`import.meta.env.PROD`）で除外される。開発サーバーでは表示される。
- 一覧は `pubDate` の降順。

### リザルト

- ファイルは `<西暦>/round<n>.md` に置く（`2025/round1.md`）。URL はそのまま `/results/<西暦>/round<n>/` になる。年ディレクトリの外に置いたり、`round<n>` 以外の名前（`final`、`round01`）にするとビルドが失敗する。
- `classes` はクラスごとの順位表。クラスが無い大会は要素 1 つにする。`placements` は 1 件以上、`rank` は正の整数。
- `/results/` は年の一覧（降順）、`/results/<西暦>/` はその年のラウンド一覧（ラウンド番号の昇順）。ホームの最新リザルトだけ `date` の降順。
- 英語版が無いラウンドは英語の一覧に出ない。その年に英語版が 1 件も無ければ、英語の年ページも作らない。

```yaml
classes:
  - name: "MASTER"
    placements:
      - { rank: 1, rider: "名前" }
```

### 101（ガイド）

- 記事はカテゴリディレクトリの下に置く。直下に置くとビルドが失敗する。
- カテゴリの YAML を `guide-categories/` に用意する。無いカテゴリを参照する記事があるとビルドが失敗する。
- カテゴリの並びは YAML の `order` 昇順（同順位は ID 順）、記事の並びは `order` 昇順（同順位はタイトル順）。あるロケールに記事が 1 件も無いカテゴリは、そのロケールの一覧に出ない。

### 単発ページ

- `pages/` の各スラッグは ja / en 両方必須で、片方が無いとビルドが失敗する。現在あるのは `history` だけで、ナビからリンクされる。
