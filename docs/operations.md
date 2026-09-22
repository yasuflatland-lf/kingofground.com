# デプロイと外部設定

## CI とデプロイ

- `ci.yml`: PR と `main` への push で、`pnpm install --frozen-lockfile` → `biome ci` → `astro check` → `vitest run` → `astro build` を実行する。ローカルの `pnpm verify` と同じ順序。
- `deploy.yml`: `main` への push（または手動実行）で `dist/` をビルドし、`actions/deploy-pages` で GitHub Pages に配信する。Node は `.node-version`、pnpm は `packageManager` の版を使う。
- サイトの URL は `astro.config.ts` の `site`（`https://kingofground.com`）。カスタムドメインは `public/CNAME` にも同じ値がある。

## 初回だけ必要な手動設定

1. Settings → Pages → Source を **GitHub Actions** にし、Custom domain に `kingofground.com` を入れる。
2. DNS: `A @` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`。`CNAME www` → `yasuflatland-lf.github.io`。
3. DNS が伝播したら Enforce HTTPS を ON にする。
4. Mend Renovate の GitHub App をこのリポジトリにインストールする。
5. Settings → General で **Allow auto-merge** を ON にし、`main` のルールセットで `ci` チェックを必須にする。Renovate の automerge はこれが無いと動かない。

## Renovate の方針

設定は `renovate.json`。

- リリースから 3 日経っていない版は候補にしない（`minimumReleaseAge`）。
- minor / patch は automerge。major は手動。ただし GitHub Actions は major も automerge。
- TypeScript 7 の major PR は、`@astrojs/check` が対応してからマージする。
