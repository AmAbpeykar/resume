import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

export function localeHref(locale: Locale, section?: string) {
  return '/' + locale + '/' + (section ? '#' + section : '');
}
