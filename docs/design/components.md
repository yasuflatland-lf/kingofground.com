# コンポーネントとレイアウトの寸法

[design.md](../design.md) の原則を、コンポーネント・レイアウト・レスポンシブの具体値に落としたもの。色とタイポグラフィのトークンは design.md を参照し、ここでは寸法と構成だけを書く。値はすべて `src/styles/global.css` か各コンポーネントの class にある。

---

## Component Stylings

### Buttons（`.btn`）

- Background: `#000000`、Text: `#ffffff`、Border: 2px 透明
- Padding: 10px 20px、最小高さ 44px
- Border Radius: 4px（`--radius-sm`）
- Font: 16px / 1.5、字間 0.04em（継承）、大文字変換なし
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

- 12px / 700、uppercase、Text `#2563eb`。字間は `html` の 0.64px を継承する（12px では 0.053em）
- ページタイトルの上に置く親セクションへのリンク（101 のカテゴリ名、リザルトの年など）。欧文だけのラベル（`KING OF GROUND 2025`）には `lang="en"` を渡す

### Tables（順位表、Markdown の表）

- 罫線: `#e2e8f0`
- 偶数行: `#f8fafc`
- 見出し行: 12px（`text-xs`）、`#64748b`
- 順位セル: 700、`#000000`

### Placeholder（一覧の画像面）

- `aspect-video`、`rounded-md`、`border border-soft`、中央に `text-h2 font-bold text-medium` の "KOG"。塗りも影も無く罫線だけなので、どの帯の上でも同じに見える
- 装飾なので `aria-hidden="true"`。コンテンツに画像フィールドを足したら `<Image>` に置き換え、そのとき `shadow-1` を付ける

### Home sections（帯）

各セクションは、背景色と上下余白を持つ外側の `<section>` と、内側の `.container-site` の 2 層。帯は `container-site` の外まで左右いっぱいに広がる。Hero だけは余白を内側のグリッドに置く。

| 帯                      | 背景                  | 余白                            | 構成                                                                                                                                                  |
| ----------------------- | --------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hero`                  | `white`               | `pt-16 pb-16 md:pt-10 md:pb-16` | 2 列（`lg`）。左: `text-h1` wordmark、リード（`text-body`）、`.btn` ＋ `.btn-outline`。右: `src/assets/hero.svg` の線画（`md` 未満は非表示）  |
| `FeatureGrid`           | `off-white`           | `py-10 md:py-16`                | `text-h2` ＋ リード、3 列（`md`、列間 `gap-x-10`）のリスト。各項目は黒丸（`size-8 rounded-full bg-black`）に白い 16px アイコン ＋ `text-h3` 見出し ＋ `text-body` 本文 |
| 最新のブログ / リザルト | `white` / `off-white` | `py-10 md:py-16`                | `text-h2` ＋「すべて見る」＋ `EntryList`                                                                                                              |
| `CtaBox`                | `highlight`           | `py-16`                         | `max-w-5xl`、中央揃え。`text-h2` ＋ `text-ink` 本文 ＋ `.btn`                                                                                       |
| `Footer`（全ページ）    | `black`               | `py-10`                         | `text-xs text-soft`、中央揃え                                                                                                                         |

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

### Container（`.container-site`）

- Max Width: 1200px
- Padding (horizontal): 20px

### Grid

- Columns: 12
- Gutter: 20px（`gap-x-5`）。ただしパディングの無い文字列の列を並べるときは XL 40px（`gap-x-10`）にする。20px は 24px のパディングを持つカード同士の間隔で、文字列同士に直接使うと隣の列に寄る

### Sections

- ページタイトル（`PageHeader`）: 上 64px、中央揃え
- ホームの帯: 上下 40px / 64px（`py-10 md:py-16`）。CTA は 64px（`py-16`）。隣り合う帯の内容間は 128px（`md`）
- 本文（`.prose`）: `max-w-2xl mx-auto mt-16`（行長 en 約 80 字 / ja 約 40 字）。リザルトは順位表と本文を同じ `max-w-2xl` に入れ、本文は順位表の下に `mt-10`。Markdown の見出しは h2 / h3 まで（h3 と h4 は同じ 16px）
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
- `lg` 未満: wordmark とハンバーガー（44px）。ナビと言語の切り替えは `#site-nav` にまとめて開閉する。開いている間は `html` に `overflow-hidden`、Escape で閉じる。ヘッダーは `max-h-dvh overflow-y-auto`。JS 無効時は常時表示で、`soft` の下罫線が付き、`lg` 未満では sticky にしない
- Escape で閉じたときはハンバーガーにフォーカスを戻す。開いたまま `lg` 以上に広がったら閉じてスクロールを解放する
- スキップリンク（`nav.skip`）が `body` の先頭にあり、フォーカスすると `.btn` として現れて `#main` へ飛ぶ

### タッチターゲット

- 最小サイズ: 44px × 44px（`.btn`, `.nav-link`, `.lang-switch-item`, ハンバーガー、一覧のリンク、「すべて見る」、キッカー）

### フォントサイズとレイアウトの調整

- Display（`text-h1`）だけ `md` 未満で 40px → 28px（70%）。`text-h2` / `text-h3` / 本文 16px / Caption 12px と行間 1.5 はどの幅でも同じ
- ヒーローの線画は `md` 未満で非表示。ヒーローのボタンは `md` 未満で縦積み
- `EntryList` は `md` 以上で 2 列、`FeatureGrid` は `md` 以上で 3 列

---

## Agent Prompt Guide

### クイックリファレンス

```
Background: #ffffff（ホームは white / off-white / highlight #f5a623 の帯。黒面はスクロール中のヘッダーとフッター）
Heading: #000000 / Body: #475569 / Meta: #64748b
Font: "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, system-ui, sans-serif
Body: 16px / 1.5 / 0.04em（ja / en 共通）
Headings: text-h1 40px（mobile 28px）/ text-h2 20px / text-h3 16px、すべて 700 / 1.5 / 0.04em
Caption: 12px（text-xs）
Container: 1200px, padding 20px。Grid 12 col, gutter 20px（文字列の列間は 40px）
Shadow: shadow-1 0 2px 8px 8% / shadow-2 0 4px 16px 12% / shadow-3 0 8px 32px 16%
Button: black, white text, radius 4px, 10px 20px, no uppercase
```

### プロンプト例

```
KING OF GROUND のデザインシステム（docs/design.md）に従って、大会一覧ページを作成してください。
- 色は global.css のトークンだけ（white / black / ink / body / medium / soft / off-white / accent / highlight）
- 見出しは h1〜h6 要素 + text-h1（ページタイトルだけ）/ text-h2 / text-h3。欧文だけの見出しには lang="en"
- 本文は 16px、日付などの補足は text-xs text-medium。text-lg は使わない
- ページタイトルは PageHeader、一覧は EntryList を使う
- 帯は外側の section に bg-* と py-10 md:py-16、内側に .container-site
- ボタンは .btn（輪郭線は .btn-outline、黒面では .btn-invert）
- 影は shadow-1（サムネイル）/ shadow-2（開いたモバイルナビ）/ shadow-3（モーダル）だけ。角丸は rounded-sm / rounded-md / rounded-lg / rounded-full だけ
```
