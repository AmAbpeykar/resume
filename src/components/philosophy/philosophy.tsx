import { BookOpen, Gauge, Layers3, Orbit, RadioTower } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/animations/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { principles } from '@/data/portfolio';

const icons = {
  architecture: Layers3,
  production: RadioTower,
  performance: Gauge,
  ownership: Orbit,
  learning: BookOpen,
};

export async function Philosophy() {
  const t = await getTranslations('philosophy');

  return (
    <section id="philosophy" tabIndex={-1} className="philosophy-section" aria-labelledby="philosophy-title">
      <div className="section shell philosophy-layout">
        <SectionHeading index="05" id="philosophy-title" label={t('label')} title={t('title')} intro={t('intro')} />
        <ul className="principles">
          {principles.map((principle, index) => {
            const Icon = icons[principle];
            return (
              <li key={principle}>
                <Reveal className="principle" delay={index * 45}>
                  <span className="principle-index micro" dir="ltr" aria-hidden="true">0{index + 1}</span>
                  <Icon size={24} strokeWidth={1.55} aria-hidden="true" />
                  <div>
                    <h3>{t(`principles.${principle}.title`)}</h3>
                    <p>{t(`principles.${principle}.description`)}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
