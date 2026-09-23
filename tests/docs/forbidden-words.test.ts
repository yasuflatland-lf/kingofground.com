import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// 参考にしたテンプレートの名前をリポジトリのどこにも残さない。
// パターンを分割しているのは、このファイル自身が検査に引っかからないようにするため。
const forbidden: Array<{ label: string; pattern: RegExp }> = [
  { label: 'テンプレート名', pattern: /astro[-\s]?ship/i },
  { label: 'テンプレートの配布元', pattern: /web3[-\s]?templates/i },
];

const root = fileURLToPath(new URL('../..', import.meta.url));
const skipDirs = new Set(['.git', '.astro', '.claude', 'node_modules', 'dist']);
const skipFiles = new Set(['pnpm-lock.yaml']);
const binary = /\.(png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|pdf|mp4)$/i;

function listTextFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return skipDirs.has(entry.name) ? [] : listTextFiles(path);
    if (!entry.isFile() || skipFiles.has(entry.name) || binary.test(entry.name)) return [];
    return [path];
  });
}

describe('禁止語', () => {
  const files = listTextFiles(root);

  it('検査対象のファイルがある', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(forbidden.map(({ label, pattern }) => [label, pattern]))(
    '%s をどのファイルにも書かない',
    (_label, pattern) => {
      const hits = files
        .filter((path) => pattern.test(readFileSync(path, 'utf8')))
        .map((path) => relative(root, path));
      expect(hits).toEqual([]);
    },
  );
});
