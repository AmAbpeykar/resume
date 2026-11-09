import type { Metadata } from 'next';
import { localeHref, routing } from '@/i18n/routing';
import en from '@/messages/en.json';

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  robots: { index: false, follow: true },
  icons: { icon: '/mark.svg' },
};

export default function EntryPage() {
  return (
    <main className="entry">
      <meta httpEquiv="refresh" content={'0;url=' + localeHref(routing.defaultLocale)} />
      <h1>{en.common.name}</h1>
      <div className="flex gap-5">
        <a href={localeHref('en')} hrefLang="en">English</a>
        <a href={localeHref('fa')} hrefLang="fa" lang="fa" dir="rtl">فارسی</a>
      </div>
    </main>
  );
}
