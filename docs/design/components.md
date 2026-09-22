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
- 小（`.btn.btn-sm`）: Padding 8px 16px（ヘッダーの 101 ボタン）

### Navigation links（`.nav-link`）

- Text: `#475569`、Padding: 8px 12px、最小高さ 44px
- Hover: Text `#000000`

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

- `aspect-video`、`rounded-md`、`border border-soft`、`bg-off-white`、中央に `text-medium` の "KOG"
- 装飾なので `aria-hidden="true"`。コンテンツに画像フィールドを足したら `<Image>` に置き換える

### Home sections

| コンポーネント | 構成                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hero`         | 2 列（`lg`）。左: `text-h1` wordmark、リード（`text-lg text-body`）、`.btn` ＋ `.btn-outline`。右: `src/assets/hero.svg` の線画（`md` 未満は非表示）    |
| `FeatureGrid`  | `text-h2` ＋ リード、3 列（`md`）のリスト。各項目は黒丸（`size-8 rounded-full bg-black`）に白い 16px アイコン ＋ `text-h4` 見出し ＋ `text-medium` 本文 |
| `CtaBox`       | `max-w-5xl`、`rounded-lg bg-black`、中央揃え。`text-h2 text-white`（見出しは `font-normal`） ＋ `text-soft` 本文 ＋ `.btn.btn-invert`                   |

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
- セクション間: 80px（`mt-20`）
- 本文（`.prose.prose-lg`）: `max-w-3xl mx-auto mt-14`。リザルトは順位表と本文を同じ `max-w-3xl` に入れ、本文は順位表の下に `mt-10`
- フッター: 上 80px、下 40px

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

- `lg` 以上: wordmark / ナビ / 言語スイッチャー＋101 ボタンの 1 行
- `lg` 未満: wordmark とハンバーガー（44px）。ナビと右側の要素は `#site-nav` にまとめて開閉する。JS 無効時は常時表示

### タッチターゲット

- 最小サイズ: 44px × 44px（`.btn`, `.nav-link`, ハンバーガー、一覧のリンク、「すべて見る」、キッカー）

### フォントサイズとレイアウトの調整

- 見出しは design.md のサイズ表のとおり 3 段階。本文は 16px を維持
- ヒーローの線画は `md` 未満で非表示。ヒーローのボタンは `md` 未満で縦積み
- `EntryList` は `md` 以上で 2 列、`FeatureGrid` は `md` 以上で 3 列

---

## Agent Prompt Guide

### クイックリファレンス

```
Background: #ffffff（大きな黒面は CTA ボックスだけ。ボタンとアイコンの黒丸は #000000）
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
- コンテナは .container-site、セクション間は mt-20
- ボタンは .btn（輪郭線は .btn-outline、黒面では .btn-invert）
- 影は使わない。角丸は rounded-sm / rounded-md / rounded-lg / rounded-full だけ
```
