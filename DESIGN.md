# DESIGN.md — KING OF GROUND

> kingofground.com のデザイン仕様。配色と欧文タイポグラフィは Zinox Studio（https://zinox-astro.vercel.app/）、和文タイポグラフィと余白は Toyota の DESIGN.md（awesome-design-md-jp）から採り、一つに統合した。
> 値はすべて `src/styles/global.css` に定義してある。ここに無い値をマークアップに直書きしない。

---

## 1. Visual Theme & Atmosphere

- **デザイン方針**: 黒と白だけで構成する高コントラストのモノクロ。大きな Anton の見出しと、余白で区切るフラットな面
- **面の配置**: ヘッダー・フッター・ホームのヒーローは黒面、それ以外は白面
- **キーワード**: ストリート、力強い、簡潔、日本語でも崩れない
- **特徴**: 欧文を先頭に置いたフォールバックチェーン。和文は `:lang(ja)` で行間 1.5・字間 0.04em に切り替える

---

## 2. Color Palette & Roles

アクセント色は持たない。

| 役割 | トークン | 値 |
|------|----------|-----|
| 背景 | `white` | `#ffffff` |
| 反転背景 | `black` | `#000000` |
| 見出し | `black` | `#000000` |
| 本文 | `body` | `rgba(0,0,0,.7)` |
| 反転面の本文 | `white` | `#ffffff` |
| 反転面の補足 | `silver` | `#b1b2b0` |
| 補足テキスト | `medium` | `#737373` |
| 罫線 | `soft` | `#e5e5e5` |
| 反転面の罫線 | `steel` | `#525252` |
| サーフェス（テーブルの縞、カード） | `off-white` | `#fafafa` |
| タグ背景 | `graphite` | `#202020` |
| ホバー面 | `slate` | `#404040` |
| 予備のグレー | `ink` `#0a0a0a` / `charcoal` `#171717` / `light` `#d4d4d4` / `snow` `#f5f5f5` | |

Tailwind では `text-body`, `bg-off-white`, `border-soft`, `divide-soft` のように使う。

---

## 3. Typography Rules

### 3.1 和文フォント

- **ゴシック体**: Hiragino Kaku Gothic ProN, Meiryo（システムフォント。Web フォント化しない）

### 3.2 欧文フォント

- **見出し**: Anton（1 ウェイトのみ）
- **本文**: Inter Tight（可変フォント）
- **UI（ナビ・ボタン・タグ・メタ）**: Space Grotesk（可変フォント）
- **等幅**: SFMono-Regular, Consolas, Menlo

欧文 3 書体は `@fontsource` でセルフホストし、外部にリクエストしない。

### 3.3 font-family 指定

```css
--font-display: 'Anton', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
--font-body: 'Inter Tight Variable', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
--font-ui: 'Space Grotesk Variable', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
--font-mono: SFMono-Regular, Consolas, Menlo, monospace;
```

**フォールバックの考え方**:
- 欧文フォントを先頭に置き、欧文グリフの品質を優先する
- Anton には和文グリフが無いので、和文の見出しは Hiragino / Meiryo で描画される
- 和文の見出しは 700 にするが、`font-synthesis-weight: none` により Anton は 400 のまま（合成ボールドにしない）

### 3.4 文字サイズ・ウェイト階層

| Role | Font | Desktop / Tablet / Mobile | Weight | 用途 |
|------|------|---------------------------|--------|------|
| display | Anton | 150 / 80 / 60px | 400 | ホームのヒーロー wordmark |
| h1 | Anton | 72 / 52 / 40px | 400（ja 700） | 一覧ページ・セクションページのタイトル |
| h2 | Anton | 54 / 42 / 36px | 400（ja 700） | 記事タイトル |
| h3 | Anton | 48 / 36 / 32px | 400（ja 700） | ホームのセクション見出し |
| h4 | Anton | 42 / 30 / 26px | 400（ja 700） | 本文中の h2 |
| h5 | Anton | 30 / 24 / 20px | 400（ja 700） | 本文中の h3、順位表のクラス名 |
| h6 | Anton | 20 / 18 / 18px | 400（ja 700） | 本文中の h4 以下、一覧の見出し |
| Body | Inter Tight | 16px | 400 | 本文 |
| UI | Space Grotesk | 14–16px | 400 | ナビ、ボタン、タグ、日付 |

Tailwind では `text-display`, `text-h1` … `text-h6` を使う（font-size だけを指定し、行間は言語で決まる）。

### 3.5 行間・字間

| | en（Zinox） | ja（Toyota） |
|---|---|---|
| 本文 | 1.4 / 0 | **1.5 / 0.04em** |
| 見出し h1–h2 | 1.0 / -0.02em | 1.3 / 0.04em |
| 見出し h3 | 1.2 / -0.02em | 1.3 / 0.04em |
| 見出し h4–h6 | 1.2（h5 は 1.1）/ -0.02em | 1.5 / 0.04em |
| 大文字変換 | 見出し・UI は uppercase | しない |

ja の h1–h3 を Toyota の 1.5 より詰めているのは、40px を超える和文見出しでは 1.5 だと行間が開きすぎるため。

**欧文だけの見出しの例外**: 「KING OF GROUND」の wordmark や大会名のように、日本語ページでも欧文だけで書く見出しは、要素に `lang="en"` を付ける。これで `:lang(en)` の行間・字間・大文字変換が適用される。

### 3.6 禁則処理・改行ルール

```css
/* ja */
word-break: break-all;
overflow-wrap: break-word;
line-break: strict;

/* en */
overflow-wrap: break-word;
```

### 3.7 OpenType 機能

```css
font-feature-settings: normal; /* palt 未適用。字間は letter-spacing で調整する */
```

### 3.8 縦書き

該当なし

---

## 4. Component Stylings

### Buttons（`.btn`）

- Background: `#000000`、Text: `#ffffff`
- Padding: 12px 40px、最小高さ 44px
- Border Radius: 0（角丸なし）
- Font: Space Grotesk 16px / 1.2、uppercase（ja は変換なし）
- Hover: background `#404040`
- 反転面（`.btn.btn-invert`）: background `#ffffff`、Text `#000000`、hover `#e5e5e5`

### Text buttons（`.text-btn`）

- Font: Space Grotesk、uppercase（ja は変換なし）
- Hover: 下線

### Tags（`.tag`）

- Background: `#202020`、Text: `#ffffff`
- Padding: 2px 10px
- Font: Space Grotesk、uppercase（ja は変換なし）

### Navigation links（`.nav-link`）

- Font: Space Grotesk 14px、uppercase（ja は変換なし）
- Padding: 8px 12px、最小高さ 44px
- Hover: background `#404040`

### Tables（順位表、Markdown の表）

- 罫線: `#e5e5e5`
- 偶数行: `#fafafa`
- 見出し行: Space Grotesk 14px uppercase、`#737373`

### Cards

使わない。一覧は罫線（`divide-soft`）で区切る。

---

## 5. Layout Principles

### Spacing Scale

Tailwind の既定スケールのうち、次の 6 段を基本にする。

| Token | Value | Tailwind |
|-------|-------|----------|
| XS | 4px | `1` |
| S | 8px | `2` |
| M | 16px | `4` |
| L | 24px | `6` |
| XL | 40px | `10` |
| XXL | 64px | `16` |

### Container（`.container-site`）

- Max Width: 1200px
- Padding (horizontal): 20px

### Sections

- 上下の余白: 64px（モバイルは 40px）

---

## 6. Depth & Elevation

影は使わない。面の切り替え（黒 / 白）と罫線だけで階層を作る。

---

## 7. Do's and Don'ts

### Do（推奨）

- 色・フォント・サイズは `global.css` のトークンと utility だけを使う
- 日本語ページでも欧文だけの見出しには `lang="en"` を付ける
- 見出しは `h1`〜`h6` の要素を使い、サイズは `text-h*` で指定する（行間は言語で決まる）
- 黒面のテキストは `text-white`、補足は `text-silver` にする

### Don't（禁止）

- 任意値（`text-[13px]`、`bg-[#333]`）を使わない
- アクセント色を足さない
- 影（`shadow-*`）や角丸（`rounded-*`）をボタンに付けない
- 日本語本文の行間を 1.5 未満にしない
- `font-family` から Hiragino / Meiryo のフォールバックを外さない
- Anton に `font-weight: 700` の合成ボールドをかけない（`font-synthesis-weight: none` を維持する）

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Tailwind |
|------|-------|----------|
| Mobile | ≤ 767px | （既定） |
| Tablet | 768–1024px | `md:` |
| Desktop | ≥ 1025px | `lg:` |

### タッチターゲット

- 最小サイズ: 44px × 44px（`.btn`, `.nav-link` は min-height 44px）

### フォントサイズの調整

- 見出しは 3.4 の表のとおり 3 段階。本文は 16px を維持
- 行間は言語ごとの値をレスポンシブでも維持する

---

## 9. Agent Prompt Guide

### クイックリファレンス

```
Background: #ffffff（反転面 #000000）
Heading: #000000 / Body: rgba(0,0,0,.7)
Display font: Anton → Hiragino Kaku Gothic ProN → Meiryo
Body font: Inter Tight → Hiragino Kaku Gothic ProN → Meiryo
UI font: Space Grotesk → Hiragino Kaku Gothic ProN → Meiryo
Body: 16px, en 1.4 / 0, ja 1.5 / 0.04em
Container: 1200px, padding 20px
Button: black, white text, no radius, 12px 40px, uppercase
```

### プロンプト例

```
KING OF GROUND のデザインシステム（DESIGN.md）に従って、大会一覧ページを作成してください。
- 色は global.css のトークンだけ（white / black / body / medium / silver / soft / off-white / graphite / slate）
- 見出しは h1〜h6 要素 + text-h* utility。欧文だけの見出しには lang="en"
- 本文は font-body、ナビ・ボタン・日付は font-ui
- コンテナは .container-site、セクションの上下は py-16（モバイル py-10）
- ボタンは .btn（黒面では .btn.btn-invert）
- 一覧は divide-soft で区切る。影と角丸は使わない
```
