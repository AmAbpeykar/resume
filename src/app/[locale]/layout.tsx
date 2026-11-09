import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { site } from '@/data/site';
import { localeHref, routing } from '@/i18n/routing';
import '../globals.css';

const geist = localFont({
  src: '../fonts/geist-latin.woff2',
  variable: '--font-geist',
  weight: '100 900',
  display: 'swap',
});

const shabnam = localFont({
  src: [
    { path: '../fonts/Shabnam.woff', weight: '400' },
    { path: '../fonts/Shabnam-Medium.woff2', weight: '500' },
    { path: '../fonts/Shabnam-Bold.woff2', weight: '700' },
  ],
  variable: '--font-shabnam',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: 'unicode-range', value: 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+200C-200F, U+FB50-FDFF, U+FE70-FEFF' },
  ],
});

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = t('title');
  const description = t('description');
  const canonical = site.origin ? new URL(localeHref(locale), site.origin) : undefined;
  const socialImage = site.origin ? new URL('/images/profile.jpg', site.origin) : undefined;

  return {
    title,
    description,
    metadataBase: site.origin,
    icons: { icon: '/mark.svg' },
    alternates: site.origin ? {
      canonical,
      languages: {
        en: localeHref('en'),
        fa: localeHref('fa'),
        'x-default': localeHref(routing.defaultLocale),
      },
    } : undefined,
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      alternateLocale: [locale === 'fa' ? 'en_US' : 'fa_IR'],
      images: socialImage ? [{ url: socialImage, width: 640, height: 640 }] : undefined,
    },
    twitter: {
      card: socialImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props & { children: ReactNode }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const isPersian = locale === 'fa';

  return (
    <html lang={locale} dir={isPersian ? 'rtl' : 'ltr'} className={isPersian ? geist.variable + ' ' + shabnam.variable : geist.variable}>
      <body>{children}</body>
    </html>
  );
}
