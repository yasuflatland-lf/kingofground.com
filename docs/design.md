# デザイン仕様 — KING OF GROUND

> レイアウト・配色・タイポグラフィの値は 1440px 幅を基準に決め、和文のフォールバックと行間はこのサイト向けに調整した。
> 値はすべて `src/styles/global.css` に定義してある。ここに無い値をマークアップに直書きしない。

この文書はデザインの原則（方針、色、タイポグラフィ、階層、Do / Don't）を扱う。個々のコンポーネントの寸法、レイアウトの数値、レスポンシブの挙動、エージェント向けのプロンプト例は [design/components.md](./design/components.md) にある。

---

## Visual Theme & Atmosphere

- **デザイン方針**: 白地に黒の見出し、slate 系グレーの本文。要素は角丸 4〜8px の面と余白で区切り、影は使わない
- **面の配置**: 基本は白面。大きな黒面はホームの CTA ボックスだけ。ボタンと特徴グリッドのアイコンの黒丸（`size-8 rounded-full bg-black`）は面として数えない。ヘッダー・フッターも白面
- **キーワード**: 明るい、読みやすい、スタートアップ的、日本語でも崩れない
- **特徴**: 欧文を先頭に置いたフォールバックチェーン。和文は `:lang(ja)` で行間 1.6・字間 0.02em に切り替える

---

## Color Palette & Roles

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

## Typography Rules

### 和文フォント

- **ゴシック体**: Hiragino Kaku Gothic ProN, Meiryo（システムフォント。Web フォント化しない）

### 欧文フォント

- **見出し・本文・UI**: Bricolage Grotesque（可変フォント、200–800）。フォールバックに Inter（可変フォント）
- **等幅**: SFMono-Regular, Consolas, Menlo

欧文 2 書体は `@fontsource-variable` でセルフホストし、外部にリクエストしない。書体は 1 系統だけなので `font-*` クラスで切り替えない。

### font-family 指定

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

### 文字サイズ・ウェイト階層

ウェイトは要素で決まる（`h1`, `h2` = 700、`h3`〜`h6` = 600）。サイズ・行間・字間は `text-h*` utility で決まる。

| Utility   | Desktop / Tablet / Mobile | Weight | 用途                                                        |
| --------- | ------------------------- | ------ | ----------------------------------------------------------- |
| `text-h1` | 72 / 56 / 40px            | 700    | ホームのヒーロー                                            |
| `text-h2` | 48 / 40 / 32px            | 700    | ページタイトル、セクション見出し、CTA                       |
| `text-h3` | 30 / 28 / 24px            | 600    | 一覧のエントリタイトル、101 のカテゴリ名、本文中の h2       |
| `text-h4` | 20 / 20 / 18px            | 600    | 特徴グリッドの見出し、本文中の h3                           |
| `text-h5` | 18px                      | 600    | 順位表のクラス名、本文中の h4                               |
| `text-h6` | 16px                      | 600    | 101 の記事タイトル（一覧内）                                |
| Body      | 16px                      | 400    | 本文                                                        |
| 記事本文  | 18px（`.prose-lg`）       | 400    | Markdown の本文。行間は本文と同じ（`line-height: inherit`） |
| Lead      | 18px（`text-lg`）         | 400    | ページタイトル下のリード文（`text-body`）                   |
| Meta      | 14px（`text-sm`）         | 400    | 日付、フッター、キッカー（600）                             |

### 行間・字間

|                      | en                                 | ja               |
| -------------------- | ---------------------------------- | ---------------- |
| 本文                 | 1.5 / 0                            | **1.6 / 0.02em** |
| `text-h1`            | 1.0 / -0.05em                      | 1.25 / 0.02em    |
| `text-h2`            | 1.0 / -0.025em                     | 1.25 / 0.02em    |
| `text-h3`            | 1.375 / -0.025em                   | 1.4 / 0.02em     |
| `text-h4`〜`text-h6` | 1.5 / 0                            | 1.5 / 0.02em     |
| 大文字変換           | しない（`.kicker` だけ uppercase） | しない           |

**欧文だけの見出しの例外**: 「KING OF GROUND」の wordmark や大会名のように、日本語ページでも欧文だけで書く見出しは、要素に `lang="en"` を付ける。これで `:lang(en)` の詰めた字間が適用される。

### 禁則処理・改行ルール

```css
/* ja */
word-break: normal;
overflow-wrap: anywhere;
line-break: strict;

/* en */
overflow-wrap: break-word;
```

`text-h1`〜`text-h3` と `text-balance` の和文は `word-break: auto-phrase`（対応ブラウザのみ）で文節ごとに折る。未対応ブラウザは `normal`。

### OpenType 機能

```css
font-feature-settings: normal; /* palt 未適用。字間は letter-spacing で調整する */
```

### 縦書き

該当なし

---

## Depth & Elevation

影は使わない。面の切り替え（白 / `off-white` / 黒）と罫線、角丸だけで階層を作る。

| トークン       | 値  | 用途                     |
| -------------- | --- | ------------------------ |
| `rounded-sm`   | 4px | ボタン                   |
| `rounded-md`   | 6px | 画像、プレースホルダー面 |
| `rounded-lg`   | 8px | CTA ボックス             |
| `rounded-full` | —   | アイコンの黒丸           |

---

## Do's and Don'ts

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
- 大きな黒面を CTA ボックス以外に増やさない（ボタンとアイコンの黒丸は除く）

