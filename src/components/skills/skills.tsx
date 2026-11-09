import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/animations/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { categories, skills } from '@/data/portfolio';
import { SkillMap, type SkillGroup } from './skill-map';

export async function Skills() {
  const t = await getTranslations('skills');
  const groups: SkillGroup[] = categories.map((id) => ({
    id,
    title: t(`categories.${id}.title`),
    description: t(`categories.${id}.description`),
    items: skills[id].map((item) => typeof item === 'string'
      ? { label: item, latin: true }
      : { label: t(`items.${item.key}`), latin: false }),
  }));

  return (
    <section id="skills" tabIndex={-1} className="section shell" aria-labelledby="skills-title">
      <SectionHeading index="02" id="skills-title" label={t('label')} title={t('title')} intro={t('intro')} />
      <Reveal delay={70}>
        <SkillMap groups={groups} labels={{ map: t('map'), core: t('core'), selector: t('selector'), stack: t('stack') }} />
      </Reveal>
    </section>
  );
}
