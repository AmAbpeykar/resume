import { Layers3 } from 'lucide-react';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/animations/reveal';
import { SectionHeading } from '@/components/ui/section-heading';

export async function About() {
  const t = await getTranslations('about');
  const format = await getFormatter();

  return (
    <section id="about" tabIndex={-1} className="section about-section shell" aria-labelledby="about-title">
      <div className="about-editorial">
        <SectionHeading index="01" id="about-title" label={t('label')} title={t('title')} />
        <Reveal className="about-copy" delay={70}>
          <p>{t('intro')}</p>
          <p>{t('body')}</p>
        </Reveal>
      </div>
      <div className="about-metrics">
        <Reveal className="metric" delay={30}>
          <span className="metric-value"><bdi>{format.number(6)}<span>+</span></bdi></span>
          <span className="metric-label">{t('years')}</span>
        </Reveal>
        <Reveal className="metric" delay={100}>
          <span className="metric-value">{format.number(3)}</span>
          <span className="metric-label">{t('senior')}</span>
        </Reveal>
        <Reveal className="metric metric-focus" delay={170}>
          <span className="metric-icon"><Layers3 size={29} strokeWidth={1.45} aria-hidden="true" /></span>
          <span className="metric-caption micro">{t('workbench')}</span>
          <span className="metric-label">{t('range')}</span>
        </Reveal>
      </div>
    </section>
  );
}
