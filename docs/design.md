# デザイン仕様 — KING OF GROUND

> タイポグラフィ・レイアウト・階層の値は、和文サイトで実績のある「システムフォント、行間 1.5、字間 0.04em、見出し 40 / 20 / 16」の体系に合わせた。配色はこのサイト独自で、参照元の色は使わない。
> 値はすべて `src/styles/global.css` に定義してある。ここに無い値をマークアップに直書きしない。値だけで判定できる Do / Don't は `tests/styles/global.test.ts` が検査する。

この文書はデザインの原則（方針、色、タイポグラフィ、階層、Do / Don't）を扱う。個々のコンポーネントの寸法、レイアウトの数値、レスポンシブの挙動、エージェント向けのプロンプト例は [design/components.md](./design/components.md) にある。

---

## Visual Theme & Atmosphere

- **デザイン方針**: 白地に黒の見出し、slate 系グレーの本文。要素は角丸 4〜8px の面と余白で区切る。影は開いたモバイルナビだけ
- **面の配置**: 基本は白面。ホームは左右いっぱいの帯を並べ（white / off-white / highlight）、黒面はスクロール中のヘッダーとフッターだけ。ボタンと特徴グリッドのアイコンの黒丸（`size-8 rounded-full bg-black`）は面として数えない
- **密度**: ページの主題（Display 40px）だけを大きく、セクション見出し（20px）から下は本文と同じ行間で詰めて並べる。一覧は情報密度を優先する
- **キーワード**: 明るい、読みやすい、クリーン、日本語でも崩れない
- **特徴**: システムフォントだけで描画し、Web フォントを読み込まない。行間 1.5 と字間 0.04em を ja / en 共通で全体に掛ける

---

## Color Palette & Roles

アクセントは `accent` 1 色で、キッカー（`.kicker`）にだけ使う。

| 役割                                             | トークン    | 値        |
| ------------------------------------------------ | ----------- | --------- |
| 背景                                             | `white`     | `#ffffff` |
| 見出し、ボタン、スクロール中のヘッダー、フッター | `black`     | `#000000` |
| 黒ボタンのホバー                                 | `ink`       | `#262626` |
| 本文、リード文、ナビ                             | `body`      | `#475569` |
| メタ情報（日付など）                             | `medium`    | `#64748b` |
| 罫線、黒面の補足文                               | `soft`      | `#e2e8f0` |
| ホームの帯、表の縞、輪郭線ボタンのホバー         | `off-white` | `#f8fafc` |
| キッカー                                         | `accent`    | `#2563eb` |
| 差し色の帯（文字は `black` / `ink` だけ）        | `highlight` | `#f5a623` |

Tailwind では `text-body`, `text-medium`, `bg-off-white`, `border-soft`, `divide-soft`, `text-accent` のように使う。Tailwind 既定のパレット（`gray-500` など）は無効にしてある。

---

## Typography Rules

### 和文フォント

- **ゴシック体**: Hiragino Kaku Gothic ProN / Hiragino Sans（macOS / iOS）、Meiryo（Windows）。システムフォント。Web フォント化しない

### 欧文フォント

- **見出し・本文・UI**: SF Pro（`-apple-system` / `BlinkMacSystemFont`）、Segoe UI、`system-ui`。システムフォント
- **等幅**: SFMono-Regular, Consolas, Menlo

書体は 1 系統だけなので `font-*` クラスで切り替えない。

### font-family 指定

```css
--font-sans:
  "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
  "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, system-ui, sans-serif;
--font-mono: SFMono-Regular, Consolas, Menlo, monospace;
```

**フォールバックの考え方**:

- 欧文フォントを先頭に置き、欧文グリフの品質を優先する。`"SF Pro"` は Apple 配布のフォントを入れた環境向け、`-apple-system` は Safari、`BlinkMacSystemFont` は macOS の Chrome、`Segoe UI` は Windows の欧文
- 欧文のシステムフォントには和文グリフが無いので、和文は Hiragino / Meiryo で描画される
- `system-ui` は和文フォントより後ろに置く。前に置くと日本語版 Windows で和文が Yu Gothic UI（幅の狭い UI 用かな）になり Meiryo に届かない。末尾の `system-ui` は Android / Linux の欧文だけに効く

### 文字サイズ・ウェイト階層

見出しはすべて 700（`h1`〜`h6` の要素で決まる）。サイズは `text-h*` utility で決まり、行間 1.5 と字間 0.04em は全体と共通。

| Utility   | Desktop / Tablet  | Mobile | Weight | 用途                                                                                                                    |
| --------- | ----------------- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------- |
| `text-h1` | 40px              | 28px   | 700    | Display。ホームのヒーロー wordmark、ページタイトル（`PageHeader`、404、メンテナンス中画面の wordmark）。1 ページに 1 つ |
| `text-h2` | 20px              | 20px   | 700    | セクション見出し、CTA、一覧のエントリタイトル、101 のカテゴリ名、リザルトの年とラウンド、本文中の h2                    |
| `text-h3` | 16px              | 16px   | 700    | 特徴グリッドの見出し、順位表のクラス名、101 の記事タイトル（一覧内）、本文中の h3 / h4                                  |
| Body      | 16px              | 16px   | 400    | 本文、リード文（`text-body`）、記事本文（`.prose`）、ヘッダーの wordmark                                                |
| Caption   | 12px（`text-xs`） | 12px   | 400    | 日付、更新日、フッター、表の見出し行、キッカー（700・uppercase）                                                        |
| Small     | 10px              | —      | —      | 使わない。utility も定義しない（`text-*` は `text-xs` だけ）                                                             |

Display は「ページの主題の名前」の役で、CTA の見出しには使わない（CTA の存在感は `highlight` の帯と余白が担う）。40 : 20 : 16 の間に中間サイズは足さない。20 / 16 / 16 の段差は 700 のウェイトと余白（見出し → 内容 `mt-10`、帯間 64px）で持たせる。

### 行間・字間

|            | ja / en 共通                       |
| ---------- | ---------------------------------- |
| 本文       | 1.5 / 0.04em                       |
| 見出し     | 1.5 / 0.04em                       |
| Caption    | 1.5 / 0.04em                       |
| 大文字変換 | しない（`.kicker` だけ uppercase） |

- `html` に `line-height: 1.5; letter-spacing: 0.04em` を置く。行間は比率で継承されるが、字間は計算値の px（0.64px）で継承されるので、`text-h1`〜`text-h3` と `.prose` の見出しで `0.04em` を再宣言する。12px の Caption は 0.64px（0.053em）のままでよい
- 和文の可読性のための字間なので、欧文（en ページ、`lang="en"` の見出し）にも同じ値を掛ける。wordmark は全て大文字なので正の字間が合う

**欧文だけの見出しの例外**: 「KING OF GROUND」の wordmark や大会名のように、日本語ページでも欧文だけで書く見出しは、要素に `lang="en"` を付ける。字間は共通だが、禁則（`:lang(ja)` の `word-break` / `line-break`）が欧文に掛からなくなる。

### 禁則処理・改行ルール

```css
/* ja */
word-break: normal;
overflow-wrap: anywhere;
line-break: strict;

/* en */
overflow-wrap: break-word;
```

`word-break: break-all` は和文中の欧文単語（BMX、KING OF GROUND）を途中で割るので使わない。`text-h1`〜`text-h3` と `text-balance` の和文は `word-break: auto-phrase`（対応ブラウザのみ）で文節ごとに折る。未対応ブラウザは `normal`。

### OpenType 機能

```css
font-feature-settings: normal; /* palt 未適用。字間は letter-spacing で調整する */
```

### 縦書き

該当なし

---

## Depth & Elevation

面の切り替え（白 / `off-white` / `highlight` / 黒）と罫線、角丸で階層を作る。影は 3 段のトークンだけで、用途は決まっている。

| トークン   | 値                             | 用途                                                                                        |
| ---------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| Level 0    | none                           | フラットな要素（帯、罫線の一覧、プレースホルダー面）                                        |
| `shadow-1` | `0 2px 8px rgb(0 0 0 / 0.08)`  | サムネイル。画像フィールドが入って `<Image>` になったときに使う。現在は未使用               |
| `shadow-2` | `0 4px 16px rgb(0 0 0 / 0.12)` | ドロップダウン。`lg` 未満で開いたモバイルナビ（`.site-header:has([aria-expanded="true"])`） |
| `shadow-3` | `0 8px 32px rgb(0 0 0 / 0.16)` | モーダル、ダイアログ。現在は未使用                                                          |

プレースホルダー面（罫線だけ）に影を付けると `off-white` の帯の上で消えて帯ごとに見え方が変わる。スクロール中の黒いヘッダーは黒 / 白の縁が既に分離しているので影を付けない。

| トークン       | 値  | 用途                     |
| -------------- | --- | ------------------------ |
| `rounded-sm`   | 4px | ボタン                   |
| `rounded-md`   | 6px | 画像、プレースホルダー面 |
| `rounded-lg`   | 8px | —（現在は未使用）        |
| `rounded-full` | —   | アイコンの黒丸           |

---

## Do's and Don'ts

### Do（推奨）

- 色・フォント・サイズ・角丸・影は `global.css` のトークンと utility だけを使う
- `font-family` は SF Pro → system の欧文 → 和文（Hiragino / Meiryo）→ `system-ui` → `sans-serif` のチェーンを維持する
- 行間 1.5、字間 0.04em を全体に掛ける。見出しの utility では字間を `em` で再宣言する
- 日本語ページでも欧文だけの見出しには `lang="en"` を付ける
- 見出しは `h1`〜`h6` の要素を使い、サイズは `text-h1` / `text-h2` / `text-h3` で指定する（ウェイトは要素で 700）。Display（`text-h1`）は 1 ページに 1 つ
- 補足テキストは `text-xs text-medium`、黒面の補足は `text-soft` にする
- ページタイトルは `PageHeader` に任せる（中央揃え、キッカー、日付）
- 本文の行長は `max-w-2xl`（en 約 80 字、ja 約 40 字）に収める

### Don't（禁止）

- 任意値（`text-[13px]`、`bg-[#333]`）を使わない
- `accent` をキッカー以外に使わない
- `font-family` から SF Pro / `system-ui` / Hiragino / Meiryo を外さない。Web フォントを読み込まない
- 字間を 0 にしない。行間を 1.5 未満にしない
- 見出しのウェイトを 700 未満にしない。中間サイズを足さない。`text-sm` / `text-lg` などは定義していないので書いても効かない（`text-*` は `text-xs` だけ）
- `shadow-1` / `shadow-2` / `shadow-3` 以外の影を使わない。角丸は `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-full` 以外を使わない
- 見出し・ナビ・ボタンを uppercase にしない
- 帯の色は `white` / `off-white` / `highlight` / `black` から選ぶ。`highlight` は 1 ページに 1 帯まで、黒面はスクロール中のヘッダーとフッターだけ（ボタンとアイコンの黒丸は除く）
- `highlight` の上に `black` / `ink` 以外の文字を置かない。`.btn-outline` も置かない（白地が 2.0:1 で面として浮く）
