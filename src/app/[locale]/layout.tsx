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

const vazirmatn = localFont({
  src: '../fonts/vazirmatn-arabic.woff2',
  variable: '--font-vazirmatn',
  weight: '100 900',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
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

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'} className={geist.variable + ' ' + vazirmatn.variable}>
      <body>{children}</body>
    </html>
  );
}
