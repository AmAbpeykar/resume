import { Blocks, Container, Layers3, Network } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/animations/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { experience } from '@/data/portfolio';

const icons = { product: Layers3, systems: Network, operations: Container };

export async function Experience() {
  const t = await getTranslations('experience');

  return (
    <section id="experience" tabIndex={-1} className="section shell experience-section" aria-labelledby="experience-title">
      <div className="experience-layout">
        <div>
          <SectionHeading index="04" id="experience-title" label={t('label')} title={t('title')} intro={t('intro')} />
          <Reveal className="collaborations" delay={100}>
            <h3 className="micro"><Blocks size={15} aria-hidden="true" />{t('collaborations')}</h3>
            <ul>
              {(t.raw('organizations') as string[]).map((name) => <li key={name}>{name}</li>)}
            </ul>
          </Reveal>
        </div>
        <ul className="experience-track">
          {experience.map((role, index) => {
            const Icon = icons[role];
            return (
              <li key={role}>
                <Reveal className="experience-item" delay={index * 65}>
                  <span className="track-icon"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /></span>
                  <div>
                    <h3>{t(`roles.${role}.title`)}</h3>
                    <p>{t(`roles.${role}.description`)}</p>
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
