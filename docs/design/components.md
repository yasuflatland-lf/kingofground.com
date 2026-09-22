# コンポーネントとレイアウトの寸法

[design.md](../design.md) の原則を、コンポーネント・レイアウト・レスポンシブの具体値に落としたもの。色とタイポグラフィのトークンは design.md を参照し、ここでは寸法と構成だけを書く。値はすべて `src/styles/global.css` か各コンポーネントの class にある。

---

## Component Stylings

### Buttons（`.btn`）

- Background: `#000000`、Text: `#ffffff`、Border: 2px 透明
- Padding: 10px 20px、最小高さ 44px
- Border Radius: 4px（`--radius-sm`）
- Font: 16px / 1.5、大文字変換なし
- Hover: background `#262626`。Focus-visible: 2px の黒い outline（offset 2px）
- 輪郭線（`.btn.btn-outline`）: background `#ffffff`、Text `#000000`、Border `#000000`、hover `#f8fafc`
- 反転面（`.btn.btn-invert`）: background `#ffffff`、Text `#000000`、hover `#e2e8f0`

### Navigation links（`.nav-link`）

- Text: `#475569`、Padding: 8px 12px、最小高さ 44px
- Hover: Text `#000000`
- 現在ページ（`aria-current="page"`）: Text `#000000` + 下線（offset 4px）
- スクロール中（`.site-header[data-stuck]`）: Text `#e2e8f0`、hover と現在ページは `#ffffff` + 下線

### Language switcher（`.lang-switch`）

- `locales` の順に JA / EN の 2 セグメントを並べる。Border: 2px `#000000`、Border Radius: 4px（`--radius-sm`）
- セグメント（`.lang-switch-item`）: Padding 8px 12px、最小幅 44px、枠線込みの高さ 44px、Font 16px / 1.5
- 現在のロケール: `<span aria-current="page">`、background `#000000`、Text `#ffffff`。リンクにしない
- もう一方: `<a hreflang lang data-locale>`、background `#ffffff`、Text `#000000`、hover `#f8fafc`。Focus-visible は内側 2px の黒い outline
- 読み上げ名は `lang.name`（日本語 / English）、グループは `lang.switcher`
- スクロール中（`.site-header[data-stuck]`）: 枠 `#ffffff`、現在地は `#ffffff` 地に `#000000`、もう一方は透明地に `#ffffff`、hover は下線。Focus-visible の outline は `#ffffff`

### Text links（`.text-link`）

- Text: `#64748b`。Hover: `#000000` + 下線（「すべて見る」）

### Kicker（`.kicker`）

- 14px / 600、uppercase、字間 0.05em、Text `#2563eb`
- ページタイトルの上に置く親セクションへのリンク（101 のカテゴリ名など）

### Tables（順位表、Markdown の表）

- 罫線: `#e2e8f0`
- 偶数行: `#f8fafc`
- 見出し行: 14px、`#64748b`
- 順位セル: 700、`#000000`

### Placeholder（一覧の画像面）

- `aspect-video`、`rounded-md`、`border border-soft`、中央に `text-medium` の "KOG"。塗りは無く罫線だけなので、どの帯の上でも同じに見える
- 装飾なので `aria-hidden="true"`。コンテンツに画像フィールドを足したら `<Image>` に置き換える

### Home sections（帯）

各セクションは、背景色と上下余白を持つ外側の `<section>` と、内側の `.container-site` の 2 層。帯は `container-site` の外まで左右いっぱいに広がる。

| 帯                      | 背景                  | 余白                            | 構成                                                                                                                                                  |
| ----------------------- | --------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hero`                  | `white`               | `pt-16 pb-16 md:pt-12 md:pb-24` | 2 列（`lg`）。左: `text-h1` wordmark、リード（`text-lg text-body`）、`.btn` ＋ `.btn-outline`。右: `src/assets/hero.svg` の線画（`md` 未満は非表示）  |
| `FeatureGrid`           | `off-white`           | `py-10 md:py-16`                | `text-h2` ＋ リード、3 列（`md`）のリスト。各項目は黒丸（`size-8 rounded-full bg-black`）に白い 16px アイコン ＋ `text-h4` 見出し ＋ `text-body` 本文 |
| 最新のブログ / リザルト | `white` / `off-white` | `py-10 md:py-16`                | `text-h2` ＋「すべて見る」＋ `EntryList`                                                                                                              |
| `CtaBox`                | `highlight`           | `py-16`                         | `max-w-5xl`、中央揃え。`text-h2`（見出しは `font-normal`） ＋ `text-ink` 本文 ＋ `.btn`                                                               |
| `Footer`（全ページ）    | `black`               | `py-10`                         | `text-sm text-soft`、中央揃え                                                                                                                         |

Cards は使わない。一覧は `EntryList`（2 列）か `divide-soft` の罫線で区切る。

---

## Layout Principles

### Spacing Scale

Tailwind の既定スケールのうち、次を基本にする。

| Token   | Value | Tailwind |
| ------- | ----- | -------- |
| XS      | 4px   | `1`      |
| S       | 8px   | `2`      |
| M       | 16px  | `4`      |
| L       | 24px  | `6`      |
| XL      | 40px  | `10`     |
| XXL     | 64px  | `16`     |
| Section | 80px  | `20`     |

### Container（`.container-site`）

- Max Width: 1280px
- Padding (horizontal): 20px

### Sections

- ページタイトル（`PageHeader`）: 上 64px、中央揃え
- ホームの帯: 上下 40px / 64px（`py-10 md:py-16`）。CTA は 64px（`py-16`）。隣り合う帯の内容間は 128px（`md`）
- 本文（`.prose.prose-lg`）: `max-w-3xl mx-auto mt-14`。リザルトは順位表と本文を同じ `max-w-3xl` に入れ、本文は順位表の下に `mt-10`
- フッター: 黒帯、上下 40px（`py-10`）

### ホームの構成順

`Hero` → `FeatureGrid` → 最新のブログ → 最新のリザルト → `CtaBox`

---

## Responsive Behavior

### Breakpoints

| Name    | Width      | Tailwind |
| ------- | ---------- | -------- |
| Mobile  | ≤ 767px    | （既定） |
| Tablet  | 768–1024px | `md:`    |
| Desktop | ≥ 1025px   | `lg:`    |

### ヘッダー

- `sticky top-0`、高さ 68px（`py-3` + 44px）。`--header-height`（4.25rem）を `:target` の `scroll-margin-top` に使う（`scroll-padding-top` にするとヘッダー内のリンクにフォーカスしたときページが跳ぶ）
- 最上部は白面。上端の 40px センチネル（`[data-header-sentinel]`）が画面から出ると `data-stuck` が付き、黒面・白文字に即時に切り替わる（トランジション無し）。1px ではなく 40px なのは、慣性スクロールで 0〜2px を往復しても点滅させないため
- `lg` 以上: wordmark / ナビ / 言語の切り替え（`.lang-switch`）の 1 行
- `lg` 未満: wordmark とハンバーガー（44px）。ナビと言語の切り替えは `#site-nav` にまとめて開閉する。開いている間は `html` に `overflow-hidden`、Escape で閉じる。ヘッダーは `max-h-dvh overflow-y-auto`。JS 無効時は常時表示で、`soft` の下罫線が付く
- スキップリンク（`nav.skip`）が `body` の先頭にあり、フォーカスすると `.btn` として現れて `#main` へ飛ぶ

### タッチターゲット

- 最小サイズ: 44px × 44px（`.btn`, `.nav-link`, `.lang-switch-item`, ハンバーガー、一覧のリンク、「すべて見る」、キッカー）

### フォントサイズとレイアウトの調整

- 見出しは design.md のサイズ表のとおり 3 段階。本文は 16px を維持
- ヒーローの線画は `md` 未満で非表示。ヒーローのボタンは `md` 未満で縦積み
- `EntryList` は `md` 以上で 2 列、`FeatureGrid` は `md` 以上で 3 列

---

## Agent Prompt Guide

### クイックリファレンス

```
Background: #ffffff（ホームは white / off-white / highlight #f5a623 の帯。黒面はスクロール中のヘッダーとフッター）
Heading: #000000 / Body: #475569 / Meta: #64748b
Font: Bricolage Grotesque → Inter → Hiragino Kaku Gothic ProN → Meiryo
Body: 16px, en 1.5 / 0, ja 1.6 / 0.02em
Headings: text-h1 72px -0.05em … text-h2 48px -0.025em … text-h3 30px
Container: 1280px, padding 20px
Button: black, white text, radius 4px, 10px 20px, no uppercase
```

### プロンプト例

```
KING OF GROUND のデザインシステム（docs/design.md）に従って、大会一覧ページを作成してください。
- 色は global.css のトークンだけ（white / black / ink / body / medium / soft / off-white / accent）
- 見出しは h1〜h6 要素 + text-h* utility。欧文だけの見出しには lang="en"
- ページタイトルは PageHeader、一覧は EntryList を使う
- 帯は外側の section に bg-* と py-10 md:py-16、内側に .container-site
- ボタンは .btn（輪郭線は .btn-outline、黒面では .btn-invert）
- 影は使わない。角丸は rounded-sm / rounded-md / rounded-lg / rounded-full だけ
```
