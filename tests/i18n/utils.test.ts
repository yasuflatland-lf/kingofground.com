import { describe, expect, it } from 'vitest';
import { defaultLocale, locales } from '../../src/i18n/config';
import {
  isLocale,
  localeFromParam,
  localePath,
  localePaths,
  localeStaticPaths,
  otherLocales,
} from '../../src/i18n/utils';

describe('config', () => {
  it('ja がデフォルトで、ロケールは ja と en', () => {
    expect(locales).toEqual(['ja', 'en']);
    expect(defaultLocale).toBe('ja');
  });
});

describe('isLocale', () => {
  it('既知のロケール文字列だけ true', () => {
    expect(isLocale('ja')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe('localeFromParam', () => {
  it('undefined はデフォルトロケール', () => {
    expect(localeFromParam(undefined)).toBe('ja');
  });
  it('en は en', () => {
    expect(localeFromParam('en')).toBe('en');
  });
  it('ja はプレフィックスとして使わないので throw', () => {
    expect(() => localeFromParam('ja')).toThrow(/Unknown locale segment/);
  });
  it('未知の値は throw', () => {
    expect(() => localeFromParam('fr')).toThrow(/Unknown locale segment/);
  });
});

describe('localePath', () => {
  it('ja はプレフィックスなし', () => {
    expect(localePath('ja', '/blogs/')).toBe('/blogs/');
    expect(localePath('ja')).toBe('/');
  });
  it('en は /en/ を前置', () => {
    expect(localePath('en', '/blogs/')).toBe('/en/blogs/');
    expect(localePath('en')).toBe('/en/');
  });
  it('末尾スラッシュを補う', () => {
    expect(localePath('en', '/blogs/hello')).toBe('/en/blogs/hello/');
  });
  it('先頭が / でなければ throw', () => {
    expect(() => localePath('ja', 'blogs/')).toThrow(/must start with/);
  });
});

describe('localePaths', () => {
  it('与えたロケールの分だけパスを返す', () => {
    expect(localePaths(['ja', 'en'], '/blogs/hello/')).toEqual({
      ja: '/blogs/hello/',
      en: '/en/blogs/hello/',
    });
    expect(localePaths(['ja'], '/blogs/hello/')).toEqual({ ja: '/blogs/hello/' });
  });
});

describe('localeStaticPaths', () => {
  it('ja は lang: undefined、en は lang: en', () => {
    expect(localeStaticPaths()).toEqual([
      { params: { lang: undefined }, props: { locale: 'ja' } },
      { params: { lang: 'en' }, props: { locale: 'en' } },
    ]);
  });
});

describe('otherLocales', () => {
  it('自分以外のロケール', () => {
    expect(otherLocales('ja')).toEqual(['en']);
    expect(otherLocales('en')).toEqual(['ja']);
  });
});
