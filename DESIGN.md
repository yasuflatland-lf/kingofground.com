# DESIGN.md — KING OF GROUND

> kingofground.com のデザイン仕様。レイアウト・配色・タイポグラフィは Astroship（https://astroship.web3templates.com/）を 1440px 幅で実測した値に合わせ、和文のフォールバックと行間だけをこのサイト向けに決めた。
> 値はすべて `src/styles/global.css` に定義してある。ここに無い値をマークアップに直書きしない。

---

## 1. Visual Theme & Atmosphere

- **デザイン方針**: 白地に黒の見出し、slate 系グレーの本文。要素は角丸 4〜8px の面と余白で区切り、影は使わない
- **面の配置**: 基本は白面。黒面はホームの CTA ボックスとボタンだけ。ヘッダー・フッターも白面
- **キーワード**: 明るい、読みやすい、スタートアップ的、日本語でも崩れない
- **特徴**: 欧文を先頭に置いたフォールバックチェーン。和文は `:lang(ja)` で行間 1.6・字間 0.02em に切り替える

---

## 2. Color Palette & Roles

アクセントは `accent` 1 色で、キッカー（`.kicker`）にだけ使う。

| 役割                                             | トークン    | 値        |
| ------------------------------------------------ | ----------- | --------- |
| 背景                                             | `white`     | `#ffffff` |
| 見出し、ボタン、CTA ボックス                     | `black`     | `#000000` |
| 黒ボタンのホバー                                 | `ink`       | `#262626` |
| 本文、リード文、ナビ                             | `body`      | `#475569` |
| メタ情報、フッター                               | `medium`    | `#64748b` |
| 罫線、黒面の補足文                               | `soft`      | `#e2e8f0` |
| プレースホルダー面、表の縞、輪郭線ボタンのホバー | `off-white` | `#f8fafc` |
| キッカー                                         | `accent`    | `#2563eb` |

Tailwind では `text-body`, `text-medium`, `bg-off-white`, `border-soft`, `divide-soft`, `text-accent` のように使う。Tailwind 既定のパレット（`gray-500` など）は無効にしてある。

---

## 3. Typography Rules

### 3.1 和文フォント

- **ゴシック体**: Hiragino Kaku Gothic ProN, Meiryo（システムフォント。Web フォント化しない）

### 3.2 欧文フォント

- **見出し・本文・UI**: Bricolage Grotesque（可変フォント、200–800）。フォールバックに Inter（可変フォント）
- **等幅**: SFMono-Regular, Consolas, Menlo

欧文 2 書体は `@fontsource-variable` でセルフホストし、外部にリクエストしない。書体は 1 系統だけなので `font-*` クラスで切り替えない。

### 3.3 font-family 指定

```css
--font-sans:
  "Bricolage Grotesque Variable", "Inter Variable", "Hiragino Kaku Gothic ProN",
  Meiryo, sans-serif;
--font-mono: SFMono-Regular, Consolas, Menlo, monospace;
```

**フォールバックの考え方**:

- 欧文フォントを先頭に置き、欧文グリフの品質を優先する
- Bricolage Grotesque / Inter には和文グリフが無いので、和文は Hiragino / Meiryo で描画される
- `font-synthesis-weight: none` により、欧文は可変フォントの実ウェイトだけで描画する

### 3.4 文字サイズ・ウェイト階層

ウェイトは要素で決まる（`h1`, `h2` = 700、`h3`〜`h6` = 600）。サイズ・行間・字間は `text-h*` utility で決まる。

| Utility   | Desktop / Tablet / Mobile | Weight | 用途                                                  |
| --------- | ------------------------- | ------ | ----------------------------------------------------- |
| `text-h1` | 72 / 56 / 40px            | 700    | ホームのヒーロー                                      |
| `text-h2` | 48 / 40 / 32px            | 700    | ページタイトル、セクション見出し、CTA                 |
| `text-h3` | 30 / 28 / 24px            | 600    | 一覧のエントリタイトル、101 のカテゴリ名、本文中の h2 |
| `text-h4` | 20 / 20 / 18px            | 600    | 特徴グリッドの見出し、本文中の h3                     |
| `text-h5` | 18px                      | 600    | 順位表のクラス名、本文中の h4                         |
| `text-h6` | 16px                      | 600    | 101 の記事タイトル（一覧内）                          |
| Body      | 16px                      | 400    | 本文                                                  |
| Lead      | 18px（`text-lg`）         | 400    | ページタイトル下のリード文（`text-body`）             |
| Meta      | 14px（`text-sm`）         | 400    | 日付、フッター、キッカー（600）                       |

### 3.5 行間・字間

|                      | en                                 | ja               |
| -------------------- | ---------------------------------- | ---------------- |
| 本文                 | 1.5 / 0                            | **1.6 / 0.02em** |
| `text-h1`            | 1.0 / -0.05em                      | 1.25 / 0.02em    |
| `text-h2`            | 1.0 / -0.025em                     | 1.25 / 0.02em    |
| `text-h3`            | 1.375 / -0.025em                   | 1.4 / 0.02em     |
| `text-h4`〜`text-h6` | 1.5 / 0                            | 1.5 / 0.02em     |
| 大文字変換           | しない（`.kicker` だけ uppercase） | しない           |

**欧文だけの見出しの例外**: 「KING OF GROUND」の wordmark や大会名のように、日本語ページでも欧文だけで書く見出しは、要素に `lang="en"` を付ける。これで `:lang(en)` の詰めた字間が適用される。

### 3.6 禁則処理・改行ルール

```css
/* ja */
word-break: normal;
overflow-wrap: anywhere;
line-break: strict;

/* en */
overflow-wrap: break-word;
```

`text-h1`〜`text-h3` の和文は `word-break: auto-phrase`（対応ブラウザのみ）で文節ごとに折る。未対応ブラウザは `normal`。

### 3.7 OpenType 機能

```css
font-feature-settings: normal; /* palt 未適用。字間は letter-spacing で調整する */
```

### 3.8 縦書き

該当なし

---

## 4. Component Stylings

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

## 5. Layout Principles

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
- 本文（`.prose`）: `prose prose-lg max-w-3xl mx-auto mt-14`
- フッター: 上 80px、下 40px

### ホームの構成順

`Hero` → `FeatureGrid` → 最新のブログ → 最新のリザルト → `CtaBox`

---

## 6. Depth & Elevation

影は使わない。面の切り替え（白 / `off-white` / 黒）と罫線、角丸だけで階層を作る。

| トークン       | 値  | 用途                     |
| -------------- | --- | ------------------------ |
| `rounded-sm`   | 4px | ボタン                   |
| `rounded-md`   | 6px | 画像、プレースホルダー面 |
| `rounded-lg`   | 8px | CTA ボックス             |
| `rounded-full` | —   | アイコンの黒丸           |

---

## 7. Do's and Don'ts

### Do（推奨）

- 色・フォント・サイズ・角丸は `global.css` のトークンと utility だけを使う
- 日本語ページでも欧文だけの見出しには `lang="en"` を付ける
- 見出しは `h1`〜`h6` の要素を使い、サイズは `text-h*` で指定する（ウェイトは要素、行間と字間は utility が言語ごとに決める）
- 補足テキストは `text-medium`、黒面の補足は `text-soft` にする
- ページタイトルは `PageHeader` に任せる（中央揃え、キッカー、日付）

### Don't（禁止）

- 任意値（`text-[13px]`、`bg-[#333]`）を使わない
- `accent` をキッカー以外に使わない
- 影（`shadow-*`）を使わない。角丸は `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-full` 以外を使わない
- 見出し・ナビ・ボタンを uppercase にしない
- 日本語本文の行間を 1.6 未満にしない
- `font-family` から Hiragino / Meiryo のフォールバックを外さない
- 黒面を CTA ボックス以外に増やさない

---

## 8. Responsive Behavior

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

### フォントサイズの調整

- 見出しは 3.4 の表のとおり 3 段階。本文は 16px を維持
- ヒーローの線画は `md` 未満で非表示。ヒーローのボタンは `md` 未満で縦積み
- `EntryList` は `md` 以上で 2 列、`FeatureGrid` は `md` 以上で 3 列

---

## 9. Agent Prompt Guide

### クイックリファレンス

```
Background: #ffffff（黒面は CTA ボックスとボタンだけ #000000）
Heading: #000000 / Body: #475569 / Meta: #64748b
Font: Bricolage Grotesque → Inter → Hiragino Kaku Gothic ProN → Meiryo
Body: 16px, en 1.5 / 0, ja 1.6 / 0.02em
Headings: text-h1 72px -0.05em … text-h2 48px -0.025em … text-h3 30px
Container: 1280px, padding 20px
Button: black, white text, radius 4px, 10px 20px, no uppercase
```

### プロンプト例

```
KING OF GROUND のデザインシステム（DESIGN.md）に従って、大会一覧ページを作成してください。
- 色は global.css のトークンだけ（white / black / ink / body / medium / soft / off-white / accent）
- 見出しは h1〜h6 要素 + text-h* utility。欧文だけの見出しには lang="en"
- ページタイトルは PageHeader、一覧は EntryList を使う
- コンテナは .container-site、セクション間は mt-20
- ボタンは .btn（輪郭線は .btn-outline、黒面では .btn-invert）
- 影は使わない。角丸は rounded-sm / rounded-md / rounded-lg だけ
```
