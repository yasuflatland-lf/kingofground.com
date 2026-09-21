import { describe, expect, it } from 'vitest';
import { formatDate } from '../../src/i18n/format';

describe('formatDate', () => {
  const date = new Date('2025-04-20T00:00:00Z');

  it('ja は年月日', () => {
    expect(formatDate(date, 'ja')).toBe('2025年4月20日');
  });

  it('en は Month D, YYYY', () => {
    expect(formatDate(date, 'en')).toBe('April 20, 2025');
  });
});
