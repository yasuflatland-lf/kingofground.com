import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// AGENTS.md に書いた階層の規則を CI で強制する。
// L1 = AGENTS.md（50 行以内）、L2 = docs/*.md（300 行以内）、L3 = docs/<topic>/*.md（上限なし）。
const root = fileURLToPath(new URL('../..', import.meta.url));
const L1_MAX_LINES = 50;
const L2_MAX_LINES = 300;

function countLines(path: string): number {
  return readFileSync(path, 'utf8').replace(/\n$/, '').split('\n').length;
}

function listMarkdown(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((path) => !relative(root, path).startsWith(join('docs', 'superpowers')));
}

const docsDir = join(root, 'docs');
const l2Files = listMarkdown(docsDir).filter((path) => dirname(path) === docsDir);
const allDocs = [join(root, 'AGENTS.md'), join(root, 'README.md'), ...listMarkdown(docsDir)];

describe('ドキュメントの階層', () => {
  it(`L1: AGENTS.md は ${L1_MAX_LINES} 行以内`, () => {
    expect(countLines(join(root, 'AGENTS.md'))).toBeLessThanOrEqual(L1_MAX_LINES);
  });

  it('L2: docs/ 直下に少なくとも 1 つの文書がある', () => {
    expect(l2Files.length).toBeGreaterThan(0);
  });

  it.each(l2Files.map((path) => [relative(root, path), path]))(
    `L2: %s は ${L2_MAX_LINES} 行以内`,
    (_name, path) => {
      expect(countLines(path)).toBeLessThanOrEqual(L2_MAX_LINES);
    },
  );
});

describe('ドキュメント内の相対リンク', () => {
  const linkPattern = /\[[^\]]*\]\(([^)\s]+)\)/g;

  it.each(allDocs.map((path) => [relative(root, path), path]))(
    '%s のリンク先がすべて存在する',
    (_name, path) => {
      const content = readFileSync(path, 'utf8');
      const broken = [...content.matchAll(linkPattern)]
        .map((match) => match[1])
        .filter((target) => !/^(https?:|mailto:|#)/.test(target))
        .map((target) => target.replace(/#.*$/, ''))
        .filter((target) => !existsSync(resolve(dirname(path), target)));
      expect(broken).toEqual([]);
    },
  );
});
