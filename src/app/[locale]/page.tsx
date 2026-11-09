import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { About } from '@/components/about/about';
import { CursorGlow } from '@/components/animations/cursor-glow';
import { Contact } from '@/components/contact/contact';
import { Experience } from '@/components/experience/experience';
import { Hero } from '@/components/hero/hero';
import { Footer } from '@/components/layout/footer';
import { SectionSwiper } from '@/components/layout/section-swiper';
import { Philosophy } from '@/components/philosophy/philosophy';
import { Projects } from '@/components/projects/projects';
import { Skills } from '@/components/skills/skills';
import { routing } from '@/i18n/routing';

export default async function Portfolio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <CursorGlow />
      <SectionSwiper
        locale={locale}
        name={t('common.name')}
        skipLabel={t('common.skip')}
        labels={{
          label: t('nav.label'), language: t('nav.language'), open: t('nav.open'), close: t('nav.close'),
          home: t('nav.home'), about: t('nav.about'), skills: t('nav.skills'), projects: t('nav.projects'),
          experience: t('nav.experience'), philosophy: t('nav.philosophy'), contact: t('nav.contact'),
        }}
        panels={{
          home: <Hero />,
          about: <About />,
          skills: <Skills />,
          projects: <Projects />,
          experience: <Experience />,
          philosophy: <Philosophy />,
          contact: <><Contact /><Footer /></>,
        }}
      />
    </>
  );
}
